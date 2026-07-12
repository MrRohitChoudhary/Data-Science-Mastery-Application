import React, { useState, useMemo } from 'react';
import { Search, Lightbulb, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { INTERVIEW_QUESTIONS } from '../data';

interface Question {
  id: string;
  question: string;
  difficulty: string;
  category: string;
  hint: string;
}

const TABS: { key: string; label: string }[] = [
  { key: 'technical', label: 'Technical' },
  { key: 'sql', label: 'SQL' },
  { key: 'python', label: 'Python' },
  { key: 'statistics', label: 'Statistics' },
  { key: 'ml', label: 'ML' },
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'research', label: 'Research' },
  { key: 'case_studies', label: 'Case Studies' },
];

const DIFFICULTY_OPTIONS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Interview() {
  const [activeTab, setActiveTab] = useState<string>('technical');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const allQuestions: Question[] = (INTERVIEW_QUESTIONS as Record<string, Question[]>)[activeTab] || [];

  const countsByDifficulty = useMemo(() => {
    const map: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0 };
    allQuestions.forEach((q) => {
      if (map[q.difficulty] !== undefined) map[q.difficulty] += 1;
    });
    return map;
  }, [allQuestions]);

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allQuestions.filter((q) => {
      const matchesDifficulty =
        difficultyFilter === 'All' ||
        q.difficulty === difficultyFilter.toLowerCase();
      const matchesSearch =
        query === '' ||
        q.question.toLowerCase().includes(query) ||
        (q.hint && q.hint.toLowerCase().includes(query));
      return matchesDifficulty && matchesSearch;
    });
  }, [allQuestions, searchQuery, difficultyFilter]);

  const toggleExpanded = (id: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TABS.forEach((t) => {
      counts[t.key] = ((INTERVIEW_QUESTIONS as Record<string, Question[]>)[t.key] || []).length;
    });
    return counts;
  }, []);

  return (
    <div className="page-container animate-fade-in">
      {/* ── Header ── */}
      <div className="page-header">
        <h1 className="page-title">Interview &amp; Career Readiness</h1>
        <p className="page-subtitle">
          Practice with curated interview questions across core data science
          domains. Use the difficulty filter and search to focus your prep.
        </p>
      </div>

      {/* ── Toolbar: Search + Difficulty Filter ── */}
      <div className="toolbar">
        <div className="search-row">
          <Search size={16} />
          <input
            type="text"
            className="input"
            placeholder="Search questions by text or hint…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`filter-pill${difficultyFilter === opt ? ' active' : ''}`}
              onClick={() => setDifficultyFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <MessageSquare size={14} className="tab-icon" />
            {t.label}
            <span className="tab-count">{tabCounts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Result Meta ── */}
      <div className="result-meta">
        Showing {filteredQuestions.length} of {allQuestions.length}{' '}
        {activeTab.replace('_', ' ')} questions
        {difficultyFilter !== 'All' && (
          <span>
            {' '}· {difficultyFilter} ({countsByDifficulty[difficultyFilter.toLowerCase()]})
          </span>
        )}
        {searchQuery.trim() !== '' && (
          <span> · matching &ldquo;{searchQuery}&rdquo;</span>
        )}
      </div>

      {/* ── Question Cards or Empty State ── */}
      {filteredQuestions.length === 0 ? (
        <div className="empty-state">
          <p>No questions match your current filters.</p>
          <p>Try adjusting the search or difficulty filter.</p>
        </div>
      ) : (
        <div className="grid grid-3 stagger">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestions.has(q.id);
            return (
              <div key={q.id} className="question-card animate-fade-in-up">
                <div className="task-card-header">
                  <p className="question-text">{q.question}</p>
                  <span className={`badge badge-${q.difficulty}`}>
                    {q.difficulty}
                  </span>
                </div>

                <div className="question-category">
                  Category: {q.category.replace('_', ' ')}
                </div>

                {isExpanded && (
                  <div className="hint-box">
                    <strong><Lightbulb size={13} /> Hint: </strong>
                    {q.hint}
                  </div>
                )}

                <button
                  className="show-hint-btn"
                  onClick={() => toggleExpanded(q.id)}
                >
                  {isExpanded ? (
                    <><EyeOff size={13} /> Hide Hint</>
                  ) : (
                    <><Eye size={13} /> Show Hint</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
