import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LEARNING_ROADMAP } from '../data';

const topicNameMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  LEARNING_ROADMAP.forEach((phase) => {
    phase.topics.forEach((topic) => {
      map[topic.id] = topic.name;
    });
  });
  return map;
})();

const Roadmap: React.FC = () => {
  const [expandedPhase, setExpandedPhase] = useState<number>(0);

  const totalHours = LEARNING_ROADMAP.reduce(
    (sum, phase) => sum + phase.topics.reduce((t, topic) => t + topic.estimatedHours, 0),
    0
  );

  const totalTopics = LEARNING_ROADMAP.reduce(
    (sum, phase) => sum + phase.topics.length,
    0
  );

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? -1 : index);
  };

  const getProgress = (phaseIndex: number): number => {
    return phaseIndex % 2 === 0 ? 0 : 100;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Data Science Mastery Roadmap</h1>
        <p className="page-subtitle">
          Your complete journey from foundations to cutting-edge AI
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-value">{totalHours}h</p>
            <p className="stat-label">Total Hours</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{totalTopics}</p>
            <p className="stat-label">Topics</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{LEARNING_ROADMAP.length}</p>
            <p className="stat-label">Phases</p>
          </div>
        </div>
      </div>

      <div className="phases-container">
        {LEARNING_ROADMAP.map((phase, phaseIndex) => {
          const progress = getProgress(phaseIndex);
          const isExpanded = expandedPhase === phaseIndex;

          return (
            <div
              key={phase.id}
              className={`phase-card animate-fade-in-up stagger`}
            >
              <div
                className="phase-header"
                onClick={() => togglePhase(phaseIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePhase(phaseIndex);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <span className="phase-icon" aria-hidden="true">
                  {phase.icon}
                </span>
                <div className="phase-info">
                  <h2 className="phase-title">
                    Phase {phase.phase}: {phase.title}
                  </h2>
                  <p className="phase-subtitle">{phase.subtitle}</p>
                </div>
                <div className="phase-meta">
                  <span className="duration-badge">{phase.duration}</span>
                  <div className="progress-container">
                    <div className="progress-label">
                      <span>{progress === 100 ? 'Completed' : 'Incomplete'}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span
                  className={`expand-icon${isExpanded ? ' expanded' : ''}`}
                  aria-hidden="true"
                >
                  <ChevronDown size={20} />
                </span>
              </div>

              {isExpanded && (
                <div className="phase-content">
                  <ul className="topics-list">
                    {phase.topics.map((topic) => (
                      <li key={topic.id} className="topic-card">
                        <div className="topic-header">
                          <h3 className="topic-name">{topic.name}</h3>
                          <div className="topic-meta">
                            <span className={`badge badge-${topic.difficulty}`}>
                              {topic.difficulty}
                            </span>
                            <span className="hours-badge">
                              {topic.estimatedHours}h
                            </span>
                          </div>
                        </div>

                        <ul className="subtopics-list">
                          {topic.subtopics.map((subtopic, idx) => (
                            <li key={idx}>{subtopic}</li>
                          ))}
                        </ul>

                        <div className="prerequisites-container">
                          <span className="prerequisites-label">
                            Prerequisites:
                          </span>
                          {topic.prerequisites.length === 0 ? (
                            <span className="no-prerequisites">None</span>
                          ) : (
                            topic.prerequisites.map((prereqId) => (
                              <span
                                key={prereqId}
                                className="prerequisite-chip"
                                role="button"
                                tabIndex={0}
                                title={topicNameMap[prereqId] || prereqId}
                              >
                                {topicNameMap[prereqId] || prereqId}
                              </span>
                            ))
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
