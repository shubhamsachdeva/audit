import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { CheckCircle, Play, ArrowsLeftRight } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { modulesById, paths, pathsById } from '../data'
import type { PathId } from '../data/types'
import { useProgress } from '../store/progress'
import { fmtHours, moduleStats, nextUp, pathStats, pct } from '../lib/progress'
import { EquivalentChips, ProgressBar, TypeIcon } from '../components/bits'

export default function PathPage() {
  const { pathId } = useParams()
  const navigate = useNavigate()
  const { resources: ledger, enrolled, enroll, setActivePath, activePath, leavePath } = useProgress()
  const path = pathsById[pathId as PathId]

  useEffect(() => {
    if (path && enrolled[path.id] && activePath !== path.id) setActivePath(path.id)
  }, [path, enrolled, activePath, setActivePath])

  if (!path) return <Navigate to="/" replace />

  const s = pathStats(path.id, ledger)
  const up = nextUp(path.id, ledger)
  const isIn = !!enrolled[path.id]
  let moduleNo = 0

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-ink-soft">
            {path.duration}, {path.hoursPerWeek}
          </p>
          <h1 className="mt-1 text-5xl font-semibold sm:text-6xl">{path.name}</h1>
          <p className="mt-3 max-w-[64ch] text-lg text-ink-soft">{path.promise}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isIn && (
            <button type="button" onClick={() => enroll(path.id)} className="bg-ink px-5 py-3 font-semibold text-paper hover:opacity-90">
              Start this path
            </button>
          )}
          <details className="relative">
            <summary className="list-none inline-flex items-center gap-2 border border-line-strong px-4 py-3 font-semibold hover:bg-surface [&::-webkit-details-marker]:hidden">
              <ArrowsLeftRight size={18} aria-hidden="true" /> Switch path
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-72 border border-line bg-surface p-2 ">
              {paths.filter((p) => p.id !== path.id).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    enroll(p.id)
                    navigate(`/path/${p.id}`)
                  }}
                  className="block w-full px-3 py-2 text-left hover:bg-sunken"
                >
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block text-sm text-ink-soft">{p.duration}</span>
                </button>
              ))}
              {isIn && (
                <button
                  type="button"
                  onClick={() => {
                    leavePath(path.id)
                    navigate('/')
                  }}
                  className="mt-1 block w-full px-3 py-2 text-left text-sm text-ink-soft hover:bg-sunken"
                >
                  Leave {path.name} (keeps your progress)
                </button>
              )}
            </div>
          </details>
        </div>
      </div>

      <section aria-label="Path progress" className="mt-10 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold">Progress by phase</h2>
            <span className="font-display text-3xl font-semibold tabular">{pct(s.fraction)}</span>
          </div>
          <div className="mt-5 flex gap-1.5">
            {path.phases.map((ph) => {
              const mods = ph.modules.map((id) => modulesById[id]).filter(Boolean)
              const tot = mods.reduce((a, m) => a + moduleStats(m, ledger).hoursTotal, 0)
              const done = mods.reduce((a, m) => a + moduleStats(m, ledger).hoursDone, 0)
              return (
                <div key={ph.id} className="min-w-0" style={{ flexGrow: ph.weeks, flexBasis: 0 }}>
                  <ProgressBar value={tot ? done / tot : 0} label={`${ph.title} progress`} size="lg" />
                  <p className="mt-2 truncate text-xs text-ink-soft" title={ph.title}>{ph.title}</p>
                </div>
              )
            })}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-ink-faint">Modules complete</dt>
              <dd className="text-2xl font-bold tabular">{s.modulesComplete}<span className="text-base text-ink-faint">/{s.modules}</span></dd>
            </div>
            <div>
              <dt className="text-sm text-ink-faint">Lectures and units</dt>
              <dd className="text-2xl font-bold tabular">{s.lecturesDone}<span className="text-base text-ink-faint">/{s.lecturesTotal}</span></dd>
            </div>
            <div>
              <dt className="text-sm text-ink-faint">Hours studied</dt>
              <dd className="text-2xl font-bold tabular">{Math.round(s.hoursDone)}<span className="text-base text-ink-faint">/{Math.round(s.hoursTotal)}</span></dd>
            </div>
            <div>
              <dt className="text-sm text-ink-faint">Started</dt>
              <dd className="text-lg font-bold">
                {enrolled[path.id] ? new Date(enrolled[path.id]!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not yet'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col bg-ink p-6 text-paper">
          <h2 className="text-xl font-bold">Up next</h2>
          {up ? (
            <>
              <p className="mt-1 text-sm opacity-75">{up.module.title}</p>
              <p className="mt-4 flex items-start gap-2 text-lg font-semibold leading-snug">
                <span className="mt-1"><TypeIcon type={up.resource.type} /></span>
                {up.resource.title}
              </p>
              <p className="mt-1 text-sm opacity-75">{up.resource.author ?? up.resource.provider}</p>
              <Link
                to={`/path/${path.id}/module/${up.module.id}?r=${up.resource.id}`}
                onClick={() => !isIn && enroll(path.id)}
                className="mt-auto inline-flex items-center justify-center gap-2 bg-marker px-5 py-3 font-bold text-marker-ink hover:opacity-90"
                style={{ marginTop: '1.5rem' }}
              >
                <Play weight="fill" size={16} aria-hidden="true" /> {ledger[up.resource.id] ? 'Resume' : 'Start'}
              </Link>
            </>
          ) : (
            <p className="mt-3">Every core resource is done. Revisit the "go deeper" picks in any module, or start a longer path.</p>
          )}
        </div>
      </section>

      <div className="mt-14 space-y-14">
        {path.phases.map((ph, pi) => (
          <section key={ph.id} aria-labelledby={`ph-${ph.id}`}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 id={`ph-${ph.id}`} className="text-3xl font-semibold">
                <span className="text-ink-faint tabular">Phase {pi + 1}.</span> {ph.title}
              </h2>
              <span className="text-ink-soft tabular">{ph.weeks} weeks</span>
            </div>
            <p className="mt-2 max-w-[70ch] text-ink-soft">{ph.summary}</p>
            <ol className="mt-6 grid gap-3">
              {ph.modules.map((mid) => {
                const m = modulesById[mid]
                if (!m) return null
                moduleNo++
                const ms = moduleStats(m, ledger)
                return (
                  <li key={mid}>
                    <Link
                      to={`/path/${path.id}/module/${m.id}`}
                      className="group grid gap-4 border border-line bg-surface p-5 transition-colors hover:border-ink sm:grid-cols-[3rem_1fr_14rem] sm:items-center"
                    >
                      <span
                        className={`grid size-12 place-items-center font-display text-lg font-semibold tabular ${
                          ms.complete ? 'bg-progress text-white' : ms.fraction > 0 ? 'bg-marker text-marker-ink' : 'bg-sunken text-ink-soft'
                        }`}
                        aria-hidden="true"
                      >
                        {ms.complete ? <CheckCircle size={26} weight="fill" /> : moduleNo}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xl font-bold leading-snug">{m.title}</span>
                        <span className="mt-1 block text-ink-soft">{m.summary}</span>
                        <span className="mt-3 block"><EquivalentChips items={m.equivalentTo} max={3} /></span>
                      </span>
                      <span className="block">
                        <span className="flex justify-between text-sm text-ink-soft tabular">
                          <span>{ms.finished}/{ms.count} done</span>
                          <span>{fmtHours(ms.hoursTotal)}</span>
                        </span>
                        <span className="mt-2 block"><ProgressBar value={ms.fraction} label={`${m.title} progress`} /></span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
