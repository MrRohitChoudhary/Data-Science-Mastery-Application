import React, { useState } from 'react';
import { CERTIFICATIONS, COURSES, TOOLS_SOFTWARE, FUTURE_PROOF_SKILLS } from '../data';

interface Certification {
  id: string;
  name: string;
  provider: string;
  level: string;
  cost: string;
  price: string;
  roi: string;
  mustHave: boolean;
  url: string;
  duration: string;
  description: string;
}

interface Course {
  id: string;
  name: string;
  author?: string;
  creator?: string;
  url: string;
  level: string;
  category: string;
  description: string;
  isFree: boolean;
}

interface Tool {
  name: string;
  description: string;
  url: string;
  isFree: boolean;
  importance: string;
}

interface ToolCategory {
  name: string;
  icon: string;
  tools: Tool[];
}

interface FutureSkill {
  id: string;
  name: string;
  description: string;
  timeHorizon: string;
  demandLevel: string;
  relatedRoles: string[];
}

const categoryLabels: Record<string, string> = {
  books: 'Books',
  youtube: 'YouTube',
  moocs: 'MOOCs',
  bootcamps: 'Bootcamps',
  university: 'University',
  platforms: 'Platforms',
  communities: 'Communities',
  newsletters: 'Newsletters',
  podcasts: 'Podcasts',
};

const toolCategoryLabels: Record<string, string> = {
  programming: 'Programming',
  version_control: 'Version Control',
  visualization: 'Visualization',
  databases: 'Databases',
  cloud: 'Cloud Platforms',
  ai_assistants: 'AI Assistants',
  data_engineering: 'Data Engineering',
  deployment: 'Deployment & MLOps',
  research: 'Research',
  productivity: 'Productivity',
  notebooks: 'Notebooks & IDEs',
  collaboration: 'Collaboration',
};

const getLevelBadgeClass = (level: string): string => {
  switch (level) {
    case 'beginner':
      return 'badge badge-beginner';
    case 'intermediate':
      return 'badge badge-intermediate';
    case 'advanced':
      return 'badge badge-advanced';
    default:
      return 'badge';
  }
};

const getRoiBadgeClass = (roi: string): string => {
  switch (roi) {
    case 'high':
      return 'badge badge-high-roi';
    case 'medium':
      return 'badge badge-medium-roi';
    case 'low':
      return 'badge badge-nice-to-have';
    default:
      return 'badge';
  }
};

const getDemandBadgeClass = (demand: string): string => {
  switch (demand) {
    case 'very high':
      return 'demand-badge demand-very-high';
    case 'high':
      return 'demand-badge demand-high';
    case 'medium':
      return 'demand-badge demand-medium';
    default:
      return 'demand-badge demand-medium';
  }
};

const getImportanceBadgeClass = (importance: string): string => {
  switch (importance) {
    case 'essential':
      return 'badge badge-essential';
    case 'recommended':
      return 'badge badge-recommended';
    case 'optional':
      return 'badge badge-optional';
    default:
      return 'badge';
  }
};

const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('certifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');

  const certifications = CERTIFICATIONS as Certification[];
  const courses = COURSES as Record<string, Course[]>;
  const tools = TOOLS_SOFTWARE as Record<string, ToolCategory>;
  const futureSkills = FUTURE_PROOF_SKILLS as FutureSkill[];

  const tabs = [
    { key: 'certifications', label: 'Certifications' },
    { key: 'courses', label: 'Courses' },
    { key: 'tools', label: 'Tools & Software' },
    { key: 'future', label: 'Future-Proof Skills' },
  ];

  // --- Filtered data ---

  const filteredCertifications = certifications.filter((cert) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      cert.name.toLowerCase().includes(q) ||
      cert.provider.toLowerCase().includes(q);
    const matchesLevel = levelFilter === 'all' || cert.level === levelFilter;
    const matchesCost = costFilter === 'all' || cert.cost === costFilter;
    return matchesSearch && matchesLevel && matchesCost;
  });

  const filteredCourses = Object.entries(courses).flatMap(([category, items]) =>
    items
      .filter((course) => {
        const q = searchQuery.toLowerCase();
        return (
          course.name.toLowerCase().includes(q) ||
          (course.creator && course.creator.toLowerCase().includes(q)) ||
          course.description.toLowerCase().includes(q)
        );
      })
      .map((course) => ({ ...course, category }))
  );

  const filteredTools = Object.entries(tools).flatMap(([category, data]) =>
    data.tools
      .filter((tool) => {
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
        );
      })
      .map((tool) => ({ ...tool, category }))
  );

  const filteredFutureSkills = futureSkills.filter((skill) => {
    const q = searchQuery.toLowerCase();
    return (
      skill.name.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q)
    );
  });

  // --- Renderers ---

  const renderCertifications = () => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Level</th>
            <th>Cost</th>
            <th>ROI</th>
            <th>Must-Have</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {filteredCertifications.map((cert) => (
            <tr key={cert.id}>
              <td>
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-accent"
                >
                  {cert.name}
                </a>
                <div className="table-desc">{cert.description}</div>
              </td>
              <td>{cert.provider}</td>
              <td>
                <span className={getLevelBadgeClass(cert.level)}>
                  {cert.level}
                </span>
              </td>
              <td>{cert.cost}</td>
              <td>
                <span className={getRoiBadgeClass(cert.roi)}>{cert.roi}</span>
              </td>
              <td>
                {cert.mustHave ? (
                  <span className="badge badge-must-have">Must-Have</span>
                ) : (
                  <span className="badge badge-optional">Optional</span>
                )}
              </td>
              <td>{cert.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredCertifications.length === 0 && (
        <div className="empty-state">No certifications match your filters.</div>
      )}
    </div>
  );

  const renderCourses = () => {
    const grouped = filteredCourses.reduce<Record<string, (Course & { category: string })[]>>(
      (acc, course) => {
        if (!acc[course.category]) acc[course.category] = [];
        acc[course.category].push(course);
        return acc;
      },
      {}
    );

    return (
      <div>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="category-section">
            <h2 className="category-header">
              📚 {categoryLabels[category] || category}
            </h2>
            <p className="category-count">
              {items.length} resource{items.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-3">
              {items.map((course) => (
                <div key={course.id} className="resource-card">
                  <h3 className="resource-name">{course.name}</h3>
                  {course.creator && (
                    <p className="resource-meta">by {course.creator}</p>
                  )}
                  <p className="resource-desc">{course.description}</p>
                  <div className="resource-badges">
                    <span className={getLevelBadgeClass(course.level)}>
                      {course.level}
                    </span>
                    <span
                      className={`badge ${course.isFree ? 'badge-free' : 'badge-paid'}`}
                    >
                      {course.isFree ? 'Free' : 'Paid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="empty-state">No courses match your search.</div>
        )}
      </div>
    );
  };

  const renderTools = () => {
    const grouped = filteredTools.reduce<Record<string, (Tool & { category: string })[]>>(
      (acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      },
      {}
    );

    return (
      <div>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="category-section">
            <h2 className="category-header">
              🔧 {toolCategoryLabels[category] || category}
            </h2>
            <p className="category-count">
              {items.length} tool{items.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-3">
              {items.map((tool, idx) => (
                <div key={`${tool.category}-${idx}`} className="resource-card">
                  <h3 className="resource-name">{tool.name}</h3>
                  <p className="resource-desc">{tool.description}</p>
                  <div className="resource-badges">
                    <span
                      className={`badge ${tool.isFree ? 'badge-free' : 'badge-paid'}`}
                    >
                      {tool.isFree ? 'Free' : 'Paid'}
                    </span>
                    <span className={getImportanceBadgeClass(tool.importance)}>
                      {tool.importance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredTools.length === 0 && (
          <div className="empty-state">No tools match your search.</div>
        )}
      </div>
    );
  };

  const renderFutureSkills = () => (
    <div className="grid grid-3">
      {filteredFutureSkills.map((skill) => (
        <div key={skill.id} className="fps-card">
          <h3 className="fps-name">{skill.name}</h3>
          <p className="fps-desc">{skill.description}</p>
          <div className="fps-meta">
            <span className="badge badge-intermediate">{skill.timeHorizon}</span>
            <span className={getDemandBadgeClass(skill.demandLevel)}>
              {skill.demandLevel} demand
            </span>
          </div>
          <div className="roles-list">
            {skill.relatedRoles.map((role) => (
              <span key={role} className="role-badge">
                {role}
              </span>
            ))}
          </div>
        </div>
      ))}
      {filteredFutureSkills.length === 0 && (
        <div className="empty-state">No future-proof skills match your search.</div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Curated Resource & Certification Index</h1>
        <p className="page-subtitle">
          Discover certifications, courses, tools, and future-proof skills to
          accelerate your data science mastery.
        </p>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="search-row">
        <input
          type="text"
          className="input"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {activeTab === 'certifications' && (
          <>
            <select
              className="select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              className="select"
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value)}
            >
              <option value="all">All Costs</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </>
        )}
      </div>

      {activeTab === 'certifications' && renderCertifications()}
      {activeTab === 'courses' && renderCourses()}
      {activeTab === 'tools' && renderTools()}
      {activeTab === 'future' && renderFutureSkills()}
    </div>
  );
};

export default Resources;
