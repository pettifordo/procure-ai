import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <AppHeader />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
