import { Link } from 'react-router'
import { Play } from '@phosphor-icons/react'
import { programs, resources, modules, pathsById } from '../data'
import PathChooser from '../components/PathChooser'
import { useProgress } from '../store/progress'
import { nextUp, pathStats, pct } from '../lib/progress'
import { ProgressBar, TypeIcon } from '../components/bits'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

function TuitionTable() {
  const lines = [...programs].sort((a, b) => b.tuitionUSD - a.tuitionUSD).slice(0, 8)
  return (
    <figure className="border border-line bg-surface">
      <figcaption className="border-b border-line px-5 py-4">
        <span className="block font-display text-xl font-semibold">What the degree costs</span>
        <span className="mt-1 block text-sm text-ink-soft">Published tuition for the full program. Housing is extra.</span>
      </figcaption>
      <table className="w-full text-left text-[0.95rem]">
        <tbody>
          {lines.map((p) => (
            <tr key={p.id} className="border-b border-line">
              <th scope="row" className="px-5 py-2.5 font-normal">
                <span className="block">{p.university}</span>
                <span className="block text-sm text-ink-faint">{p.name}</span>
              </th>
              <td className="px-5 py-2.5 text-right font-medium tabular text-ink-soft line-through decoration-progress">{usd(p.tuitionUSD)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="px-5 py-4 text-left font-display text-xl font-semibold">On Audit</th>
            <td className="px-5 py-4 text-right font-display text-3xl font-semibold tabular text-progress">$0</td>
          </tr>
        </tfoot>
      </table>
      <p className="border-t border-line px-5 py-3 text-sm text-ink-soft">
        Same subjects, often the same professors, from {resources.length} free lectures, books and courses.
      </p>
    </figure>
  )
}

function ContinueCard() {
  const { activePath, resources: ledger } = useProgress()
  if (!activePath) return null
  const path = pathsById[activePath]
  const s = pathStats(activePath, ledger)
  const up = nextUp(activePath, ledger)
  return (
    <section aria-label="Continue studying" className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
      <div className="flex flex-col gap-5 border border-line bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink-soft">
            {path.name}, {pct(s.fraction)} done
          </p>
          {up ? (
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
              <TypeIcon type={up.resource.type} />
              <span className="truncate">{up.resource.title}</span>
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold">You finished every core resource in this path.</p>
          )}
          <div className="mt-3 max-w-sm"><ProgressBar value={s.fraction} label={`${path.name} progress`} size="sm" /></div>
        </div>
        <Link
          to={up ? `/path/${activePath}/module/${up.module.id}?r=${up.resource.id}` : `/path/${activePath}`}
          className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 font-semibold text-paper hover:opacity-90"
        >
          <Play weight="fill" size={16} aria-hidden="true" /> {up ? 'Resume' : 'Review path'}
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  const universities = [...new Set(programs.map((p) => p.university))]
  return (
    <>
      <ContinueCard />
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        <div>
          <h1 className="text-[clamp(2.6rem,6.2vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Audit an AI master's degree. Pay nothing.
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg text-ink-soft sm:text-xl">
            We read the curricula of {programs.length} AI and machine learning master's programs, then kept going into what those programs have not caught up to: retrieval, cloud, codecs, agents and the questions interviews actually ask.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#paths" className="bg-ink px-6 py-3.5 text-[1.05rem] font-semibold text-paper hover:opacity-90">
              Choose a path
            </a>
            <Link to="/programs" className="border border-line-strong px-6 py-3.5 text-[1.05rem] font-semibold hover:bg-surface">
              See how we built the syllabus
            </Link>
          </div>
          <p className="mt-10 max-w-[60ch] text-sm text-ink-faint">
            Curricula studied from {universities.slice(0, 9).join(', ')} and {Math.max(0, universities.length - 9)} more.
          </p>
        </div>
        <TuitionTable />
      </section>

      <section id="paths" className="scroll-mt-20 border-t border-line bg-surface/50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="text-4xl font-semibold sm:text-5xl">Choose your pace</h2>
          <p className="mt-3 max-w-[62ch] text-lg text-ink-soft">
            Each bar is drawn to scale. The shorter paths are subsets of the full degree, so anything you finish counts everywhere if you switch later.
          </p>
          <div className="mt-10"><PathChooser /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold">Watch here</h2>
            <p className="mt-2 text-ink-soft">
              YouTube lecture series play inside Audit and reopen at the lecture you're on. Log each one with a single click.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Leave and come back</h2>
            <p className="mt-2 text-ink-soft">
              Coursera audits, free textbooks and assignments open in a new tab. Count chapters or units as you go, then mark it done.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Know what it replaces</h2>
            <p className="mt-2 text-ink-soft">
              Every module lists the paid courses it stands in for, like Stanford CS229 or CMU 11-785, so you can describe what you've covered.
            </p>
          </div>
        </div>
        <p className="mt-12 text-sm text-ink-faint tabular">
          {modules.length} modules, {resources.length} resources.
        </p>
      </section>
    </>
  )
}
