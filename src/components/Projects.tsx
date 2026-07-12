import React, { useState, useMemo } from 'react';
import { Layers, BookOpen, TrendingUp, Award, FolderKanban, Clock, Globe } from 'lucide-react';
import { PROJECT_IDEAS } from '../data';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;

const DOMAINS = [
  'All Domains',
  'NLP',
  'Computer Vision',
  'Finance',
  'Healthcare',
  'Time Series',
  'Generative AI',
  'Recommendation',
  'Industry',
  'Research',
  'General',
];

const domainToKey: Record<string, string> = {
  'All Domains': 'all',
  NLP: 'nlp',
  'Computer Vision': 'computer_vision',
  Finance: 'finance',
  Healthcare: 'healthcare',
  'Time Series': 'time_series',
  'Generative AI': 'generative_ai',
  Recommendation: 'recommendation',
  Industry: 'industry',
  Research: 'research',
  General: 'general',
};

const Projects: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>('all');
  const [domain, setDomain] = useState<string>('All Domains');

  const stats = useMemo(() => {
    const total = PROJECT_IDEAS.length;
    const beginner = PROJECT_IDEAS.filter((p) => p.difficulty === 'beginner').length;
    const intermediate = PROJECT_IDEAS.filter((p) => p.difficulty === 'intermediate').length;
    const advanced = PROJECT_IDEAS.filter((p) => p.difficulty === 'advanced').length;
    return { total, beginner, intermediate, advanced };
  }, []);

  const filtered = useMemo(() => {
    return PROJECT_IDEAS.filter((p) => {
      const matchDifficulty = difficulty === 'all' || p.difficulty === difficulty;
      const matchDomain = domain === 'All Domains' || p.domain === domainToKey[domain];
      return matchDifficulty && matchDomain;
    });
  }, [difficulty, domain]);

  return (
    <div className="page-container">
      {/* ── Header ── */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title">🏗️ Project &amp; Portfolio Architect</h1>
        <p className="page-subtitle">
          Build a standout data-science portfolio with curated, real-world projects across
          domains and skill levels.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid animate-fade-in-up">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.beginner}</div>
          <div className="stat-label">Beginner</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.intermediate}</div>
          <div className="stat-label">Intermediate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.advanced}</div>
          <div className="stat-label">Advanced</div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="toolbar animate-fade-in-up">
        <div className="filter-group">
          <button
            className={`filter-pill${difficulty === 'all' ? ' active' : ''}`}
            onClick={() => setDifficulty('all')}
          >
            All
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`filter-pill${difficulty === d ? ' active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <select
          className="select"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* ── Grid / Empty ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={48} />
          <p>No projects match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              className="project-card animate-fade-in-up"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* top row: title + badge */}
              <div className="project-card-top">
                <h3 className="project-title">{project.title}</h3>
                <span className={`badge badge-${project.difficulty}`}>
                  {project.difficulty}
                </span>
              </div>

              {/* description */}
              <p className="task-description">{project.description}</p>

              {/* meta row */}
              <div className="project-meta">
                <span>
                  <Globe size={14} /> <strong>Domain:</strong> {project.domain}
                </span>
                <span>
                  <Clock size={14} /> <strong>Est.:</strong> {project.estimatedDays}{' '}
                  day{project.estimatedDays === 1 ? '' : 's'}
                </span>
              </div>

              {/* skills chips */}
              <div>
                <p className="section-label">Skills</p>
                <div className="chip-row">
                  {project.skills.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* datasets */}
              <div>
                <p className="section-label">Datasets</p>
                <ul className="compact-list">
                  {project.datasets.map((ds) => (
                    <li key={ds}>{ds}</li>
                  ))}
                </ul>
              </div>

              {/* deliverables */}
              <div>
                <p className="section-label">Deliverables</p>
                <ul className="compact-list">
                  {project.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
