import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LEARNING_ROADMAP, SKILLS_DATABASE } from '../data';
import {
  BookOpen,
  Brain,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Circle,
  Zap,
  Calendar,
  Quote,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DailyTask {
  id: string;
  title: string;
  category: string;
  duration: string;
  icon: string;
}

// ─── Task Templates ──────────────────────────────────────────────────────────
const TASK_TEMPLATES: DailyTask[] = [
  { id: 't01', title: 'Review Python list comprehensions', category: 'study', duration: '20 min', icon: '📖' },
  { id: 't02', title: 'Practice SQL window functions', category: 'practice', duration: '30 min', icon: '💻' },
  { id: 't03', title: 'Read a research paper on transformers', category: 'research', duration: '45 min', icon: '🔬' },
  { id: 't04', title: 'Build a simple EDA notebook', category: 'project', duration: '60 min', icon: '📊' },
  { id: 't05', title: 'Update your LinkedIn headline', category: 'networking', duration: '15 min', icon: '🔗' },
  { id: 't06', title: 'Solve 3 interview coding problems', category: 'interview', duration: '45 min', icon: '🎯' },
  { id: 't07', title: 'Push a commit to your portfolio repo', category: 'github', duration: '20 min', icon: '🐙' },
  { id: 't08', title: 'Review linear algebra fundamentals', category: 'study', duration: '30 min', icon: '📐' },
  { id: 't09', title: 'Practice pandas data wrangling', category: 'practice', duration: '25 min', icon: '🐼' },
  { id: 't10', title: 'Write a blog post outline', category: 'productivity', duration: '20 min', icon: '✍️' },
  { id: 't11', title: 'Study probability distributions', category: 'study', duration: '30 min', icon: '📈' },
  { id: 't12', title: 'Clean & organize your project folder', category: 'productivity', duration: '15 min', icon: '🗂️' },
  { id: 't13', title: 'Implement logistic regression from scratch', category: 'project', duration: '60 min', icon: '🧮' },
  { id: 't14', title: 'Review hypothesis testing concepts', category: 'study', duration: '25 min', icon: '🧪' },
  { id: 't15', title: 'Connect with a data science professional', category: 'networking', duration: '15 min', icon: '🤝' },
  { id: 't16', title: 'Update your resume with new skills', category: 'resume', duration: '20 min', icon: '📝' },
  { id: 't17', title: 'Build a visualization dashboard', category: 'project', duration: '45 min', icon: '📉' },
  { id: 't18', title: 'Watch a deep learning lecture', category: 'study', duration: '40 min', icon: '🎥' },
  { id: 't19', title: 'Practice NumPy array operations', category: 'practice', duration: '20 min', icon: '🔢' },
  { id: 't20', title: 'Contribute to an open-source project', category: 'github', duration: '30 min', icon: '🌟' },
  { id: 't21', title: 'Study decision tree algorithms', category: 'study', duration: '25 min', icon: '🌳' },
  { id: 't22', title: 'Practice feature engineering techniques', category: 'practice', duration: '30 min', icon: '⚙️' },
  { id: 't23', title: 'Read about MLOps best practices', category: 'research', duration: '20 min', icon: '🚀' },
  { id: 't24', title: 'Review cross-validation strategies', category: 'study', duration: '20 min', icon: '🔄' },
  { id: 't25', title: 'Prepare answers for behavioral questions', category: 'interview', duration: '25 min', icon: '💬' },
  { id: 't26', title: 'Build a simple ML pipeline', category: 'project', duration: '45 min', icon: '🔧' },
  { id: 't27', title: 'Study neural network architectures', category: 'study', duration: '30 min', icon: '🧠' },
  { id: 't28', title: 'Set up a personal learning tracker', category: 'productivity', duration: '15 min', icon: '📋' },
  { id: 't29', title: 'Practice matplotlib and seaborn', category: 'practice', duration: '25 min', icon: '🎨' },
  { id: 't30', title: 'Review Bayesian statistics concepts', category: 'study', duration: '30 min', icon: '📊' },
  { id: 't31', title: 'Explore a new Kaggle dataset', category: 'research', duration: '20 min', icon: '🗄️' },
  { id: 't32', title: 'Write unit tests for your ML code', category: 'project', duration: '25 min', icon: '✅' },
  { id: 't33', title: 'Practice gradient boosting tuning', category: 'practice', duration: '30 min', icon: '📶' },
  { id: 't34', title: 'Sketch your next portfolio project', category: 'resume', duration: '20 min', icon: '🖊️' },
  { id: 't35', title: 'Study NLP text preprocessing', category: 'study', duration: '25 min', icon: '📰' },
  { id: 't36', title: 'Optimize a slow Pandas pipeline', category: 'practice', duration: '20 min', icon: '⚡' },
  { id: 't37', title: 'Review Docker containerization basics', category: 'study', duration: '25 min', icon: '🐳' },
  { id: 't38', title: 'Write a README for your latest project', category: 'github', duration: '15 min', icon: '📄' },
  { id: 't39', title: 'Practice A/B testing problem sets', category: 'interview', duration: '30 min', icon: '🔍' },
  { id: 't40', title: 'Study time series forecasting methods', category: 'study', duration: '30 min', icon: '⏰' },
];

// ─── Motivational Quotes ─────────────────────────────────────────────────────
const QUOTES = [
  { text: 'Data is the new oil. It\'s valuable, but if unrefined it cannot really be used.', author: 'Clive Humby' },
  { text: 'Without data, you\'re just another person with an opinion.', author: 'W. Edwards Deming' },
  { text: 'The goal is to turn data into information, and information into insight.', author: 'Carly Fiorina' },
  { text: 'In God we trust; all others must bring data.', author: 'W. Edwards Deming' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'The only way to learn mathematics is to do mathematics.', author: 'Paul Halmos' },
  { text: 'Torture the data, and it will confess to anything.', author: 'Ronald Coase' },
  { text: 'You can have data without information, but you cannot have information without data.', author: 'Daniel Keys Moran' },
  { text: 'The best thing about being a statistician is that you get to play in everyone\'s backyard.', author: 'John Tukey' },
  { text: 'It is a capital mistake to theorize before one has data.', author: 'Arthur Conan Doyle' },
  { text: 'Data science is not about the size of your data, but what you do with it.', author: 'Hadley Wickham' },
  { text: 'An approximate answer to the right problem is worth a good deal more than an exact answer to an approximate problem.', author: 'John Tukey' },
  { text: 'The world is one big data problem.', author: 'Andrew McAfee' },
  { text: 'Errors using inadequate data are much less than those using no data at all.', author: 'Charles Babbage' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

const CATEGORY_BADGES: Record<string, string> = {
  study: 'badge badge-beginner',
  practice: 'badge badge-intermediate',
  project: 'badge badge-advanced',
  networking: 'badge badge-nice-to-have',
  resume: 'badge badge-must-have',
  github: 'badge badge-category',
  research: 'badge badge-important',
  interview: 'badge badge-critical',
  productivity: 'badge badge-recommended',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const today = useMemo(() => new Date(), []);
  const dayOfYear = useMemo(() => getDayOfYear(today), [today]);
  const dateString = useMemo(() => getDateString(today), [today]);

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalTopics = LEARNING_ROADMAP.reduce(
      (sum, phase) => sum + phase.topics.length,
      0
    );

    const totalSkills = Object.values(SKILLS_DATABASE).reduce(
      (sum, category) => sum + category.skills.length,
      0
    );

    const totalHours = LEARNING_ROADMAP.reduce(
      (sum, phase) =>
        sum +
        phase.topics.reduce(
          (topicSum, topic) => topicSum + topic.estimatedHours,
          0
        ),
      0
    );

    const totalPhases = LEARNING_ROADMAP.length;

    return { totalTopics, totalSkills, totalHours, totalPhases };
  }, []);

  // ── Today's Tasks ────────────────────────────────────────────────────────
  const todayTasks = useMemo(() => {
    const shuffled = seededShuffle(TASK_TEMPLATES, dayOfYear);
    return shuffled.slice(0, 7);
  }, [dayOfYear]);

  // ── Completed State ──────────────────────────────────────────────────────
  const storageKey = `dsm-today-tasks-${dateString}`;

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return new Set(JSON.parse(stored) as string[]);
      }
    } catch {
      // ignore
    }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(completedTasks))
      );
    } catch {
      // ignore
    }
  }, [completedTasks, storageKey]);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  // ── Quick Wins ───────────────────────────────────────────────────────────
  const quickWins = useMemo(() => {
    return todayTasks.filter((t) =>
      ['15 min', '20 min', '25 min'].includes(t.duration)
    );
  }, [todayTasks]);

  // ── Quote ────────────────────────────────────────────────────────────────
  const dailyQuote = useMemo(
    () => QUOTES[dayOfYear % QUOTES.length],
    [dayOfYear]
  );

  // ── Completion Progress ──────────────────────────────────────────────────
  const completionPercent = useMemo(() => {
    if (todayTasks.length === 0) return 0;
    return Math.round((completedTasks.size / todayTasks.length) * 100);
  }, [completedTasks, todayTasks]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="page-container animate-fade-in">
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <div className="dashboard-hero">
        <h1 className="hero-title animate-fade-in-up">
          🚀 Data Science Mastery
        </h1>
        <p className="hero-subtitle">
          Your AI-powered daily learning companion. Master data science with
          personalized plans, curated resources, and structured roadmaps.
        </p>
        <div className="hero-subtitle" style={{}}>
          <span className="badge badge-category">
            <Calendar size={12} />
            &nbsp;{formatDate(today)}
          </span>
        </div>
      </div>

      {/* ─── Stats Grid ───────────────────────────────────────────────── */}
      <div className="stats-grid animate-fade-in-up">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTopics}</div>
          <div className="stat-label">
            <BookOpen size={12} /> Total Topics
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalSkills}</div>
          <div className="stat-label">
            <Brain size={12} /> Total Skills
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalHours.toLocaleString()}</div>
          <div className="stat-label">
            <Clock size={12} /> Total Hours
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalPhases}</div>
          <div className="stat-label">
            <Layers size={12} /> Total Phases
          </div>
        </div>
      </div>

      {/* ─── Today's AI Plan ──────────────────────────────────────────── */}
      <section className="today-plan">
        <div className="section-header">
          <h2 className="section-title">
            <Sparkles size={20} /> Today&apos;s AI-Generated Plan
          </h2>
          <span className="section-count">
            {completedTasks.size}/{todayTasks.length} completed · {completionPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-label">
          <span>Daily Progress</span>
          <span>{completionPercent}%</span>
        </div>
        <div className="progress-bar" >
          <div
            className="progress-fill"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <div className="grid grid-3 stagger" style={{ marginTop: 'var(--space-lg)' }}>
          {todayTasks.map((task) => {
            const isCompleted = completedTasks.has(task.id);
            return (
              <div
                key={task.id}
                className={`task-card animate-fade-in-up${isCompleted ? ' completed' : ''}`}
              >
                <div className="task-card-header">
                  <span style={{ fontSize: '1.5rem' }}>{task.icon}</span>
                  <span className={CATEGORY_BADGES[task.category] || 'badge'}>
                    {task.category}
                  </span>
                </div>
                <h3 className={`task-title${isCompleted ? ' completed' : ''}`}>
                  {task.title}
                </h3>
                <div className="task-meta">
                  <span className="hours-badge">
                    <Clock size={12} /> {task.duration}
                  </span>
                </div>
                <label className="task-check">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={isCompleted}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="task-check-label">
                    {isCompleted ? 'Completed!' : 'Mark complete'}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : (
                    <Circle size={16} color="#64748b" />
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Quick Wins ───────────────────────────────────────────────── */}
      {quickWins.length > 0 && (
        <section style={{ marginTop: 'var(--space-xl)' }}>
          <div className="section-header">
            <h2 className="section-title">
              <Zap size={20} /> ⚡ Quick Wins (Under 30 Minutes)
            </h2>
            <span className="section-count">{quickWins.length} tasks</span>
          </div>
          <div className="grid grid-4 stagger">
            {quickWins.map((task) => {
              const isCompleted = completedTasks.has(task.id);
              return (
                <div
                  key={`qw-${task.id}`}
                  className={`card animate-fade-in-up${isCompleted ? ' completed' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleTask(task.id);
                  }}
                >
                  <div className="task-card-header">
                    <span style={{ fontSize: '1.3rem' }}>{task.icon}</span>
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#10b981" />
                    ) : (
                      <Circle size={18} color="#64748b" />
                    )}
                  </div>
                  <h3
                    className={`task-title${isCompleted ? ' completed' : ''}`}
                    style={{ fontSize: '0.88rem' }}
                  >
                    {task.title}
                  </h3>
                  <div className="task-meta">
                    <span className="hours-badge">{task.duration}</span>
                    <span className={CATEGORY_BADGES[task.category] || 'badge'}>
                      {task.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Learning Progress Overview ───────────────────────────────── */}
      <section style={{ marginTop: 'var(--space-xl)' }}>
        <div className="section-header">
          <h2 className="section-title">
            <BookOpen size={20} /> Learning Roadmap Overview
          </h2>
          <span className="section-count">{LEARNING_ROADMAP.length} phases</span>
        </div>
        <div
          className="card-glass"
          style={{
            overflowX: 'auto',
            padding: 'var(--space-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-md)',
              minWidth: 'max-content',
            }}
          >
            {LEARNING_ROADMAP.map((phase, idx) => (
              <div
                key={phase.id}
                className="stat-card animate-fade-in-up"
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  {phase.icon}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}
                >
                  Phase {phase.phase}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {phase.title}
                </div>
                <div className="hours-badge" style={{ marginTop: '8px' }}>
                  {phase.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Motivational Quote ───────────────────────────────────────── */}
      <section style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        <div
          className="card-glass animate-fade-in-up"
          style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
          }}
        >
          <Quote
            size={32}
            color="#6366f1"
            style={{ marginBottom: '16px', opacity: 0.6 }}
          />
          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto 12px',
              fontStyle: 'italic',
            }}
          >
            &ldquo;{dailyQuote.text}&rdquo;
          </p>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-accent)',
              fontWeight: 600,
            }}
          >
            — {dailyQuote.author}
          </p>
        </div>
      </section>
    </div>
  );
}
