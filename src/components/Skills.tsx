import React, { useState } from 'react';
import { SKILLS_DATABASE } from '../data';
import { Shield } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  importance: 'critical' | 'important' | 'nice-to-have';
  futureProof: boolean;
  relatedPhase: number;
}

interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

const categories: SkillCategory[] = Object.values(
  SKILLS_DATABASE as Record<string, SkillCategory>
);

const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>(categories[0]);
  const [hovered, setHovered] = useState<string | null>(null);

  const allSkills: Skill[] = categories.flatMap((c) => c.skills);
  const totalSkills = allSkills.length;
  const criticalCount = allSkills.filter((s) => s.importance === 'critical').length;
  const futureProofCount = allSkills.filter((s) => s.futureProof).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Comprehensive Skills &amp; Tools Database</h1>
        <p className="page-subtitle">
          Explore the full spectrum of competencies needed to master modern data
          science, machine learning, and AI.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalSkills}</div>
          <div className="stat-label">Total Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{criticalCount}</div>
          <div className="stat-label">Critical Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{futureProofCount}</div>
          <div className="stat-label">Future-Proof</div>
        </div>
      </div>

      <div className="tabs">
        {categories.map((cat) => {
          const active = cat.category === selectedCategory.category;
          return (
            <button
              key={cat.category}
              className={`tab${active ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span className="tab-icon">{cat.icon}</span>
              {cat.category}
              <span className="tab-count">{cat.skills.length}</span>
            </button>
          );
        })}
      </div>

      <div className="category-header">
        <h2 className="page-title">
          <span className="tab-icon">{selectedCategory.icon}</span>
          {selectedCategory.category}
        </h2>
        <span className="category-count">
          {selectedCategory.skills.length} skills in this category
        </span>
      </div>

      <div className="grid-3">
        {selectedCategory.skills.map((skill) => (
          <div
            key={skill.id}
            className={`skill-card${hovered === skill.id ? ' hovered' : ''}`}
            onMouseEnter={() => setHovered(skill.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="skill-card-header">
              <h3 className="skill-name">{skill.name}</h3>
              {skill.futureProof && (
                <span className="future-proof-icon" title="Future-Proof Skill">
                  <Shield size={18} />
                </span>
              )}
            </div>

            <p className="skill-desc">{skill.description}</p>

            <div className="skill-badges">
              <span className={`badge badge-${skill.difficulty}`}>
                {skill.difficulty}
              </span>
              <span className={`badge badge-${skill.importance}`}>
                {skill.importance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
