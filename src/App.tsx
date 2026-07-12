import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  CheckSquare,
  Brain,
  BookOpen,
  FolderOpen,
  MessageSquare,
  Briefcase,
  Bell,
} from 'lucide-react'
import Dashboard from './components/Dashboard'
import Roadmap from './components/Roadmap'
import DailyTasks from './components/DailyTasks'
import Skills from './components/Skills'
import Resources from './components/Resources'
import Projects from './components/Projects'
import Interview from './components/Interview'
import Career from './components/Career'
import Notifications from './components/Notifications'

const navItems = [
  { path: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/roadmap', label: 'Roadmap', Icon: Map },
  { path: '/tasks', label: 'Daily Tasks', Icon: CheckSquare },
  { path: '/skills', label: 'Skills', Icon: Brain },
  { path: '/resources', label: 'Resources', Icon: BookOpen },
  { path: '/projects', label: 'Projects', Icon: FolderOpen },
  { path: '/interview', label: 'Interview', Icon: MessageSquare },
  { path: '/career', label: 'Career', Icon: Briefcase },
  { path: '/notifications', label: 'Quick Wins', Icon: Bell },
]

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>DS Mastery</h1>
          <p className="subtitle">AI-Powered Learning</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                <item.Icon size={16} />
              </span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>Data Science Mastery v2.0</p>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/tasks" element={<DailyTasks />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/career" element={<Career />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
