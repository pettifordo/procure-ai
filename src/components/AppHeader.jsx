import { Search, Bell, HelpCircle, Settings, User, Bot } from 'lucide-react'
import './AppHeader.css'

function AppHeader() {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-icon"><Bot size={16} /></div>
          <span className="logo-text">ProcureAI</span>
        </div>
      </div>

      <div className="header-center">
        <div className="global-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search POs, vendors, materials..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="agent-status-pill">
          <span className="agent-pulse" />
          <span>2 Agents Active</span>
        </div>
        <button className="header-action" title="Help">
          <HelpCircle size={18} />
        </button>
        <button className="header-action" title="Notifications">
          <Bell size={18} />
          <span className="notification-badge">5</span>
        </button>
        <button className="header-action" title="Settings">
          <Settings size={18} />
        </button>
        <button className="header-avatar" title="User Profile">
          <User size={18} />
        </button>
      </div>
    </header>
  )
}

export default AppHeader
