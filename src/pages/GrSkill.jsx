import {
  Sparkles,
  Bot,
  Zap,
  Target,
  Database,
  FileCheck,
  RefreshCw,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import './GrSkill.css'

const skills = [
  {
    id: 'invoice-match',
    name: 'Invoice Matching',
    description: 'Automatically match incoming invoices to purchase orders and validate amounts, quantities, and terms.',
    icon: FileCheck,
    status: 'active',
    accuracy: '99.2%',
  },
  {
    id: 'usage-analysis',
    name: 'Usage Analysis',
    description: 'Analyze cloud and SaaS usage data to predict GR amounts for variable-cost services.',
    icon: Database,
    status: 'active',
    accuracy: '94.8%',
  },
  {
    id: 'timesheet-verify',
    name: 'Timesheet Verification',
    description: 'Cross-reference vendor timesheets with project management tools (Jira, Azure DevOps) to verify hours.',
    icon: Target,
    status: 'active',
    accuracy: '97.1%',
  },
  {
    id: 'anomaly-detect',
    name: 'Anomaly Detection',
    description: 'Detect unusual amounts, duplicate entries, and spending anomalies against historical patterns.',
    icon: Shield,
    status: 'active',
    accuracy: '96.5%',
  },
  {
    id: 'auto-post',
    name: 'Auto-Post GR',
    description: 'Automatically post goods receipts for items that meet confidence thresholds and approval rules.',
    icon: Zap,
    status: 'active',
    accuracy: '100%',
  },
  {
    id: 'vendor-confirm',
    name: 'Vendor Confirmation',
    description: 'Send automated confirmation emails to vendors after GR posting with document references.',
    icon: RefreshCw,
    status: 'active',
    accuracy: '100%',
  },
]

function GrSkill() {
  return (
    <div className="grskill-page">
      <div className="grskill-header">
        <div className="grskill-header-icon">
          <Sparkles size={24} />
        </div>
        <div>
          <h1>GR Skill</h1>
          <p className="grskill-subtitle">AI-powered skills used by the GR Agent to automate goods receipt processing</p>
        </div>
      </div>

      <div className="grskill-flow">
        <div className="flow-label">GR Agent Workflow</div>
        <div className="flow-steps">
          <div className="flow-step"><Bot size={14} /> Receive PO Data</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><FileCheck size={14} /> Match Invoices</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Target size={14} /> Verify Sources</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Shield size={14} /> Check Anomalies</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Zap size={14} /> Post GR</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><RefreshCw size={14} /> Confirm</div>
        </div>
      </div>

      <div className="grskill-grid">
        {skills.map(skill => {
          const Icon = skill.icon
          return (
            <div key={skill.id} className="skill-card">
              <div className="skill-card-top">
                <div className="skill-icon-wrap">
                  <Icon size={20} />
                </div>
                <div className="skill-status-badge">
                  <CheckCircle2 size={12} />
                  {skill.status}
                </div>
              </div>
              <div className="skill-name">{skill.name}</div>
              <div className="skill-desc">{skill.description}</div>
              <div className="skill-accuracy">
                <Sparkles size={12} />
                <span>Accuracy: <strong>{skill.accuracy}</strong></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GrSkill
