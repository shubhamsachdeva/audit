import { useState } from 'react'
import { Check, ArrowSquareOut, CaretLeft, CaretRight, NotePencil, ArrowCounterClockwise } from '@phosphor-icons/react'
import type { Resource } from '../data/types'
import { useProgress } from '../store/progress'
import { embedUrl, fmtHours, resourceFraction } from '../lib/progress'
import { EquivalentChips, LevelTag, ProgressBar, TypeIcon, typeMeta, unitLabel } from './bits'

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function DoneToggle({ r, size = 'md' }: { r: Resource; size?: 'md' | 'lg' }) {
  const p = useProgress((s) => s.resources[r.id])
  const setDone = useProgress((s) => s.setDone)
  const done = !!p?.done
  const dim = size === 'lg' ? 'size-7' : 'size-6'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={done ? `Mark "${r.title}" as not done` : `Mark "${r.title}" as done`}
      onClick={(e) => {
        e.stopPropagation()
        setDone(r.id, !done, r.lectures)
      }}
      className={`${dim} shrink-0 grid place-items-center border-2 transition-colors ${
        done ? 'border-progress bg-progress text-white' : 'border-line-strong bg-surface hover:border-progress'
      }`}
    >
      {done && <Check size={size === 'lg' ? 16 : 14} weight="bold" style={{ animation: 'pop 220ms ease-out' }} aria-hidden="true" />}
    </button>
  )
}

export function ResourceRow({
  r,
  note,
  active,
  onSelect,
}: {
  r: Resource
  note?: string
  active?: boolean
  onSelect?: () => void
}) {
  const p = useProgress((s) => s.resources[r.id])
  const f = resourceFraction(r, p)
  return (
    <div
      className={`group relative flex gap-3 border p-3 transition-colors ${
        active ? 'border-ink bg-surface shadow-[0_0_0_1px_var(--ink)]' : 'border-line bg-surface hover:border-line-strong'
      }`}
    >
      <DoneToggle r={r} />
      <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left" aria-current={active ? 'true' : undefined}>
        <span className="flex items-start gap-2">
          <span className="mt-0.5"><TypeIcon type={r.type} size={16} /></span>
          <span className={`font-semibold leading-snug ${p?.done ? 'text-ink-soft' : ''}`}>
            <span className={p?.done ? 'marker' : ''}>{r.title}</span>
          </span>
        </span>
        <span className="mt-1 block text-sm text-ink-soft">
          {r.author ? `${r.author}, ${r.provider}` : r.provider}
        </span>
        {note && <span className="mt-1 block text-sm text-ink-faint">{note}</span>}
        <span className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
          <span>{typeMeta[r.type].label}</span>
          <span className="tabular">{fmtHours(r.hours)}</span>
          {r.lectures ? (
            <span className="tabular">
              {p?.done ? r.lectures : (p?.lecturesDone ?? 0)}/{r.lectures} {unitLabel(r)}
            </span>
          ) : null}
        </span>
        {f > 0 && f < 1 && (
          <span className="mt-2 block">
            <ProgressBar value={f} size="sm" label={`${r.title} progress`} />
          </span>
        )}
      </button>
    </div>
  )
}

export function StudyPanel({ r }: { r: Resource }) {
  const p = useProgress((s) => s.resources[r.id])
  const note = useProgress((s) => s.notes[r.id] ?? '')
  const { setLectures, setDone, setNote } = useProgress()
  const total = r.lectures ?? 0
  const watched = p?.done ? total : (p?.lecturesDone ?? 0)
  const [cursor, setCursor] = useState(() => Math.min(Math.max(1, watched + 1), Math.max(1, total)))
  const isPlaylist = r.type === 'youtube-playlist'
  const src = embedUrl(r, isPlaylist ? cursor : undefined)
  const f = resourceFraction(r, p)

  const finishCurrent = () => {
    const n = Math.max(watched, cursor)
    setLectures(r.id, n, total)
    if (cursor < total) setCursor(cursor + 1)
  }

  return (
    <article className="overflow-hidden border border-line bg-surface">
      {src ? (
        <div className="relative aspect-video w-full bg-black">
          <iframe
            key={src}
            src={src}
            title={isPlaylist ? `${r.title}, lecture ${cursor}` : r.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative overflow-hidden border-b border-line bg-sunken px-6 py-10 sm:px-10">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <TypeIcon type={r.type} />
            {typeMeta[r.type].label} on {host(r.url)}
          </div>
          <p className="mt-3 max-w-[60ch] text-ink-soft">
            This one lives outside Audit. Open it in a new tab, sign in there if it asks, and come back here to log what you finished.
          </p>
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-ink px-5 py-3 font-semibold text-paper hover:opacity-90 transition-opacity"
          >
            Open {host(r.url)}
            <ArrowSquareOut size={18} aria-hidden="true" />
          </a>
        </div>
      )}

      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold sm:text-[1.75rem]">{r.title}</h2>
            <p className="mt-1 text-ink-soft">
              {r.author ? `${r.author}, ${r.provider}` : r.provider}
            </p>
          </div>
          <label className="flex items-center gap-3 border border-line px-3 py-2 select-none">
            <DoneToggle r={r} size="lg" />
            <span className="font-semibold">{p?.done ? 'Completed' : 'Mark complete'}</span>
          </label>
        </div>

        {total > 1 && (
          <div className="mt-6 bg-sunken p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCursor(Math.max(1, cursor - 1))}
                  disabled={cursor <= 1}
                  className="grid size-9 place-items-center border border-line bg-surface disabled:opacity-40"
                  aria-label={`Previous ${unitLabel(r, 1)}`}
                >
                  <CaretLeft size={16} aria-hidden="true" />
                </button>
                <span className="min-w-[9.5rem] text-center font-semibold tabular" aria-live="polite">
                  {unitLabel(r, 1)[0].toUpperCase() + unitLabel(r, 1).slice(1)} {cursor} of {total}
                </span>
                <button
                  type="button"
                  onClick={() => setCursor(Math.min(total, cursor + 1))}
                  disabled={cursor >= total}
                  className="grid size-9 place-items-center border border-line bg-surface disabled:opacity-40"
                  aria-label={`Next ${unitLabel(r, 1)}`}
                >
                  <CaretRight size={16} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={finishCurrent}
                disabled={watched >= total}
                className="inline-flex items-center gap-2 bg-progress px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <Check size={16} weight="bold" aria-hidden="true" />
                {cursor <= watched ? `Already logged, go to ${unitLabel(r, 1)} ${Math.min(total, watched + 1)}` : `Finished ${unitLabel(r, 1)} ${cursor}`}
              </button>
              {watched > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setLectures(r.id, 0, total)
                    if (p?.done) setDone(r.id, false, total)
                    setCursor(1)
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
                >
                  <ArrowCounterClockwise size={14} aria-hidden="true" /> Start over
                </button>
              )}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={f} label={`${r.title} progress`} />
              <span className="shrink-0 text-sm text-ink-soft tabular">
                {watched}/{total} {unitLabel(r)}
              </span>
            </div>
            {isPlaylist && (
              <p className="mt-3 text-sm text-ink-faint">
                The player opens at the {unitLabel(r, 1)} you're on. YouTube can't tell Audit what you watched, so log each one when you finish it.
              </p>
            )}
          </div>
        )}

        <p className="mt-6 max-w-[70ch] leading-relaxed">{r.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-sm text-ink-faint">Time</dt>
            <dd className="font-semibold tabular">{fmtHours(r.hours)}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-faint">Level</dt>
            <dd><LevelTag level={r.level} /></dd>
          </div>
          <div>
            <dt className="text-sm text-ink-faint">Format</dt>
            <dd className="font-semibold">{typeMeta[r.type].label}</dd>
          </div>
          {total > 0 && (
            <div>
              <dt className="text-sm text-ink-faint">Length</dt>
              <dd className="font-semibold tabular">{total} {unitLabel(r, total)}</dd>
            </div>
          )}
        </dl>

        {r.equivalentTo?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-ink-soft font-sans tracking-normal">Covers the same ground as</h3>
            <div className="mt-2"><EquivalentChips items={r.equivalentTo} max={8} /></div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-sm font-semibold hover:bg-sunken"
          >
            {src ? 'Open on YouTube' : `Open ${host(r.url)}`} <ArrowSquareOut size={14} aria-hidden="true" />
          </a>
          {r.extras?.map((x) => (
            <a
              key={x.url}
              href={x.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-sm hover:bg-sunken"
            >
              {x.label} <ArrowSquareOut size={14} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="mt-8">
          <label htmlFor={`note-${r.id}`} className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <NotePencil size={16} aria-hidden="true" /> Your notes
          </label>
          <textarea
            id={`note-${r.id}`}
            value={note}
            onChange={(e) => setNote(r.id, e.target.value)}
            rows={4}
            placeholder="Key ideas, timestamps to revisit, questions to look up…"
            className="mt-2 w-full resize-y border border-line bg-paper p-3 text-[0.95rem] placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
        </div>
      </div>
    </article>
  )
}
