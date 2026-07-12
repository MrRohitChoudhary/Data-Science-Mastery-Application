declare module '*/data/roadmap' {
  export const LEARNING_ROADMAP: import('./types').Phase[]
  export const SKILLS_DATABASE: Record<string, { category: string; icon: string; skills: import('./types').Skill[] }>
}

declare module '*/data/resources' {
  export const CERTIFICATIONS: import('./types').Certification[]
  export const COURSES: Record<string, import('./types').Course[]>
  export const TOOLS_SOFTWARE: Record<string, { name: string; icon: string; tools: import('./types').Tool[] }>
  export const PROJECT_IDEAS: import('./types').Project[]
  export const INTERVIEW_QUESTIONS: Record<string, import('./types').InterviewQuestion[]>
  export const CAREER_TASKS: import('./types').CareerTask[]
  export const FUTURE_PROOF_SKILLS: import('./types').FutureProofSkill[]
}

declare module '*/data' {
  export const LEARNING_ROADMAP: import('./types').Phase[]
  export const SKILLS_DATABASE: Record<string, { category: string; icon: string; skills: import('./types').Skill[] }>
  export const CERTIFICATIONS: import('./types').Certification[]
  export const COURSES: Record<string, import('./types').Course[]>
  export const TOOLS_SOFTWARE: Record<string, { name: string; icon: string; tools: import('./types').Tool[] }>
  export const PROJECT_IDEAS: import('./types').Project[]
  export const INTERVIEW_QUESTIONS: Record<string, import('./types').InterviewQuestion[]>
  export const CAREER_TASKS: import('./types').CareerTask[]
  export const FUTURE_PROOF_SKILLS: import('./types').FutureProofSkill[]
}
