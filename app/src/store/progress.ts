import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PathId } from '../data/types'

export interface ResourceProgress {
  done: boolean
  /** Lectures/videos/chapters finished, for multi-part resources */
  lecturesDone: number
  startedAt: string
  updatedAt: string
  completedAt?: string
}

type Theme = 'light' | 'dark'

interface ProgressState {
  activePath: PathId | null
  enrolled: Partial<Record<PathId, string>>
  resources: Record<string, ResourceProgress>
  notes: Record<string, string>
  /** yyyy-mm-dd -> number of study actions that day */
  activity: Record<string, number>
  lastOpened: { pathId: PathId; moduleId: string; resourceId: string } | null
  theme: Theme | null

  enroll: (path: PathId) => void
  setActivePath: (path: PathId) => void
  leavePath: (path: PathId) => void
  setLectures: (resourceId: string, count: number, total?: number) => void
  setDone: (resourceId: string, done: boolean, total?: number) => void
  setNote: (resourceId: string, text: string) => void
  setLastOpened: (v: ProgressState['lastOpened']) => void
  setTheme: (t: Theme) => void
  importData: (json: string) => void
  reset: () => void
}

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const bump = (activity: Record<string, number>) => {
  const k = today()
  return { ...activity, [k]: (activity[k] ?? 0) + 1 }
}

const initial = {
  activePath: null,
  enrolled: {},
  resources: {},
  notes: {},
  activity: {},
  lastOpened: null,
  theme: null,
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,

      enroll: (path) =>
        set((s) => ({
          activePath: path,
          enrolled: { ...s.enrolled, [path]: s.enrolled[path] ?? new Date().toISOString() },
        })),

      setActivePath: (path) => set({ activePath: path }),

      leavePath: (path) =>
        set((s) => {
          const enrolled = { ...s.enrolled }
          delete enrolled[path]
          const remaining = Object.keys(enrolled) as PathId[]
          return {
            enrolled,
            activePath: s.activePath === path ? (remaining[0] ?? null) : s.activePath,
          }
        }),

      setLectures: (id, count, total) =>
        set((s) => {
          const now = new Date().toISOString()
          const prev = s.resources[id]
          const n = Math.max(0, total ? Math.min(count, total) : count)
          const done = total ? n >= total : (prev?.done ?? false)
          return {
            resources: {
              ...s.resources,
              [id]: {
                done,
                lecturesDone: n,
                startedAt: prev?.startedAt ?? now,
                updatedAt: now,
                completedAt: done ? (prev?.completedAt ?? now) : undefined,
              },
            },
            activity: n > (prev?.lecturesDone ?? 0) ? bump(s.activity) : s.activity,
          }
        }),

      setDone: (id, done, total) =>
        set((s) => {
          const now = new Date().toISOString()
          const prev = s.resources[id]
          const had = prev?.lecturesDone ?? 0
          // Unmarking a fully-watched series resets the counter so it doesn't immediately read as done again
          const lecturesDone = done ? (total ?? had) : total && had >= total ? 0 : had
          return {
            resources: {
              ...s.resources,
              [id]: {
                done,
                lecturesDone,
                startedAt: prev?.startedAt ?? now,
                updatedAt: now,
                completedAt: done ? now : undefined,
              },
            },
            activity: done ? bump(s.activity) : s.activity,
          }
        }),

      setNote: (id, text) => set((s) => ({ notes: { ...s.notes, [id]: text } })),
      setLastOpened: (v) => set({ lastOpened: v }),
      setTheme: (t) => {
        document.documentElement.classList.toggle('dark', t === 'dark')
        set({ theme: t })
      },
      importData: (json) => {
        const parsed = JSON.parse(json)
        const state = parsed?.state ?? parsed
        if (typeof state !== 'object' || !state || !('resources' in state)) {
          throw new Error('This file is not an Audit progress export.')
        }
        set({ ...initial, ...state })
      },
      reset: () => set({ ...initial }),
    }),
    { name: 'audit-progress', version: 1 },
  ),
)

export const todayKey = today
