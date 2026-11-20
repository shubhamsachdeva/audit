import { Link, Navigate, useParams, useSearchParams } from 'react-router'
import { CaretLeft, CaretRight, Hammer, ArrowSquareOut } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { modulesById, pathsById, resourcesById } from '../data'
import type { PathId, ResourceRole } from '../data/types'
import { useProgress } from '../store/progress'
import { fmtHours, moduleStats, pathModules } from '../lib/progress'
import { EquivalentChips, ProgressBar } from '../components/bits'
import { ResourceRow, StudyPanel } from '../components/Study'

const roleTitle: Record<ResourceRole, { title: string; hint: string }> = {
  core: { title: 'Core', hint: 'Required to complete the module' },
  practice: { title: 'Practice', hint: 'Assignments and exercises — strongly recommended' },
  deeper: { title: 'Go deeper', hint: 'Optional, for when a topic grabs you' },
}

export default function ModulePage() {
  const { pathId, moduleId } = useParams()
  const [params, setParams] = useSearchParams()
  const ledger = useProgress((s) => s.resources)
  const setLastOpened = useProgress((s) => s.setLastOpened)
  const path = pathsById[pathId as PathId]
  const m = modulesById[moduleId ?? '']

  const firstOpen =
    m?.resources.find((x) => x.role === 'core' && !ledger[x.id]?.done) ??
    m?.resources.find((x) => !ledger[x.id]?.done) ??
    m?.resources[0]
  const selectedId = params.get('r') ?? firstOpen?.id
  const selected = selectedId ? resourcesById[selectedId] : undefined

  useEffect(() => {
    if (path && m && selected) setLastOpened({ pathId: path.id, moduleId: m.id, resourceId: selected.id })
  }, [path, m, selected, setLastOpened])

  if (!path || !m) return <Navigate to="/" replace />

  const mods = pathModules(path)
  const idx = mods.findIndex((x) => x.id === m.id)
  const prev = mods[idx - 1]
  const next = mods[idx + 1]
  const ms = moduleStats(m, ledger)
  const groups = (['core', 'practice', 'deeper'] as ResourceRole[])
    .map((role) => ({ role, items: m.resources.filter((x) => x.role === role && resourcesById[x.id]) }))
    .filter((g) => g.items.length)

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link to={`/path/${path.id}`} className="hover:text-ink hover:underline">{path.name}</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span>Module {idx + 1} of {mods.length}</span>
      </nav>

      <header className="mt-3 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{m.title}</h1>
          <p className="mt-3 max-w-[68ch] text-lg text-ink-soft">{m.summary}</p>
          <div className="mt-4"><EquivalentChips items={m.equivalentTo} max={8} /></div>
        </div>
        <div className="border border-line bg-surface p-4">
          <div className="flex justify-between text-sm text-ink-soft tabular">
            <span>{ms.finished} of {ms.count} required done</span>
            <span>{fmtHours(ms.hoursDone)} / {fmtHours(ms.hoursTotal)}</span>
          </div>
          <div className="mt-2"><ProgressBar value={ms.fraction} label="Module progress" size="lg" /></div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="min-w-0 space-y-8">
          {selected ? <StudyPanel key={selected.id} r={selected} /> : null}

          <section className="grid gap-6 border border-line bg-surface p-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">What this module covers</h2>
              <ul className="mt-3 space-y-1.5 text-[0.95rem]">
                {m.topics.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2.5 size-1.5 shrink-0 bg-ink-faint" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold">You'll be able to</h2>
              <ul className="mt-3 space-y-1.5 text-[0.95rem]">
                {m.outcomes.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2.5 size-1.5 shrink-0 bg-progress" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {m.project && (
            <section className="border-2 border-dashed border-line-strong p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Hammer size={22} aria-hidden="true" /> Build it: {m.project.title}
              </h2>
              <p className="mt-2 max-w-[70ch] text-ink-soft">{m.project.brief}</p>
              {m.project.url && (
                <a href={m.project.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-link hover:underline">
                  Starter material <ArrowSquareOut size={14} aria-hidden="true" />
                </a>
              )}
            </section>
          )}

          <nav aria-label="Module navigation" className="flex flex-wrap justify-between gap-3">
            {prev ? (
              <Link to={`/path/${path.id}/module/${prev.id}`} className="flex items-center gap-2 border border-line px-4 py-3 hover:bg-surface">
                <CaretLeft size={16} aria-hidden="true" />
                <span><span className="block text-xs text-ink-faint">Previous</span>{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link to={`/path/${path.id}/module/${next.id}`} className="flex items-center gap-2 border border-line px-4 py-3 text-right hover:bg-surface">
                <span><span className="block text-xs text-ink-faint">Next</span>{next.title}</span>
                <CaretRight size={16} aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>

        <aside aria-label="Module resources" className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:pr-1">
          {groups.map((g) => (
            <section key={g.role} className="mb-6">
              <h2 className="text-lg font-bold">{roleTitle[g.role].title}</h2>
              <p className="text-sm text-ink-faint">{roleTitle[g.role].hint}</p>
              <ul className="mt-3 space-y-2">
                {g.items.map((x) => (
                  <li key={x.id}>
                    <ResourceRow
                      r={resourcesById[x.id]}
                      note={x.note}
                      active={x.id === selected?.id}
                      onSelect={() => {
                        setParams({ r: x.id }, { replace: true })
                        if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </aside>
      </div>
    </div>
  )
}
