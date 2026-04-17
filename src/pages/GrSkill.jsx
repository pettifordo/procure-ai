import {
  Sparkles,
  Search,
  Zap,
  Lightbulb,
  UserCheck,
  Send,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import './GrSkill.css'

const skills = [
  {
    id: 'find-pos',
    name: 'Find POs',
    description: 'Scan all assigned purchase orders to identify which ones require goods receipting for the current period.',
    icon: Search,
    status: 'active',
    accuracy: '99.2%',
  },
  {
    id: 'apply-rules',
    name: 'Apply GR Rules & Hints',
    description: 'Apply vendor-specific calculation rules, fixed values, usage-based formulas, and agent hints to pre-fill GR amounts.',
    icon: Lightbulb,
    status: 'active',
    accuracy: '96.8%',
  },
  {
    id: 'anomaly-detect',
    name: 'Check Anomalies',
    description: 'Detect unusual amounts, duplicate entries, and spending anomalies against historical patterns and thresholds.',
    icon: Shield,
    status: 'active',
    accuracy: '96.5%',
  },
  {
    id: 'hitl-approval',
    name: 'HITL - Approval / Adjustment',
    description: 'Present GR items to the user for human-in-the-loop review. Allow amount adjustments, item deselection, and final approval.',
    icon: UserCheck,
    status: 'active',
    accuracy: '100%',
  },
  {
    id: 'post-gr',
    name: 'Post GR',
    description: 'Post approved goods receipts to SAP, update GL accounts, and generate GR document numbers.',
    icon: Zap,
    status: 'active',
    accuracy: '100%',
  },
  {
    id: 'inform-vendor',
    name: 'Inform Vendor',
    description: 'Send automated confirmation emails to vendors after GR posting with document references and payment details.',
    icon: Send,
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
          <div className="flow-step"><Search size={14} /> Find POs</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Lightbulb size={14} /> Apply GR Rules & Hints</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Shield size={14} /> Check Anomalies</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step hitl"><UserCheck size={14} /> HITL - Approval / Adjustment</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Zap size={14} /> Post GR</div>
          <ArrowRight size={14} className="flow-arrow" />
          <div className="flow-step"><Send size={14} /> Inform Vendor</div>
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
