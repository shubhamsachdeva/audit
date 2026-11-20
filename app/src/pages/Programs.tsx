import { Link } from 'react-router'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { programs, resourcesById } from '../data'
import { TypeIcon } from '../components/bits'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

export default function Programs() {
  const sorted = [...programs].sort((a, b) => b.tuitionUSD - a.tuitionUSD)
  const total = programs.reduce((a, p) => a + p.tuitionUSD, 0)
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="text-5xl font-semibold">Programs we mapped</h1>
      <p className="mt-3 max-w-[66ch] text-lg text-ink-soft">
        The syllabus behind Audit comes from these {programs.length} master's programs. Together they charge{' '}
        <span className="font-semibold text-ink tabular">{usd(total)}</span> in tuition. For each course, we list the free material that teaches the same thing.
      </p>
      <p className="mt-2 max-w-[66ch] text-sm text-ink-faint">
        Tuition figures are approximate totals for the full program from each school's published rates, converted to US dollars where needed. Check the official page before relying on them.
      </p>

      <nav aria-label="Jump to program" className="mt-8 flex flex-wrap gap-2">
        {sorted.map((p) => (
          <a key={p.id} href={`#${p.id}`} className="border border-line bg-surface px-3 py-1.5 text-sm hover:border-ink">
            {p.university}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {sorted.map((p) => (
          <section key={p.id} id={p.id} className="scroll-mt-24" aria-labelledby={`h-${p.id}`}>
            <div className="grid gap-4 border-b border-line pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-ink-soft">{p.university}, {p.country}</p>
                <h2 id={`h-${p.id}`} className="mt-1 text-3xl font-semibold">{p.name}</h2>
                <p className="mt-2 max-w-[72ch] text-ink-soft">{p.structure}</p>
              </div>
              <div className="lg:text-right">
                <p className="font-display text-3xl font-semibold tabular">{usd(p.tuitionUSD)}</p>
                <p className="text-sm text-ink-soft">{p.tuitionNote}, {p.duration}</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                  Official page <ArrowSquareOut size={13} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[44rem] text-left text-[0.95rem]">
                <thead>
                  <tr className="text-sm text-ink-faint">
                    <th scope="col" className="py-3 pr-4 font-semibold w-[34%]">Course</th>
                    <th scope="col" className="py-3 pr-4 font-semibold w-[36%]">What it teaches</th>
                    <th scope="col" className="py-3 font-semibold">Free on Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {p.courses.map((c) => (
                    <tr key={c.code + c.title} className="align-top">
                      <td className="py-3 pr-4">
                        <span className="block font-semibold">{c.title}</span>
                        <span className="block text-sm text-ink-faint">{c.code}</span>
                      </td>
                      <td className="py-3 pr-4 text-ink-soft">{c.topics}</td>
                      <td className="py-3">
                        {c.free?.length ? (
                          <ul className="space-y-1.5">
                            {c.free.map((id) => resourcesById[id]).filter(Boolean).map((r) => (
                              <li key={r.id}>
                                <Link to={`/catalog?r=${r.id}`} className="flex items-start gap-2 hover:underline">
                                  <span className="mt-0.5"><TypeIcon type={r.type} size={15} /></span>
                                  <span>{r.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-ink-faint">Covered across several modules</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
