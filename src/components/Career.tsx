import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, Zap, Target } from 'lucide-react';
import { CAREER_TASKS } from '../data';

const CATEGORIES = [
  'All',
  'Resume',
  'LinkedIn',
  'GitHub',
  'Kaggle',
  'Hackathon',
  'Networking',
  'Cold Email',
  'Research Outreach',
  'Open Source',
  'Internship',
  'Mock Interview',
];

const FREQUENCIES = ['All', 'Daily', 'Weekly', 'Monthly'];

const STORAGE_KEY = 'dsm-career-completed';

const categoryToKey = (cat: string): string =>
  cat.toLowerCase().replace(/\s+/g, '_');

const loadCompleted = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore
  }
  return new Set();
};

const saveCompleted = (set: Set<string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
};

const Career: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('All');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(loadCompleted);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    saveCompleted(completedTasks);
  }, [completedTasks]);

  const stats = useMemo(() => {
    const total = CAREER_TASKS.length;
    const daily = CAREER_TASKS.filter((t: any) => t.frequency === 'daily').length;
    const weekly = CAREER_TASKS.filter((t: any) => t.frequency === 'weekly').length;
    const monthly = CAREER_TASKS.filter((t: any) => t.frequency === 'monthly').length;
    const quickWins = CAREER_TASKS.filter((t: any) => t.isQuickWin).length;
    return { total, daily, weekly, monthly, quickWins };
  }, []);

  const filteredTasks = useMemo(() => {
    return CAREER_TASKS.filter((task: any) => {
      const categoryMatch =
        categoryFilter === 'All' ||
        task.category === categoryToKey(categoryFilter);
      const frequencyMatch =
        frequencyFilter === 'All' ||
        task.frequency === frequencyFilter.toLowerCase();
      return categoryMatch && frequencyMatch;
    });
  }, [categoryFilter, frequencyFilter]);

  const toggleComplete = (id: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completedCount = useMemo(
    () => filteredTasks.filter((t: any) => completedTasks.has(t.id)).length,
    [filteredTasks, completedTasks]
  );

  const progressPct =
    filteredTasks.length > 0
      ? Math.round((completedCount / filteredTasks.length) * 100)
      : 0;

  const getFreqBadgeClass = (freq: string): string => {
    if (freq === 'daily') return 'badge badge-daily';
    if (freq === 'weekly') return 'badge badge-weekly';
    return 'badge badge-monthly';
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Career Development Hub</h1>
        <p className="page-subtitle">
          Build consistent habits across resume, networking, and interview prep.
          Click any card to mark it complete.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.daily}</div>
          <div className="stat-label">Daily</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.weekly}</div>
          <div className="stat-label">Weekly</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.monthly}</div>
          <div className="stat-label">Monthly</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.quickWins}</div>
          <div className="stat-label">Quick Wins</div>
        </div>
      </div>

      <div className="filter-group">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-pill${categoryFilter === cat ? ' active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-group">
        {FREQUENCIES.map((freq) => (
          <button
            key={freq}
            className={`filter-pill${frequencyFilter === freq ? ' active' : ''}`}
            onClick={() => setFrequencyFilter(freq)}
          >
            {freq}
          </button>
        ))}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="section-header">
        <h2 className="section-title">
          <Target size={20} />
          Tasks
          {filteredTasks.length > 0 && (
            <span className="section-count">
              {completedCount}/{filteredTasks.length}
            </span>
          )}
        </h2>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">No tasks match the selected filters.</div>
      ) : (
        <div className="grid-3">
          {filteredTasks.map((task: any) => {
            const isDone = completedTasks.has(task.id);
            return (
              <div
                key={task.id}
                className={`career-card${isDone ? ' completed' : ''}`}
                onClick={() => toggleComplete(task.id)}
                onMouseEnter={() => setHoveredId(task.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`check-circle${isDone ? ' done' : ''}`}>
                  {isDone && <CheckCircle size={16} />}
                </div>

                <h3 className={`career-card-title${isDone ? ' completed' : ''}`}>
                  {task.title}
                </h3>
                <p className="career-card-desc">{task.description}</p>

                <div className="career-badge-row">
                  <span className={getFreqBadgeClass(task.frequency)}>
                    {task.frequency}
                  </span>
                  <span className="badge badge-category">
                    {task.category.replace(/_/g, ' ')}
                  </span>
                  {task.isQuickWin && (
                    <span className="badge badge-quick-win">
                      <Zap size={12} /> Quick Win
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Career;
