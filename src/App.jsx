import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import Sidebar from './components/Sidebar'
import AgentChat from './pages/AgentChat'
import GoodsReceipts from './pages/GoodsReceipts'
import PurchaseReqs from './pages/PurchaseReqs'
import Dashboard from './pages/Dashboard'
import Vendors from './pages/Vendors'
import SettingsPage from './pages/SettingsPage'
import GrSkill from './pages/GrSkill'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <AppHeader />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<AgentChat />} />
            <Route path="/goods-receipts" element={<GoodsReceipts />} />
            <Route path="/purchase-reqs" element={<PurchaseReqs />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/gr-skill" element={<GrSkill />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
