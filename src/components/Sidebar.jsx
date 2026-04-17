import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PackageCheck,
  ClipboardList,
  Bot,
  Building2,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  {
    icon: Bot,
    label: 'GR Agent',
    path: '/',
    children: [
      { icon: PackageCheck, label: 'Good Receipt', path: '/goods-receipts', badge: '12' },
      { icon: Sparkles, label: 'GR Skill', path: '/gr-skill' },
    ],
  },
  { icon: ClipboardList, label: 'PR Agent', path: '/purchase-reqs' },
  { icon: Building2, label: 'Vendors', path: '/vendors' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

function Sidebar() {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({ '/': true })

  const toggleMenu = (path) => {
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }))
  }

  const isChildActive = (item) => {
    if (!item.children) return false
    return item.children.some(child => location.pathname === child.path)
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">PROCUREMENT</div>
      <div className="sidebar-nav">
        {navItems.map((item) => {
          if (item.children) {
            const expanded = expandedMenus[item.path]
            const childActive = isChildActive(item)
            const parentActive = location.pathname === item.path || childActive
            return (
              <div key={item.path} className="sidebar-menu-group">
                <div className="sidebar-parent-row">
                  <NavLink
                    to={item.path}
                    className={`sidebar-item ${parentActive ? 'active' : ''}`}
                  >
                    <item.icon size={18} className="sidebar-icon" />
                    <span className="sidebar-label">{item.label}</span>
                  </NavLink>
                  <button
                    className={`sidebar-expand-btn ${expanded ? 'expanded' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggleMenu(item.path) }}
                  >
                    {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
                {expanded && (
                  <div className="sidebar-submenu">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `sidebar-item sidebar-subitem ${isActive ? 'active' : ''}`
                        }
                      >
                        <child.icon size={14} className="sidebar-icon" />
                        <span className="sidebar-label">{child.label}</span>
                        {child.badge && <span className="sidebar-badge">{child.badge}</span>}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={18} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          )
        })}
      </div>

      <div className="sidebar-agent-box">
        <div className="agent-box-header">
          <Bot size={14} />
          <span>Agent Status</span>
        </div>
        <div className="agent-box-item">
          <span className="agent-dot online" />
          <span>GR Agent</span>
          <span className="agent-box-status">Running</span>
        </div>
        <div className="agent-box-item">
          <span className="agent-dot online" />
          <span>PR Agent</span>
          <span className="agent-box-status">Running</span>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
