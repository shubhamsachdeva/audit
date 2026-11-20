import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { DownloadSimple, UploadSimple, Trash, Fire } from '@phosphor-icons/react'
import { paths, resources, resourcesById, topicLabels } from '../data'
import type { Topic } from '../data/types'
import { useProgress } from '../store/progress'
import { hoursDone, pathStats, pct, streak, fmtHours } from '../lib/progress'
import { ProgressBar, TypeIcon } from '../components/bits'

const WEEKS = 26

function key(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function Heatmap({ activity }: { activity: Record<string, number> }) {
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - (WEEKS * 7 - 1) - end.getDay())
  const cols: { k: string; n: number; d: Date }[][] = []
  const cur = new Date(start)
  while (cur <= end) {
    const week: { k: string; n: number; d: Date }[] = []
    for (let i = 0; i < 7 && cur <= end; i++) {
      const k = key(cur)
      week.push({ k, n: activity[k] ?? 0, d: new Date(cur) })
      cur.setDate(cur.getDate() + 1)
    }
    cols.push(week)
  }
  const shade = (n: number) =>
    n === 0 ? 'bg-sunken' : n < 2 ? 'bg-progress/35' : n < 4 ? 'bg-progress/60' : n < 7 ? 'bg-progress/85' : 'bg-progress'
  const active = Object.values(activity).filter(Boolean).length
  return (
    <figure>
      <div className="flex gap-[3px] overflow-x-auto pb-1" role="img" aria-label={`Study activity over the last ${WEEKS} weeks: ${active} active days`}>
        {cols.map((w, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {w.map((c) => (
              <span
                key={c.k}
                className={`size-3.5 ${shade(c.n)}`}
                title={`${c.d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${c.n} ${c.n === 1 ? 'thing' : 'things'} logged`}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="mt-2 flex items-center gap-2 text-xs text-ink-faint">
        Less
        {[0, 1, 3, 5, 8].map((n) => <span key={n} className={`size-3 ${shade(n)}`} aria-hidden="true" />)}
        More
      </figcaption>
    </figure>
  )
}

export default function ProgressPage() {
  const state = useProgress()
  const { resources: ledger, activity, enrolled, importData, reset } = state
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const done = resources.filter((r) => ledger[r.id]?.done)
  const inProgress = resources.filter((r) => ledger[r.id] && !ledger[r.id].done && ledger[r.id].lecturesDone > 0)
  const totalHours = resources.reduce((a, r) => a + hoursDone(r, ledger[r.id]), 0)
  const byTopic = new Map<Topic, { done: number; total: number }>()
  for (const r of resources) {
    const t = byTopic.get(r.topic) ?? { done: 0, total: 0 }
    t.total += r.hours
    t.done += hoursDone(r, ledger[r.id])
    byTopic.set(r.topic, t)
  }
  const recent = Object.entries(ledger)
    .filter(([id]) => resourcesById[id])
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))
    .slice(0, 8)

  const exportData = () => {
    const { resources: r, notes, activity: a, enrolled: e, activePath, lastOpened, theme } = useProgress.getState()
    const blob = new Blob([JSON.stringify({ app: 'audit', version: 1, exportedAt: new Date().toISOString(), state: { resources: r, notes, activity: a, enrolled: e, activePath, lastOpened, theme } }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a2 = document.createElement('a')
    a2.href = url
    a2.download = `audit-progress-${new Date().toISOString().slice(0, 10)}.json`
    a2.click()
    URL.revokeObjectURL(url)
    setMsg('Progress exported.')
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="text-5xl font-semibold">My progress</h1>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="border border-line bg-surface p-5">
          <dt className="text-sm text-ink-soft">Study streak</dt>
          <dd className="mt-1 flex items-center gap-2 font-display text-4xl font-semibold tabular">
            {streak(activity)} <Fire size={28} weight="fill" className="text-streak" aria-hidden="true" />
          </dd>
          <dd className="text-sm text-ink-faint">days in a row</dd>
        </div>
        <div className="border border-line bg-surface p-5">
          <dt className="text-sm text-ink-soft">Hours studied</dt>
          <dd className="mt-1 font-display text-4xl font-semibold tabular">{Math.round(totalHours)}</dd>
          <dd className="text-sm text-ink-faint">estimated from what you logged</dd>
        </div>
        <div className="border border-line bg-surface p-5">
          <dt className="text-sm text-ink-soft">Resources completed</dt>
          <dd className="mt-1 font-display text-4xl font-semibold tabular">{done.length}</dd>
          <dd className="text-sm text-ink-faint">of {resources.length} in the catalog</dd>
        </div>
        <div className="border border-line bg-surface p-5">
          <dt className="text-sm text-ink-soft">In progress</dt>
          <dd className="mt-1 font-display text-4xl font-semibold tabular">{inProgress.length}</dd>
          <dd className="text-sm text-ink-faint">started, not finished</dd>
        </div>
      </dl>

      <section className="mt-10 border border-line bg-surface p-6">
        <h2 className="text-xl font-bold">Last {WEEKS} weeks</h2>
        <div className="mt-4"><Heatmap activity={activity} /></div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-bold">Paths</h2>
          <ul className="mt-4 space-y-3">
            {paths.map((p) => {
              const s = pathStats(p.id, ledger)
              return (
                <li key={p.id}>
                  <Link to={`/path/${p.id}`} className="block border border-line bg-surface p-4 hover:border-ink">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-bold">{p.name}</span>
                      <span className="text-sm text-ink-soft tabular">
                        {enrolled[p.id] ? `${pct(s.fraction)}, ${s.modulesComplete}/${s.modules} modules` : `Not started, ${pct(s.fraction)} already covered`}
                      </span>
                    </div>
                    <div className="mt-3"><ProgressBar value={s.fraction} label={`${p.name} progress`} /></div>
                  </Link>
                </li>
              )
            })}
          </ul>

          <h2 className="mt-10 text-2xl font-bold">By subject</h2>
          <ul className="mt-4 space-y-3">
            {[...byTopic.entries()].map(([t, v]) => (
              <li key={t} className="grid grid-cols-[10rem_1fr_4rem] items-center gap-3 text-sm">
                <span className="truncate">{topicLabels[t]}</span>
                <ProgressBar value={v.total ? v.done / v.total : 0} label={`${topicLabels[t]} progress`} size="sm" />
                <span className="text-right text-ink-soft tabular">{fmtHours(v.done)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Recently touched</h2>
          {recent.length ? (
            <ul className="mt-4 divide-y divide-line border border-line bg-surface">
              {recent.map(([id, p]) => {
                const r = resourcesById[id]
                return (
                  <li key={id}>
                    <Link to={`/catalog?r=${id}`} className="flex items-center gap-3 p-4 hover:bg-sunken/50">
                      <TypeIcon type={r.type} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{r.title}</span>
                        <span className="block text-sm text-ink-faint">
                          {p.done ? 'Completed' : `${p.lecturesDone}/${r.lectures ?? '?'} logged`},{' '}
                          {new Date(p.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-4 border border-dashed border-line-strong p-6 text-ink-soft">
              Nothing logged yet. <Link to="/" className="font-semibold text-link hover:underline">Pick a path</Link> and mark your first lecture.
            </p>
          )}

          <h2 className="mt-10 text-2xl font-bold">Back up your progress</h2>
          <p className="mt-2 text-ink-soft">
            Progress lives in this browser. Export a file to keep a copy or move to another computer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={exportData} className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-semibold text-paper hover:opacity-90">
              <DownloadSimple size={18} aria-hidden="true" /> Export progress
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 font-semibold hover:bg-surface">
              <UploadSimple size={18} aria-hidden="true" /> Import progress
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Erase all progress, notes and streaks from this browser? Export first if you want a copy.')) {
                  reset()
                  setMsg('All progress erased.')
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 font-semibold text-streak hover:bg-surface"
            >
              <Trash size={18} aria-hidden="true" /> Erase progress
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                try {
                  importData(await f.text())
                  setMsg('Progress imported.')
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : 'That file could not be read.')
                }
                e.target.value = ''
              }}
            />
          </div>
          {msg && <p className="mt-3 text-sm font-semibold" role="status">{msg}</p>}
        </section>
      </div>
    </div>
  )
}
