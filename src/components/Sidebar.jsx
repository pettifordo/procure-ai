import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  BarChart3,
  Inbox,
  Calendar,
  FolderOpen,
  Zap,
  ChevronDown,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: Building2, label: 'Accounts', path: '/accounts' },
  { icon: FileText, label: 'Opportunities', path: '/opportunities' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Inbox, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: FolderOpen, label: 'Documents', path: '/documents' },
  { icon: Zap, label: 'Automation', path: '/automation' },
]

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={18} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-item sidebar-toggle">
          <ChevronDown size={18} className="sidebar-icon" />
          <span className="sidebar-label">More</span>
        </button>
      </div>
    </nav>
  )
}

export default Sidebar
