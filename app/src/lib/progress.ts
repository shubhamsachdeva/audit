import { modulesById, resourcesById, pathsById } from '../data'
import type { Module, Path, PathId, Resource } from '../data/types'
import type { ResourceProgress } from '../store/progress'

type Ledger = Record<string, ResourceProgress>

/** 0..1 completion of a single resource */
export function resourceFraction(r: Resource, p?: ResourceProgress): number {
  if (!p) return 0
  if (p.done) return 1
  if (r.lectures && r.lectures > 0) return Math.min(1, p.lecturesDone / r.lectures)
  return 0
}

export function hoursDone(r: Resource, p?: ResourceProgress) {
  return r.hours * resourceFraction(r, p)
}

/** Modules count only core resources toward completion; practice and "go deeper" are optional */
export function requiredResources(m: Module) {
  return m.resources.filter((x) => x.role === 'core').map((x) => resourcesById[x.id]).filter(Boolean)
}

export function moduleStats(m: Module, ledger: Ledger) {
  const req = requiredResources(m)
  const total = req.reduce((a, r) => a + r.hours, 0)
  const done = req.reduce((a, r) => a + hoursDone(r, ledger[r.id]), 0)
  const finished = req.filter((r) => ledger[r.id]?.done).length
  return {
    hoursTotal: total,
    hoursDone: done,
    fraction: total ? done / total : 0,
    finished,
    count: req.length,
    complete: req.length > 0 && finished === req.length,
  }
}

export function pathModules(path: Path): Module[] {
  return path.phases.flatMap((ph) => ph.modules.map((id) => modulesById[id])).filter(Boolean)
}

export function pathStats(pathId: PathId, ledger: Ledger) {
  const path = pathsById[pathId]
  const mods = pathModules(path)
  let hoursTotal = 0
  let hoursDoneSum = 0
  let complete = 0
  const seen = new Set<string>()
  let lecturesTotal = 0
  let lecturesDone = 0
  for (const m of mods) {
    const s = moduleStats(m, ledger)
    if (s.complete) complete++
    for (const r of requiredResources(m)) {
      if (seen.has(r.id)) continue
      seen.add(r.id)
      hoursTotal += r.hours
      hoursDoneSum += hoursDone(r, ledger[r.id])
      const units = r.lectures ?? 1
      lecturesTotal += units
      const p = ledger[r.id]
      lecturesDone += p?.done ? units : Math.min(units, p?.lecturesDone ?? 0)
    }
  }
  return {
    modules: mods.length,
    modulesComplete: complete,
    hoursTotal,
    hoursDone: hoursDoneSum,
    fraction: hoursTotal ? hoursDoneSum / hoursTotal : 0,
    lecturesTotal,
    lecturesDone,
    resources: seen.size,
  }
}

/** First required resource in path order that isn't done */
export function nextUp(pathId: PathId, ledger: Ledger) {
  const path = pathsById[pathId]
  for (const m of pathModules(path)) {
    for (const r of requiredResources(m)) {
      if (!ledger[r.id]?.done) return { module: m, resource: r }
    }
  }
  return null
}

export function streak(activity: Record<string, number>) {
  let n = 0
  const d = new Date()
  const key = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
  if (!activity[key(d)]) d.setDate(d.getDate() - 1)
  while (activity[key(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function fmtHours(h: number) {
  if (h < 1 && h > 0) return `${Math.round(h * 60)} min`
  return `${h >= 10 ? Math.round(h) : Math.round(h * 10) / 10} h`
}

export function pct(f: number) {
  return `${Math.round(f * 100)}%`
}

export function embedUrl(r: Resource, index?: number) {
  if (r.type === 'youtube-video' && r.videoId) {
    return `https://www.youtube-nocookie.com/embed/${r.videoId}?rel=0&modestbranding=1`
  }
  if (r.type === 'youtube-playlist' && r.playlistId) {
    const i = index && index > 0 ? `&index=${index}` : ''
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${r.playlistId}${i}&rel=0&modestbranding=1`
  }
  return null
}

export function isPlayable(r: Resource) {
  return !!embedUrl(r)
}
