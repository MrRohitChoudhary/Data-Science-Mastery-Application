export interface Topic {
  id: string
  name: string
  subtopics: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  prerequisites: string[]
}

export interface Phase {
  id: string
  phase: number
  title: string
  subtitle: string
  duration: string
  icon: string
  color: string
  topics: Topic[]
}

export interface Skill {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  importance: 'critical' | 'important' | 'nice-to-have'
  futureProof: boolean
  relatedPhase: number
}

export interface Certification {
  id: string
  name: string
  provider: string
  level: 'beginner' | 'intermediate' | 'advanced'
  cost: 'free' | 'paid'
  price: string
  roi: 'high' | 'medium' | 'low'
  mustHave: boolean
  url: string
  duration: string
  description: string
}

export interface Course {
  id: string
  name: string
  author?: string
  creator?: string
  url: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  description: string
  isFree: boolean
}

export interface Tool {
  name: string
  description: string
  url: string
  isFree: boolean
  importance: 'essential' | 'recommended' | 'optional'
}

export interface Project {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  domain: string
  skills: string[]
  estimatedDays: number
  datasets: string[]
  deliverables: string[]
}

export interface InterviewQuestion {
  id: string
  question: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  hint: string
}

export interface CareerTask {
  id: string
  title: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  category: string
  isQuickWin: boolean
}

export interface FutureProofSkill {
  id: string
  name: string
  description: string
  timeHorizon: string
  demandLevel: string
  relatedRoles: string[]
}
