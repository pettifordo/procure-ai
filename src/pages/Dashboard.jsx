import { useState } from 'react'
import {
  ShoppingCart,
  Building2,
  PackageCheck,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { myGoodsReceipts } from '../data/mockData'
import './Dashboard.css'

const myPOs = [
  { id: 'PO-78501', vendor: 'Microsoft', description: 'Microsoft 365 E5 Licenses', value: 156000, status: 'Active', grDue: '3 days', items: 12 },
  { id: 'PO-78510', vendor: 'AWS', description: 'Cloud Hosting - Production', value: 341400, status: 'Active', grDue: '3 days', items: 12 },
  { id: 'PO-78522', vendor: 'Accenture', description: 'SAP S/4HANA Migration', value: 710400, status: 'Active', grDue: '5 days', items: 12 },
  { id: 'PO-78530', vendor: 'Salesforce', description: 'Sales Cloud Enterprise', value: 356400, status: 'Active', grDue: '3 days', items: 12 },
  { id: 'PO-78545', vendor: 'CrowdStrike', description: 'Falcon Endpoint Protection', value: 122400, status: 'Active', grDue: '3 days', items: 12 },
  { id: 'PO-78560', vendor: 'ServiceNow', description: 'ITSM + ITOM Platform', value: 222000, status: 'Active', grDue: '3 days', items: 12 },
]

const myVendors = [
  { name: 'Microsoft', activePOs: 2, totalSpend: 169000, category: 'SaaS', grStatus: 'On Track', lastGR: 'Apr 2026' },
  { name: 'AWS', activePOs: 1, totalSpend: 28450, category: 'Cloud', grStatus: 'On Track', lastGR: 'Apr 2026' },
  { name: 'Accenture', activePOs: 1, totalSpend: 59200, category: 'Consulting', grStatus: 'Pending', lastGR: 'Apr 2026' },
  { name: 'Salesforce', activePOs: 2, totalSpend: 43450, category: 'SaaS', grStatus: 'On Track', lastGR: 'Apr 2026' },
  { name: 'CrowdStrike', activePOs: 1, totalSpend: 10200, category: 'Security', grStatus: 'On Track', lastGR: 'Apr 2026' },
  { name: 'Wipro', activePOs: 1, totalSpend: 45000, category: 'Managed Services', grStatus: 'On Track', lastGR: 'Apr 2026' },
]

const myGRSummary = myGoodsReceipts.slice(0, 6)

function Dashboard() {
  const [activeTab, setActiveTab] = useState('pos')

  const totalPOValue = myPOs.reduce((s, p) => s + p.value, 0)
  const pendingGRs = myGoodsReceipts.length
  const totalGRValue = myGoodsReceipts.reduce((s, g) => s + g.totalValue, 0)
  const activeVendors = myVendors.length

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Your procurement overview for May 2026</p>
      </div>

      <div className="dashboard-kpis">
        <div className="kpi-card">
          <div className="kpi-icon po"><ShoppingCart size={20} /></div>
          <div className="kpi-content">
            <div className="kpi-value">{myPOs.length}</div>
            <div className="kpi-label">Active POs</div>
            <div className="kpi-sub">EUR {totalPOValue.toLocaleString('en')}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon gr"><PackageCheck size={20} /></div>
          <div className="kpi-content">
            <div className="kpi-value">{pendingGRs}</div>
            <div className="kpi-label">Pending GRs</div>
            <div className="kpi-sub">EUR {totalGRValue.toLocaleString('en', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon vendor"><Building2 size={20} /></div>
          <div className="kpi-content">
            <div className="kpi-value">{activeVendors}</div>
            <div className="kpi-label">Active Vendors</div>
            <div className="kpi-sub">Across {new Set(myVendors.map(v => v.category)).size} categories</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon overdue"><AlertTriangle size={20} /></div>
          <div className="kpi-content">
            <div className="kpi-value">2</div>
            <div className="kpi-label">Overdue GRs</div>
            <div className="kpi-sub">Action needed</div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`dash-tab ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
          <ShoppingCart size={14} /> My POs
        </button>
        <button className={`dash-tab ${activeTab === 'vendors' ? 'active' : ''}`} onClick={() => setActiveTab('vendors')}>
          <Building2 size={14} /> My Vendors
        </button>
        <button className={`dash-tab ${activeTab === 'gr' ? 'active' : ''}`} onClick={() => setActiveTab('gr')}>
          <PackageCheck size={14} /> My GR
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'pos' && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Description</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>GR Due</th>
                </tr>
              </thead>
              <tbody>
                {myPOs.map(po => (
                  <tr key={po.id}>
                    <td className="dash-po-id">{po.id}</td>
                    <td>{po.vendor}</td>
                    <td className="dash-desc">{po.description}</td>
                    <td className="dash-amount">EUR {po.value.toLocaleString('en')}</td>
                    <td><span className="dash-status active">{po.status}</span></td>
                    <td className="dash-due">
                      <Clock size={12} /> {po.grDue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Active POs</th>
                  <th>Monthly Spend</th>
                  <th>GR Status</th>
                  <th>Last GR</th>
                </tr>
              </thead>
              <tbody>
                {myVendors.map(v => (
                  <tr key={v.name}>
                    <td className="dash-vendor-name">
                      <Building2 size={14} />
                      {v.name}
                    </td>
                    <td><span className="dash-category">{v.category}</span></td>
                    <td className="dash-center">{v.activePOs}</td>
                    <td className="dash-amount">EUR {v.totalSpend.toLocaleString('en')}</td>
                    <td>
                      <span className={`dash-status ${v.grStatus === 'On Track' ? 'active' : 'pending'}`}>
                        {v.grStatus}
                      </span>
                    </td>
                    <td>{v.lastGR}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'gr' && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>GR ID</th>
                  <th>PO</th>
                  <th>Vendor</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>AI Confidence</th>
                </tr>
              </thead>
              <tbody>
                {myGRSummary.map(gr => (
                  <tr key={gr.id}>
                    <td className="dash-po-id">{gr.id}</td>
                    <td>{gr.poNumber}</td>
                    <td>{gr.vendor}</td>
                    <td className="dash-desc">{gr.description}</td>
                    <td className="dash-amount">EUR {gr.totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`dash-confidence ${gr.aiConfidence >= 97 ? 'high' : 'mid'}`}>
                        {gr.aiConfidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
