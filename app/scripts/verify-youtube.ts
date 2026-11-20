/**
 * Checks every YouTube resource in the catalog against YouTube itself.
 * Playlists: fetches the playlist page for the real title and video count.
 * Videos: uses oEmbed, which also fails when embedding is disabled.
 *
 * Run: node scripts/verify-youtube.ts            (report only)
 *      node scripts/verify-youtube.ts --json out  (also write results to out.json)
 */
import { writeFileSync } from 'node:fs'
import { resources } from '../src/data/resources.ts'

type Result = {
  id: string
  kind: 'playlist' | 'video'
  ytId: string
  ok: boolean
  title?: string
  count?: number
  declared?: number
  problem?: string
}

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' }

function decode(s: string) {
  return s
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\\"/g, '"')
}

async function checkPlaylist(id: string): Promise<Pick<Result, 'ok' | 'title' | 'count' | 'problem'>> {
  const res = await fetch(`https://www.youtube.com/playlist?list=${id}`, { headers: UA })
  if (!res.ok) return { ok: false, problem: `HTTP ${res.status}` }
  const html = await res.text()
  const stats = html.match(/"stats":\[\{"runs":\[\{"text":"([\d,]+)"/) ?? html.match(/"numVideosText":\{"runs":\[\{"text":"([\d,]+)"/) ?? html.match(/([\d,]+) videos/)
  const title = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? html.match(/"title":\{"simpleText":"([^"]+)"/)?.[1]
  if (!stats) {
    const alert = html.match(/"alertRenderer".*?"text":"([^"]+)"/)?.[1]
    return { ok: false, title: title && decode(title), problem: alert ? decode(alert) : 'playlist not found or private' }
  }
  return { ok: true, title: title && decode(title), count: Number(stats[1].replace(/,/g, '')) }
}

async function checkVideo(id: string): Promise<Pick<Result, 'ok' | 'title' | 'problem'>> {
  const u = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`
  const res = await fetch(u, { headers: UA })
  if (res.status === 401) return { ok: false, problem: 'embedding disabled' }
  if (!res.ok) return { ok: false, problem: `HTTP ${res.status} (missing or private)` }
  const j = (await res.json()) as { title: string; author_name: string }
  return { ok: true, title: `${j.title} — ${j.author_name}` }
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>) {
  const out: R[] = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++
        out[k] = await fn(items[k])
      }
    }),
  )
  return out
}

const yt = resources.filter((r) => r.playlistId || r.videoId)
const results = await pool(yt, 6, async (r): Promise<Result> => {
  try {
    if (r.playlistId) {
      const x = await checkPlaylist(r.playlistId)
      return { id: r.id, kind: 'playlist', ytId: r.playlistId, declared: r.lectures, ...x }
    }
    const x = await checkVideo(r.videoId!)
    return { id: r.id, kind: 'video', ytId: r.videoId!, ...x }
  } catch (e) {
    return { id: r.id, kind: r.playlistId ? 'playlist' : 'video', ytId: (r.playlistId ?? r.videoId)!, ok: false, problem: String(e) }
  }
})

let bad = 0
for (const x of results) {
  const countNote = x.kind === 'playlist' && x.ok && x.declared !== undefined && x.count !== x.declared ? `  [declared ${x.declared}, actual ${x.count}]` : ''
  if (!x.ok) bad++
  console.log(`${x.ok ? 'OK  ' : 'FAIL'} ${x.id.padEnd(28)} ${x.kind.padEnd(8)} ${x.ok ? `${x.title ?? ''}${x.count !== undefined ? ` (${x.count})` : ''}` : x.problem}${countNote}`)
}
console.log(`\n${results.length - bad}/${results.length} YouTube resources verified`)

const jsonIdx = process.argv.indexOf('--json')
if (jsonIdx > -1) writeFileSync(`${process.argv[jsonIdx + 1]}.json`, JSON.stringify(results, null, 2))
process.exitCode = bad ? 1 : 0
