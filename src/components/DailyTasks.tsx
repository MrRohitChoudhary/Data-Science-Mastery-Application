import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CAREER_TASKS } from '../data';
import { Search, Sparkles, Trash2, CheckCircle2, Zap, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Task {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  isQuickWin: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'dsm-daily-completed';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  study: 'Study',
  project: 'Project',
  networking: 'Networking',
  research: 'Research',
  github: 'GitHub',
  interview: 'Interview',
  micro: 'Micro',
};

const STUDY_TASKS: Task[] = [
  { id: 'st-01', title: 'Complete one Python data science module', description: 'Work through a structured module covering Pandas, NumPy, or Scikit-Learn with hands-on exercises.', frequency: 'daily', category: 'study', isQuickWin: true },
  { id: 'st-02', title: 'Read a chapter from a DS textbook', description: 'Dedicate 30-45 minutes to reading from ISLR, Hands-On ML, or another core textbook.', frequency: 'daily', category: 'study', isQuickWin: false },
  { id: 'st-03', title: 'Complete a Kaggle micro-course lesson', description: 'Finish one lesson from Kaggle Learn (Python, SQL, ML, Feature Engineering, etc.).', frequency: 'daily', category: 'study', isQuickWin: true },
  { id: 'st-04', title: 'Watch a university lecture video', description: 'Watch one full lecture from Stanford CS229, MIT 6.041, or another open course.', frequency: 'daily', category: 'study', isQuickWin: false },
  { id: 'st-05', title: 'Solve 5 LeetCode problems (Easy/Medium)', description: 'Practice algorithmic thinking with a mix of easy and medium problems.', frequency: 'daily', category: 'study', isQuickWin: true },
  { id: 'st-06', title: 'Review and practice SQL queries', description: 'Solve 3-5 SQL problems on StrataScratch, LeetCode, or DataLemur.', frequency: 'daily', category: 'study', isQuickWin: true },
  { id: 'st-07', title: 'Build a small data visualization project', description: 'Create an interactive chart or dashboard using Plotly, Seaborn, or Matplotlib.', frequency: 'weekly', category: 'project', isQuickWin: false },
  { id: 'st-08', title: 'Contribute to an open-source DS project', description: 'Fix a bug, add a feature, or improve documentation in a library you use.', frequency: 'weekly', category: 'project', isQuickWin: false },
  { id: 'st-09', title: 'Deploy a model to the cloud', description: 'Take a trained model and deploy it using FastAPI, Docker, and a cloud provider.', frequency: 'weekly', category: 'project', isQuickWin: false },
  { id: 'st-10', title: 'Build a portfolio website', description: 'Create or update a personal portfolio showcasing projects, skills, and blog posts.', frequency: 'weekly', category: 'project', isQuickWin: false },
  { id: 'st-11', title: 'Attend a data science meetup or webinar', description: 'Join an online or in-person event to learn from practitioners and expand your network.', frequency: 'weekly', category: 'networking', isQuickWin: true },
  { id: 'st-12', title: 'Send a cold outreach message', description: 'Reach out to a data scientist, recruiter, or hiring manager with a personalized message.', frequency: 'weekly', category: 'networking', isQuickWin: true },
  { id: 'st-13', title: 'Participate in a DS community discussion', description: 'Answer a question on Kaggle, Stack Overflow, or a DS Discord/Slack community.', frequency: 'daily', category: 'networking', isQuickWin: true },
  { id: 'st-14', title: 'Read and summarize a research paper', description: 'Read an arXiv paper in your area of interest and write a concise summary.', frequency: 'weekly', category: 'research', isQuickWin: false },
  { id: 'st-15', title: 'Explore a new AI/ML research trend', description: 'Spend 45 minutes reading blog posts or papers on a trending topic (e.g., agents, multimodal AI).', frequency: 'daily', category: 'research', isQuickWin: false },
  { id: 'st-16', title: 'Follow top ML researchers on social media', description: 'Find and follow 2-3 researchers whose work aligns with your interests on Twitter/X or LinkedIn.', frequency: 'weekly', category: 'research', isQuickWin: true },
  { id: 'st-17', title: 'Push code to GitHub', description: 'Commit code, update a README, or open a PR. Keep your contribution graph active.', frequency: 'daily', category: 'github', isQuickWin: true },
  { id: 'st-18', title: 'Star and explore trending ML repos', description: 'Browse GitHub Trending for data science repos and star useful ones.', frequency: 'weekly', category: 'github', isQuickWin: true },
  { id: 'st-19', title: 'Create a GitHub profile README', description: 'Set up or refresh your profile README with bio, skills, and pinned projects.', frequency: 'monthly', category: 'github', isQuickWin: false },
  { id: 'st-20', title: 'Practice SQL interview questions', description: 'Solve 3-5 SQL problems commonly asked in data science interviews.', frequency: 'daily', category: 'interview', isQuickWin: true },
  { id: 'st-21', title: 'Practice ML theory questions', description: 'Review and explain key ML concepts: bias-variance, gradient descent, regularization, etc.', frequency: 'daily', category: 'interview', isQuickWin: true },
  { id: 'st-22', title: 'Do a mock technical interview', description: 'Practice a full technical interview with coding and ML questions.', frequency: 'weekly', category: 'interview', isQuickWin: false },
  { id: 'st-23', title: 'Prepare STAR-format behavioral answers', description: 'Write and rehearse 3-5 behavioral answers using the STAR method.', frequency: 'weekly', category: 'interview', isQuickWin: true },
  { id: 'st-24', title: 'Complete a daily code challenge', description: 'Solve one quick coding or SQL challenge on LeetCode, HackerRank, or StrataScratch.', frequency: 'daily', category: 'micro', isQuickWin: true },
  { id: 'st-25', title: 'Write a 100-word learning reflection', description: 'Summarize what you learned today in a journal or note-taking app.', frequency: 'daily', category: 'micro', isQuickWin: true },
  { id: 'st-26', title: 'Share a DS insight on LinkedIn', description: 'Post a brief analysis, visualization, or learning from your recent work.', frequency: 'weekly', category: 'micro', isQuickWin: true },
  { id: 'st-27', title: 'Read one AI newsletter edition', description: 'Read The Batch, Import AI, or TLDR AI to stay current with AI news.', frequency: 'daily', category: 'micro', isQuickWin: true },
];

const ALL_TASKS: Task[] = [...(CAREER_TASKS as Task[]), ...STUDY_TASKS];

const FREQUENCY_ICONS: Record<string, React.ReactNode> = {
  daily: <CalendarDays size={13} />,
  weekly: <CalendarRange size={13} />,
  monthly: <CalendarClock size={13} />,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set<string>(arr);
    }
  } catch {
    /* ignore */
  }
  return new Set<string>();
}

function saveCompleted(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DailyTasks() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(loadCompleted);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage whenever completedTasks changes
  useEffect(() => {
    saveCompleted(completedTasks);
  }, [completedTasks]);

  // Stats
  const stats = useMemo(() => {
    const total = ALL_TASKS.length;
    const quickWins = ALL_TASKS.filter((t) => t.isQuickWin).length;
    const completed = completedTasks.size;
    const daily = ALL_TASKS.filter((t) => t.frequency === 'daily').length;
    return { total, quickWins, completed, daily };
  }, [completedTasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let tasks = ALL_TASKS;

    if (selectedFilter !== 'all') {
      tasks = tasks.filter((t) => t.category === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }

    return tasks;
  }, [selectedFilter, searchQuery]);

  // Generate today's plan – selects daily + quick-win tasks
  const handleGeneratePlan = useCallback(() => {
    setSelectedFilter('all');
    setSearchQuery('');
    const dailyOrQuickWin = ALL_TASKS.filter(
      (t) => t.frequency === 'daily' || t.isQuickWin,
    );
    const ids = new Set<string>(dailyOrQuickWin.map((t) => t.id));
    setCompletedTasks(ids);
  }, []);

  // Toggle a single task
  const toggleTask = useCallback((id: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Clear all completed
  const clearCompleted = useCallback(() => {
    setCompletedTasks(new Set<string>());
  }, []);

  // Frequency badge class helper
  const frequencyBadgeClass = (freq: string): string => {
    switch (freq) {
      case 'daily':
        return 'badge badge-daily';
      case 'weekly':
        return 'badge badge-weekly';
      case 'monthly':
        return 'badge badge-monthly';
      default:
        return 'badge badge-category';
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* ---- Header ---- */}
      <div className="page-header">
        <h1 className="page-title">Daily AI Task Engine</h1>
        <p className="page-subtitle">
          Curated tasks to accelerate your data science mastery — one day at a time.
        </p>
      </div>

      {/* ---- Stats ---- */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.daily}</div>
          <div className="stat-label">Daily Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.quickWins}</div>
          <div className="stat-label">Quick Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* ---- Toolbar ---- */}
      <div className="toolbar">
        <div className="filter-group">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`filter-pill${selectedFilter === key ? ' active' : ''}`}
              onClick={() => setSelectedFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <div className="search-row">
            <input
              type="text"
              className="input"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleGeneratePlan}>
            <Sparkles size={16} />
            Generate Today's Plan
          </button>

          {completedTasks.size > 0 && (
            <button className="btn btn-danger btn-sm" onClick={clearCompleted}>
              <Trash2 size={14} />
              Clear ({completedTasks.size})
            </button>
          )}
        </div>
      </div>

      {/* ---- Result meta ---- */}
      <p className="result-meta">
        Showing {filteredTasks.length} of {ALL_TASKS.length} tasks
      </p>

      {/* ---- Task Grid ---- */}
      <div className="grid grid-3 stagger">
        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks found</p>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {filteredTasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);

          return (
            <div
              key={task.id}
              className={`task-card animate-fade-in-up${isCompleted ? ' completed' : ''}`}
            >
              {/* Card header */}
              <div className="task-card-header">
                <h3 className={`task-title${isCompleted ? ' completed' : ''}`}>
                  {task.title}
                </h3>
                <span className="badge badge-category">{task.category.replace('_', ' ')}</span>
              </div>

              {/* Description */}
              <p className="task-description">{task.description}</p>

              {/* Meta badges */}
              <div className="task-meta">
                {task.frequency && (
                  <span className={frequencyBadgeClass(task.frequency)}>
                    {FREQUENCY_ICONS[task.frequency]}{' '}
                    {task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)}
                  </span>
                )}
                {task.isQuickWin && (
                  <span className="badge badge-quick-win">
                    <Zap size={12} /> Quick Win
                  </span>
                )}
              </div>

              {/* Checkbox */}
              <div className="task-check">
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  className="task-checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTask(task.id)}
                />
                <label htmlFor={`task-${task.id}`} className="task-check-label">
                  {isCompleted ? (
                    <>
                      <CheckCircle2 size={14} /> Completed
                    </>
                  ) : (
                    'Mark as complete'
                  )}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
