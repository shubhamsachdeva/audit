export type ResourceType =
  | 'youtube-playlist'
  | 'youtube-video'
  | 'course'
  | 'book'
  | 'article'
  | 'interactive'
  | 'project'

export type Level = 'beginner' | 'intermediate' | 'advanced'

export type Topic =
  | 'python'
  | 'cs'
  | 'math'
  | 'linear-algebra'
  | 'calculus'
  | 'probability'
  | 'optimization'
  | 'ai-foundations'
  | 'ml'
  | 'probabilistic-ml'
  | 'deep-learning'
  | 'computer-vision'
  | 'nlp'
  | 'llms'
  | 'generative'
  | 'rl'
  | 'mlops'
  | 'agents'
  | 'retrieval'
  | 'cloud'
  | 'codecs'
  | 'recommendations'
  | 'graphs'
  | 'robotics'
  | 'safety'
  | 'career'

export interface Resource {
  id: string
  title: string
  provider: string
  author?: string
  type: ResourceType
  url: string
  /** YouTube video id, for type youtube-video */
  videoId?: string
  /** YouTube playlist id, for type youtube-playlist */
  playlistId?: string
  /** Number of lectures/videos/chapters, used for per-lecture tracking */
  lectures?: number
  hours: number
  level: Level
  topic: Topic
  description: string
  /** Paid master's courses this resource covers */
  equivalentTo?: string[]
  /** Optional companion links: problem sets, notes, code */
  extras?: { label: string; url: string }[]
}

export type ResourceRole = 'core' | 'deeper' | 'practice'

export interface ModuleResource {
  id: string
  role: ResourceRole
  /** Why this resource is in this module, or which part of it to do */
  note?: string
}

export interface Module {
  id: string
  title: string
  summary: string
  topics: string[]
  equivalentTo: string[]
  outcomes: string[]
  resources: ModuleResource[]
  project?: { title: string; brief: string; url?: string }
}

export interface Phase {
  id: string
  title: string
  weeks: number
  summary: string
  modules: string[]
}

export type PathId = 'sprint' | 'intermediate' | 'masters'

export interface Path {
  id: PathId
  name: string
  duration: string
  weeks: number
  hoursPerWeek: string
  forWho: string
  promise: string
  phases: Phase[]
}

export interface ProgramCourse {
  code: string
  title: string
  topics: string
  /** Resource ids in the catalog that teach this course for free */
  free?: string[]
}

export interface Program {
  id: string
  university: string
  name: string
  country: string
  tuitionUSD: number
  tuitionNote: string
  duration: string
  url: string
  structure: string
  courses: ProgramCourse[]
}
