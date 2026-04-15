import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PackageCheck,
  ClipboardList,
  Bot,
  BarChart3,
  Building2,
  Settings,
  ChevronDown,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { icon: Bot, label: 'Agent Chat', path: '/' },
  { icon: PackageCheck, label: 'Goods Receipts', path: '/goods-receipts', badge: '12' },
  { icon: ClipboardList, label: 'Purchase Requisitions', path: '/purchase-reqs' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Building2, label: 'Vendors', path: '/vendors' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">PROCUREMENT</div>
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
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
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
