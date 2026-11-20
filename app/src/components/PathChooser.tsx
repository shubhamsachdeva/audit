import { useNavigate } from 'react-router'
import { paths } from '../data'
import type { PathId } from '../data/types'
import { useProgress } from '../store/progress'
import { pathStats, pct } from '../lib/progress'
import { ProgressBar } from './bits'

const MAX_WEEKS = Math.max(...paths.map((p) => p.weeks))
const phaseShades = ['bg-ink', 'bg-ink/80', 'bg-ink/65', 'bg-ink/50', 'bg-ink/38', 'bg-ink/28', 'bg-ink/20', 'bg-ink/14']

export default function PathChooser() {
  const navigate = useNavigate()
  const { enrolled, resources, enroll } = useProgress()

  const start = (id: PathId) => {
    enroll(id)
    navigate(`/path/${id}`)
  }

  return (
    <ol className="divide-y divide-line border-y border-line">
      {paths.map((p) => {
        const isIn = !!enrolled[p.id]
        const stats = pathStats(p.id, resources)
        return (
          <li key={p.id} className="grid gap-6 py-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
            <div>
              <h3 className="text-3xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-lg font-semibold text-ink-soft">
                {p.duration} at {p.hoursPerWeek}
              </p>
              <p className="mt-3 text-ink-soft">{p.forWho}</p>
            </div>
            <div className="min-w-0">
              <p className="max-w-[62ch] text-[1.05rem]">{p.promise}</p>

              <div className="mt-5" aria-hidden="true">
                <div className="flex h-9 gap-[3px] overflow-hidden " style={{ width: `${Math.max(14, (p.weeks / MAX_WEEKS) * 100)}%` }}>
                  {p.phases.map((ph, i) => (
                    <div
                      key={ph.id}
                      className={phaseShades[i % phaseShades.length]}
                      style={{ flexGrow: ph.weeks }}
                      title={`${ph.title}: ${ph.weeks} weeks`}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex text-xs text-ink-faint" style={{ width: `${Math.max(14, (p.weeks / MAX_WEEKS) * 100)}%` }}>
                  <span>Week 1</span>
                  <span className="ml-auto tabular">Week {p.weeks}</span>
                </div>
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
                {p.phases.map((ph, i) => (
                  <li key={ph.id} className="flex items-center gap-1.5">
                    <span className={`inline-block size-2.5 ${phaseShades[i % phaseShades.length]}`} aria-hidden="true" />
                    {ph.title}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => start(p.id)}
                  className="bg-ink px-5 py-3 font-semibold text-paper transition-opacity hover:opacity-90"
                >
                  {isIn ? 'Continue this path' : `Start ${p.name}`}
                </button>
                <span className="text-sm text-ink-soft tabular">
                  {stats.modules} modules, {stats.resources} resources, about {Math.round(stats.hoursTotal)} hours of core material
                </span>
              </div>
              {isIn && stats.fraction > 0 && (
                <div className="mt-4 flex max-w-md items-center gap-3">
                  <ProgressBar value={stats.fraction} label={`${p.name} progress`} />
                  <span className="text-sm font-semibold tabular">{pct(stats.fraction)}</span>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
