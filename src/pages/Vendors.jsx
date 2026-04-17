import { useState } from 'react'
import {
  Building2,
  Sparkles,
  Calculator,
  Calendar,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Repeat,
  Hash,
} from 'lucide-react'
import './Vendors.css'

const vendors = [
  {
    id: 1,
    name: 'Microsoft',
    category: 'SaaS Subscription',
    activePOs: 2,
    monthlySpend: 13000,
    contractType: 'Annual (Monthly Billing)',
    grHints: {
      method: 'Fixed Value',
      fixedValue: 13000,
      schedule: '1st of each month',
      notes: 'Fixed license count (250 seats x EUR 52). Only changes when HR headcount changes. Check Azure AD sync for seat count.',
      agentHints: [
        'Compare seat count against Azure AD active users before posting',
        'Flag if variance > 5% from last month',
        'Auto-approve if amount matches contract exactly',
      ],
    },
  },
  {
    id: 2,
    name: 'AWS',
    category: 'Cloud Services',
    activePOs: 1,
    monthlySpend: 28450,
    contractType: 'Pay-as-you-go',
    grHints: {
      method: 'Variable (Usage-Based)',
      fixedValue: null,
      schedule: '5th business day after month-end',
      notes: 'Usage-based billing. Expect 5-15% variance month-to-month. Auto-scaling events may cause spikes. Cross-reference with CloudWatch metrics.',
      agentHints: [
        'Pull usage data from AWS Cost Explorer API',
        'Flag if > 20% increase from prior month average',
        'Check for any auto-scaling events in the billing period',
        'Verify reserved instance coverage is applied correctly',
      ],
    },
  },
  {
    id: 3,
    name: 'Accenture',
    category: 'Professional Services',
    activePOs: 1,
    monthlySpend: 59200,
    contractType: 'T&M (Time & Materials)',
    grHints: {
      method: 'Timesheet-Based',
      fixedValue: null,
      schedule: 'Sprint end + 5 business days',
      notes: 'GR amount = approved hours x rate card (EUR 185/hr). Verify timesheets in project tracker. Sprint velocity should match planned hours.',
      agentHints: [
        'Cross-reference submitted timesheets with Jira sprint data',
        'Verify hours do not exceed sprint plan by more than 10%',
        'Check deliverable acceptance before approving timesheet hours',
        'Confirm rate matches current SOW rate card',
      ],
    },
  },
  {
    id: 4,
    name: 'Salesforce',
    category: 'SaaS Subscription',
    activePOs: 2,
    monthlySpend: 29700,
    contractType: 'Annual (Monthly Billing)',
    grHints: {
      method: 'Fixed Value',
      fixedValue: 29700,
      schedule: '1st of each month',
      notes: 'Fixed license count (180 seats x EUR 165). Annual contract renews Oct 2026. License count synced with Sales dept headcount.',
      agentHints: [
        'Verify seat count against Sales department HR records',
        'Flag any license additions/removals during the month',
        'Auto-approve if amount matches contract schedule',
      ],
    },
  },
  {
    id: 5,
    name: 'CrowdStrike',
    category: 'Security Services',
    activePOs: 1,
    monthlySpend: 10200,
    contractType: 'Annual (Monthly Billing)',
    grHints: {
      method: 'Fixed Value',
      fixedValue: 10200,
      schedule: '1st of each month',
      notes: 'Fixed endpoint count (1,200 x EUR 8.50). Endpoint count verified against CMDB. Contract renewal Feb 2027.',
      agentHints: [
        'Cross-reference endpoint count with CMDB records',
        'Auto-approve if amount = 1200 x EUR 8.50',
        'Alert if CMDB endpoint count diverges from contract',
      ],
    },
  },
  {
    id: 6,
    name: 'Wipro',
    category: 'Managed Services',
    activePOs: 1,
    monthlySpend: 45000,
    contractType: 'Fixed Monthly Retainer',
    grHints: {
      method: 'Fixed Value',
      fixedValue: 45000,
      schedule: '1st of each month',
      notes: 'Fixed monthly retainer of EUR 45,000. Includes L2 support. SLA report required before GR approval. KPIs: uptime > 99.5%, tickets resolved within SLA.',
      agentHints: [
        'Verify SLA report is received before approving GR',
        'Check uptime KPI meets 99.5% threshold',
        'Auto-approve if SLA met and amount matches retainer',
        'Escalate if SLA report is overdue by > 3 business days',
      ],
    },
  },
]

const methodIcons = {
  'Fixed Value': DollarSign,
  'Variable (Usage-Based)': TrendingUp,
  'Timesheet-Based': Clock,
}

function Vendors() {
  const [expandedVendor, setExpandedVendor] = useState(null)

  const toggleVendor = (id) => {
    setExpandedVendor(prev => prev === id ? null : id)
  }

  return (
    <div className="vendors-page">
      <div className="vendors-header">
        <h1>Vendors</h1>
        <p className="vendors-subtitle">Vendor management with GR calculation hints and agent configuration</p>
      </div>

      <div className="vendors-list">
        {vendors.map(vendor => {
          const isExpanded = expandedVendor === vendor.id
          const MethodIcon = methodIcons[vendor.grHints.method] || Calculator
          return (
            <div key={vendor.id} className={`vendor-card ${isExpanded ? 'expanded' : ''}`}>
              <div className="vendor-card-header" onClick={() => toggleVendor(vendor.id)}>
                <div className="vendor-info">
                  <div className="vendor-icon-wrap">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="vendor-name">{vendor.name}</div>
                    <div className="vendor-meta">
                      {vendor.category} &middot; {vendor.activePOs} active PO{vendor.activePOs > 1 ? 's' : ''} &middot; {vendor.contractType}
                    </div>
                  </div>
                </div>
                <div className="vendor-header-right">
                  <div className="vendor-spend">
                    EUR {vendor.monthlySpend.toLocaleString('en')} / mo
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="vendor-detail">
                  <div className="vendor-hint-grid">
                    <div className="hint-card">
                      <div className="hint-card-header">
                        <MethodIcon size={16} />
                        <span>GR Calculation Method</span>
                      </div>
                      <div className="hint-method">{vendor.grHints.method}</div>
                      {vendor.grHints.fixedValue && (
                        <div className="hint-fixed">
                          Fixed amount: <strong>EUR {vendor.grHints.fixedValue.toLocaleString('en')}</strong>
                        </div>
                      )}
                    </div>

                    <div className="hint-card">
                      <div className="hint-card-header">
                        <Calendar size={16} />
                        <span>GR Schedule</span>
                      </div>
                      <div className="hint-schedule">{vendor.grHints.schedule}</div>
                    </div>

                    <div className="hint-card full-width">
                      <div className="hint-card-header">
                        <Calculator size={16} />
                        <span>Calculation Notes</span>
                      </div>
                      <div className="hint-notes">{vendor.grHints.notes}</div>
                    </div>

                    <div className="hint-card full-width agent-hints-card">
                      <div className="hint-card-header">
                        <Sparkles size={16} />
                        <span>Agent Hints</span>
                      </div>
                      <div className="agent-hints-list">
                        {vendor.grHints.agentHints.map((hint, i) => (
                          <div key={i} className="agent-hint-item">
                            <Lightbulb size={13} />
                            <span>{hint}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Vendors
