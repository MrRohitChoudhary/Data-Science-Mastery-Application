import { useState, useMemo, useEffect, useCallback } from 'react'
import { CAREER_TASKS } from '../data'

interface QuickTask {
  id: string
  title: string
  description: string
  category: string
  duration: string
  icon: string
  frequency: string
  isQuickWin: boolean
}

const QUICK_TASK_TEMPLATES: QuickTask[] = [
  { id: 'qw-01', title: 'Solve 3 LeetCode Easy problems', description: 'Focus on arrays, strings, or hash maps to build algorithmic thinking.', category: 'study', duration: '20 min', icon: '💻', frequency: 'daily', isQuickWin: true },
  { id: 'qw-02', title: 'Read one AI newsletter edition', description: 'Read The Batch, Import AI, or TLDR AI to stay current.', category: 'study', duration: '10 min', icon: '📰', frequency: 'daily', isQuickWin: true },
  { id: 'qw-03', title: 'Write a 100-word learning reflection', description: 'Summarize what you learned today in your journal.', category: 'productivity', duration: '10 min', icon: '✏️', frequency: 'daily', isQuickWin: true },
  { id: 'qw-04', title: 'Push code to GitHub', description: 'Commit your latest work. Keep that contribution graph green!', category: 'github', duration: '10 min', icon: '🐙', frequency: 'daily', isQuickWin: true },
  { id: 'qw-05', title: 'Review 5 flashcards on ML concepts', description: 'Use Anki or a flashcard app to reinforce key concepts.', category: 'study', duration: '10 min', icon: '🗂️', frequency: 'daily', isQuickWin: true },
  { id: 'qw-06', title: 'Comment on 3 LinkedIn DS posts', description: 'Add thoughtful comments to build your network presence.', category: 'networking', duration: '15 min', icon: '💬', frequency: 'daily', isQuickWin: true },
  { id: 'qw-07', title: 'Solve 2 SQL challenges', description: 'Practice on StrataScratch, LeetCode, or DataLemur.', category: 'study', duration: '20 min', icon: '🗃️', frequency: 'daily', isQuickWin: true },
  { id: 'qw-08', title: 'Watch a StatQuest video', description: 'Pick one concept you want to understand better.', category: 'study', duration: '15 min', icon: '🎥', frequency: 'daily', isQuickWin: true },
  { id: 'qw-09', title: 'Update your resume bullet points', description: 'Refine one section of your resume with better metrics.', category: 'resume', duration: '20 min', icon: '📄', frequency: 'weekly', isQuickWin: true },
  { id: 'qw-10', title: 'Star 3 trending ML repos on GitHub', description: 'Explore GitHub Trending and bookmark useful repositories.', category: 'github', duration: '10 min', icon: '⭐', frequency: 'weekly', isQuickWin: true },
  { id: 'qw-11', title: 'Practice one behavioral interview answer', description: 'Rehearse a STAR-format answer for 5 minutes.', category: 'interview', duration: '10 min', icon: '🎯', frequency: 'daily', isQuickWin: true },
  { id: 'qw-12', title: 'Read an arXiv abstract and summarize it', description: 'Pick a trending paper and write a one-paragraph summary.', category: 'research', duration: '15 min', icon: '📑', frequency: 'daily', isQuickWin: true },
  { id: 'qw-13', title: 'Complete one Kaggle micro-course lesson', description: 'Finish a lesson from Kaggle Learn (Python, SQL, ML, etc.).', category: 'study', duration: '25 min', icon: '📊', frequency: 'daily', isQuickWin: true },
  { id: 'qw-14', title: 'Share a DS tip on LinkedIn', description: 'Post a brief tip, trick, or learning from your recent study.', category: 'networking', duration: '10 min', icon: '📢', frequency: 'weekly', isQuickWin: true },
  { id: 'qw-15', title: 'Improve a README file', description: 'Update one GitHub project README with better docs.', category: 'github', duration: '20 min', icon: '📝', frequency: 'weekly', isQuickWin: true },
  { id: 'qw-16', title: 'Review a Python cheat sheet', description: 'Refresh your memory on pandas, numpy, or sklearn APIs.', category: 'study', duration: '10 min', icon: '📋', frequency: 'daily', isQuickWin: true },
  { id: 'qw-17', title: 'Apply to one internship/job', description: 'Submit a tailored application on LinkedIn, Glassdoor, or company sites.', category: 'career', duration: '20 min', icon: '🎓', frequency: 'daily', isQuickWin: true },
  { id: 'qw-18', title: 'Follow 3 ML researchers on Twitter/X', description: 'Curate your feed with researchers in your area of interest.', category: 'networking', duration: '5 min', icon: '👥', frequency: 'weekly', isQuickWin: true },
  { id: 'qw-19', title: 'Do a 15-minute code review', description: 'Review your own recent code or a peer\'s code for improvements.', category: 'study', duration: '15 min', icon: '🔍', frequency: 'daily', isQuickWin: true },
  { id: 'qw-20', title: 'Practice typing speed for 10 minutes', description: 'Use keybr.com or typeracer to improve coding speed.', category: 'productivity', duration: '10 min', icon: '⌨️', frequency: 'daily', isQuickWin: true },
]

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'study', label: 'Study' },
  { key: 'github', label: 'GitHub' },
  { key: 'networking', label: 'Networking' },
  { key: 'interview', label: 'Interview' },
  { key: 'research', label: 'Research' },
  { key: 'resume', label: 'Resume' },
  { key: 'career', label: 'Career' },
  { key: 'productivity', label: 'Productivity' },
]

const STORAGE_KEY = 'dsm-notifications-completed'

function getStoredCompleted(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch {
    // ignore
  }
  return new Set()
}

export default function Notifications() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(getStoredCompleted)
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)

  // Save completed state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedTasks)))
  }, [completedTasks])

  // Timer logic
  useEffect(() => {
    if (!activeTimer) return
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [activeTimer])

  // Combine quick task templates with career tasks that are quick wins
  const allQuickTasks = useMemo(() => {
    const careerQuickWins: QuickTask[] = (CAREER_TASKS as any[])
      .filter(t => t.isQuickWin)
      .map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category.replace(/_/g, ' '),
        duration: '20 min',
        icon: '⚡',
        frequency: t.frequency,
        isQuickWin: true,
      }))

    const combined = [...QUICK_TASK_TEMPLATES, ...careerQuickWins]
    // Deduplicate by id
    const seen = new Set<string>()
    return combined.filter(t => {
      if (seen.has(t.id)) return false
      seen.add(t.id)
      return true
    })
  }, [])

  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') return allQuickTasks
    return allQuickTasks.filter(t => t.category === selectedCategory || t.category.replace(/ /g, '_') === selectedCategory)
  }, [selectedCategory, allQuickTasks])

  const stats = useMemo(() => ({
    total: allQuickTasks.length,
    completed: allQuickTasks.filter(t => completedTasks.has(t.id)).length,
    remaining: allQuickTasks.filter(t => !completedTasks.has(t.id)).length,
  }), [allQuickTasks, completedTasks])

  const toggleTask = useCallback((id: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const startTimer = useCallback((taskId: string) => {
    if (activeTimer === taskId) {
      setActiveTimer(null)
      setTimerSeconds(0)
    } else {
      setActiveTimer(taskId)
      setTimerSeconds(0)
    }
  }, [activeTimer])

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const clearCompleted = () => {
    setCompletedTasks(new Set())
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚡ Quick Wins Hub</h1>
        <p className="page-subtitle">
          Tasks you can complete in under 30 minutes. Build momentum with small, consistent actions every day.
        </p>
      </div>

      <div className="stats-grid stagger">
        <div className="stat-card animate-fade-in-up">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-value" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.completed}
          </div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-value" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.remaining}
          </div>
          <div className="stat-label">Remaining</div>
        </div>
        {activeTimer && (
          <div className="stat-card animate-fade-in-up">
            <div className="stat-value animate-pulse" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {formatTime(timerSeconds)}
            </div>
            <div className="stat-label">Timer Active</div>
          </div>
        )}
      </div>

      <div className="toolbar">
        <div className="filter-group">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-pill ${selectedCategory === f.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {stats.completed > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clearCompleted}>
            Clear ({stats.completed})
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '24px' }}>
        <div className="progress-label">
          <span>Progress</span>
          <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks match your filter.</p>
          <p>Try selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredTasks.map(task => {
            const isDone = completedTasks.has(task.id)
            const isTimerActive = activeTimer === task.id

            return (
              <div
                key={task.id}
                className={`task-card ${isDone ? 'completed' : ''}`}
              >
                <div className="task-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{task.icon}</span>
                    <h3 className={`task-title ${isDone ? 'completed' : ''}`}>{task.title}</h3>
                  </div>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                  <span className="badge badge-category">{task.category}</span>
                  <span className="badge badge-quick-win">⚡ {task.duration}</span>
                  {task.frequency && (
                    <span className={`badge badge-${task.frequency}`}>{task.frequency}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <div className="task-check">
                    <input
                      type="checkbox"
                      id={`notif-${task.id}`}
                      checked={isDone}
                      onChange={() => toggleTask(task.id)}
                      className="task-checkbox"
                    />
                    <label
                      htmlFor={`notif-${task.id}`}
                      className="task-check-label"
                      style={isDone ? { textDecoration: 'line-through' } : {}}
                    >
                      {isDone ? 'Done!' : 'Mark complete'}
                    </label>
                  </div>

                  <button
                    className={`btn btn-sm ${isTimerActive ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => startTimer(task.id)}
                  >
                    {isTimerActive ? `⏱ ${formatTime(timerSeconds)}` : '⏱ Start'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
