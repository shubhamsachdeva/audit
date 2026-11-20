import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { resources, resourcesById, topicLabels } from '../data'
import type { Level, ResourceType, Topic } from '../data/types'
import { useProgress } from '../store/progress'
import { ResourceRow, StudyPanel } from '../components/Study'
import { typeMeta } from '../components/bits'

type Status = 'all' | 'todo' | 'started' | 'done'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [type, setType] = useState<ResourceType | 'all'>('all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [status, setStatus] = useState<Status>('all')
  const ledger = useProgress((s) => s.resources)
  const open = params.get('r') ? resourcesById[params.get('r')!] : undefined

  const topics = useMemo(() => [...new Set(resources.map((r) => r.topic))], [])
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return resources.filter((r) => {
      if (topic !== 'all' && r.topic !== topic) return false
      if (type !== 'all' && r.type !== type) return false
      if (level !== 'all' && r.level !== level) return false
      const p = ledger[r.id]
      if (status === 'done' && !p?.done) return false
      if (status === 'todo' && p) return false
      if (status === 'started' && (!p || p.done)) return false
      if (!needle) return true
      return [r.title, r.provider, r.author, r.description, ...(r.equivalentTo ?? [])]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(needle))
    })
  }, [q, topic, type, level, status, ledger])

  const select = 'border border-line bg-surface px-3 py-2 text-[0.95rem] focus:border-ink focus:outline-none'

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="text-5xl font-semibold">Catalog</h1>
      <p className="mt-3 max-w-[64ch] text-lg text-ink-soft">
        Every free resource behind the three paths, in one place. Search by topic, lecturer, or the paid course you want to replace, like "CS231n" or "11-785".
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[16rem]">
          <span className="sr-only">Search resources</span>
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, lecturers, course codes"
            className="w-full border border-line bg-surface py-3 pl-10 pr-3 placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
        </label>
        <label>
          <span className="sr-only">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value as Topic | 'all')} className={select}>
            <option value="all">All topics</option>
            {topics.map((t) => <option key={t} value={t}>{topicLabels[t]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Format</span>
          <select value={type} onChange={(e) => setType(e.target.value as ResourceType | 'all')} className={select}>
            <option value="all">All formats</option>
            {(Object.keys(typeMeta) as ResourceType[]).map((t) => <option key={t} value={t}>{typeMeta[t].label}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')} className={select}>
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={select}>
            <option value="all">Any status</option>
            <option value="todo">Not started</option>
            <option value="started">In progress</option>
            <option value="done">Completed</option>
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-ink-soft tabular" aria-live="polite">{list.length} of {resources.length} resources</p>

      {open && (
        <div className="mt-6">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setParams({}, { replace: true })}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-sm hover:bg-surface"
            >
              <X size={14} aria-hidden="true" /> Close player
            </button>
          </div>
          <StudyPanel key={open.id} r={open} />
        </div>
      )}

      {topics.filter((t) => list.some((r) => r.topic === t)).map((t) => (
        <section key={t} className="mt-10">
          <h2 className="text-2xl font-bold">{topicLabels[t]}</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {list.filter((r) => r.topic === t).map((r) => (
              <li key={r.id}>
                <ResourceRow
                  r={r}
                  active={open?.id === r.id}
                  onSelect={() => {
                    setParams({ r: r.id }, { replace: true })
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {list.length === 0 && (
        <div className="mt-10 border border-dashed border-line-strong p-10 text-center">
          <p className="text-lg font-semibold">Nothing matches those filters.</p>
          <button
            type="button"
            className="mt-3 font-semibold text-link hover:underline"
            onClick={() => { setQ(''); setTopic('all'); setType('all'); setLevel('all'); setStatus('all') }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
