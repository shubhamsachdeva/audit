import {
  YoutubeLogo,
  PlayCircle,
  GraduationCap,
  BookOpen,
  Article,
  Code,
  Hammer,
} from '@phosphor-icons/react'
import type { Level, Resource, ResourceType } from '../data/types'

export function ProgressBar({
  value,
  label,
  size = 'md',
  tone = 'progress',
}: {
  value: number
  label: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'progress' | 'marker'
}) {
  const h = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className={`${h} w-full overflow-hidden bg-sunken`}
    >
      <div
        className={`h-full transition-[width] duration-500 ease-out ${tone === 'marker' ? 'bg-marker' : 'bg-progress'}`}
        style={{ width: `${Math.max(value > 0 ? 2 : 0, value * 100)}%` }}
      />
    </div>
  )
}

export const typeMeta: Record<ResourceType, { label: string; Icon: typeof YoutubeLogo }> = {
  'youtube-playlist': { label: 'Lecture series', Icon: YoutubeLogo },
  'youtube-video': { label: 'Video', Icon: PlayCircle },
  course: { label: 'Online course', Icon: GraduationCap },
  book: { label: 'Free book', Icon: BookOpen },
  article: { label: 'Reading', Icon: Article },
  interactive: { label: 'Interactive', Icon: Code },
  project: { label: 'Project', Icon: Hammer },
}

export function TypeIcon({ type, size = 18 }: { type: ResourceType; size?: number }) {
  const { Icon } = typeMeta[type]
  const yt = type === 'youtube-playlist' || type === 'youtube-video'
  return <Icon size={size} weight={yt ? 'fill' : 'regular'} className={yt ? 'text-[#e62117]' : 'text-ink-soft'} aria-hidden="true" />
}

const levelStyle: Record<Level, string> = {
  beginner: 'text-progress',
  intermediate: 'text-link',
  advanced: 'text-streak',
}

export function LevelTag({ level }: { level: Level }) {
  return <span className={`text-xs font-semibold capitalize ${levelStyle[level]}`}>{level}</span>
}

export function unitLabel(r: Resource, n = 2) {
  const plural = n !== 1
  if (r.type === 'book') return plural ? 'chapters' : 'chapter'
  if (r.type === 'course' || r.type === 'interactive') return plural ? 'units' : 'unit'
  if (r.type === 'project') return plural ? 'parts' : 'part'
  return plural ? 'lectures' : 'lecture'
}

export function EquivalentChips({ items, max = 4 }: { items?: string[]; max?: number }) {
  if (!items?.length) return null
  const shown = items.slice(0, max)
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Replaces these paid courses">
      {shown.map((e) => (
        <li key={e} className="border border-line bg-surface px-2 py-0.5 text-xs text-ink-soft">
          {e}
        </li>
      ))}
      {items.length > max && <li className="px-1 py-0.5 text-xs text-ink-faint">+{items.length - max} more</li>}
    </ul>
  )
}
