import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import './Dashboard.css'

const kpis = [
  {
    title: 'Total Revenue',
    value: '$2,847,290',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Active Accounts',
    value: '1,284',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Open Opportunities',
    value: '342',
    change: '-3.1%',
    trend: 'down',
    icon: TrendingUp,
  },
  {
    title: 'Tasks Completed',
    value: '89%',
    change: '+5.4%',
    trend: 'up',
    icon: CheckCircle2,
  },
]

const recentActivity = [
  { type: 'Opportunity', name: 'Acme Corp - Enterprise License', status: 'Negotiation', amount: '$125,000', date: 'Today' },
  { type: 'Contact', name: 'Jane Smith added to Global Tech', status: 'New Lead', amount: '', date: 'Today' },
  { type: 'Task', name: 'Follow up with Initech proposal', status: 'Due Soon', amount: '', date: 'Tomorrow' },
  { type: 'Account', name: 'Globex Industries - Annual Review', status: 'Scheduled', amount: '$340,000', date: 'Apr 18' },
  { type: 'Opportunity', name: 'Umbrella Corp - Platform Migration', status: 'Qualification', amount: '$89,500', date: 'Apr 20' },
]

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-actions">
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">New Record</button>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <div className="kpi-icon-wrap">
                <kpi.icon size={18} />
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change ${kpi.trend}`}>
              {kpi.trend === 'up' ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              <span>{kpi.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card activity-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <button className="btn btn-text">View All</button>
          </div>
          <div className="card-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`badge badge-${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="name-cell">{item.name}</td>
                    <td>
                      <span className={`status status-${item.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="amount-cell">{item.amount || '--'}</td>
                    <td className="date-cell">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card tasks-card">
          <div className="card-header">
            <h2 className="card-title">My Tasks</h2>
            <button className="btn btn-text">View All</button>
          </div>
          <div className="card-body">
            <div className="task-list">
              <div className="task-item">
                <input type="checkbox" className="task-checkbox" />
                <div className="task-content">
                  <div className="task-name">Review Q2 pipeline forecast</div>
                  <div className="task-meta">Due today</div>
                </div>
              </div>
              <div className="task-item">
                <input type="checkbox" className="task-checkbox" />
                <div className="task-content">
                  <div className="task-name">Prepare demo for Acme Corp</div>
                  <div className="task-meta">Due tomorrow</div>
                </div>
              </div>
              <div className="task-item">
                <input type="checkbox" className="task-checkbox" />
                <div className="task-content">
                  <div className="task-name">Update contact records</div>
                  <div className="task-meta">Due Apr 18</div>
                </div>
              </div>
              <div className="task-item">
                <input type="checkbox" className="task-checkbox" defaultChecked />
                <div className="task-content completed">
                  <div className="task-name">Send proposal to Global Tech</div>
                  <div className="task-meta">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
