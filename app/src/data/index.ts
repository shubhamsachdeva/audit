import type { Module, Path, PathId, Program, Resource, Topic } from './types'
import { modules } from './modules'
import { paths } from './paths'
import { programs } from './programs'
import { projects } from './projects'
import { resources as lectures } from './resources'

export { modules, paths, programs }
export const resources: Resource[] = [...lectures, ...projects]
export type * from './types'

export const topicLabels: Record<Topic, string> = {
  python: 'Python',
  cs: 'Algorithms & CS',
  math: 'Math for ML',
  'linear-algebra': 'Linear algebra',
  calculus: 'Calculus',
  probability: 'Probability & statistics',
  optimization: 'Optimization',
  'ai-foundations': 'AI foundations',
  ml: 'Machine learning',
  'probabilistic-ml': 'Probabilistic ML',
  'deep-learning': 'Deep learning',
  'computer-vision': 'Computer vision',
  nlp: 'NLP',
  llms: 'Large language models',
  generative: 'Generative models',
  rl: 'Reinforcement learning',
  mlops: 'ML systems & MLOps',
  agents: 'LLM apps & agents',
  retrieval: 'Retrieval & RAG',
  cloud: 'Cloud',
  codecs: 'Codecs & media',
  recommendations: 'Recommendations',
  graphs: 'Graphs',
  robotics: 'Robotics',
  safety: 'Safety & ethics',
  career: 'Career',
}

function indexById<T extends { id: string }>(items: T[]) {
  return Object.fromEntries(items.map((x) => [x.id, x])) as Record<string, T>
}

export const resourcesById = indexById(resources) as Record<string, Resource>
export const modulesById = indexById(modules) as Record<string, Module>
export const pathsById = indexById(paths) as Record<PathId, Path>
export const programsById = indexById(programs) as Record<string, Program>

/** Fail fast if a path/module points at a missing resource or module */
function assertCatalog() {
  const problems: string[] = []
  for (const m of modules) {
    for (const r of m.resources) {
      if (!resourcesById[r.id]) problems.push(`Module ${m.id} → missing resource ${r.id}`)
    }
  }
  for (const p of paths) {
    for (const ph of p.phases) {
      for (const mid of ph.modules) {
        if (!modulesById[mid]) problems.push(`Path ${p.id} / ${ph.id} → missing module ${mid}`)
      }
    }
  }
  for (const prog of programs) {
    for (const c of prog.courses) {
      for (const id of c.free ?? []) {
        if (!resourcesById[id]) problems.push(`Program ${prog.id} / ${c.code} → missing resource ${id}`)
      }
    }
  }
  if (problems.length) {
    console.warn('[catalog]\n' + problems.join('\n'))
  }
}

assertCatalog()
