import { useState, useEffect, useRef } from 'react'
import {
  Bot,
  Send,
  User,
  ClipboardList,
  Monitor,
  FilePlus,
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users as UsersIcon,
  Cpu,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import './PurchaseReqs.css'

const prPrompts = [
  { id: 'software-sub', text: 'Create a new Software Subscription', icon: Monitor, description: 'Set up recurring SaaS/license agreement' },
  { id: 'it-services', text: 'Create an IT Services contract', icon: ClipboardList, description: 'Professional services, consulting' },
  { id: 'extend-po', text: 'Extend an existing PO with additional costs', icon: FilePlus, description: 'Add scope or budget to existing PO' },
  { id: 'renew-contract', text: 'Renew an expiring contract', icon: Calendar, description: 'Extend terms on current agreements' },
]

const QUOTE_DATA = {
  vendor: 'SAP SE',
  product: 'SAP Business Technology Platform — Process Automation',
  edition: 'Enterprise',
  contractTerm: '3 Years (36 months)',
  startDate: '1 July 2026',
  endDate: '30 June 2029',
  instances: '30 Process Instances',
  users: 'Unlimited Named Users',
  billing: 'Monthly in Advance',
  monthlyPrice: 10000.00,
  totalValue: 360000.00,
  quoteRef: 'SAP-Q-2026-08841',
  paymentTerms: 'Net 30',
  supportLevel: '24/7 Enterprise Support included',
}

function generateSchedule() {
  const months = []
  const start = new Date(2026, 6, 1) // July 2026
  for (let i = 0; i < 36; i++) {
    const d = new Date(start)
    d.setMonth(d.getMonth() + i)
    months.push({
      month: d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      amount: 10000.00,
      type: i === 0 ? 'First payment' : 'Recurring',
    })
  }
  return months
}

const THINKING_DELAY = 1500

function PurchaseReqs() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const [flowStage, setFlowStage] = useState('idle') // idle, ask_quote, extracting, show_quote, creating_pr, show_pr, approval_started
  const [showSchedule, setShowSchedule] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  useEffect(() => { scrollToBottom() }, [messages, flowStage, showSchedule])

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
  }

  const typeAndAdd = async (content, delay = THINKING_DELAY) => {
    setIsTyping(true)
    await new Promise(r => setTimeout(r, delay))
    setIsTyping(false)
    addMessage('agent', content)
  }

  const handlePromptClick = async (prompt) => {
    setShowPrompts(false)
    addMessage('user', prompt.text)

    if (prompt.id === 'software-sub') {
      await runSubscriptionFlow()
    } else {
      await typeAndAdd("I can help with that! For this demo, try **\"Create a new Software Subscription\"** to see the full flow.")
      setShowPrompts(true)
    }
  }

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue('')

    addMessage('user', text)

    if (flowStage === 'ask_quote') {
      await runQuoteExtraction(text)
    } else {
      const lower = text.toLowerCase()
      if (lower.includes('software') || lower.includes('subscription') || lower.includes('saas')) {
        setShowPrompts(false)
        await runSubscriptionFlow()
      } else {
        await typeAndAdd("Try clicking **\"Create a new Software Subscription\"** to see the full PR creation flow with quote extraction.")
        setShowPrompts(true)
      }
    }
  }

  const runSubscriptionFlow = async () => {
    await typeAndAdd("I'll help you set up a new software subscription. First, I need the vendor quote.\n\nPlease share the quote — you can paste a file path, a SharePoint link, or drag and drop the document.")
    setFlowStage('ask_quote')
  }

  const runQuoteExtraction = async (userInput) => {
    setFlowStage('extracting')
    await typeAndAdd("Got it. Let me analyze the quote document...", 1000)

    setIsTyping(true)
    await new Promise(r => setTimeout(r, 2500))
    setIsTyping(false)

    addMessage('agent', "I've extracted the following details from the quote:")
    setFlowStage('show_quote')
  }

  const handleConfirmQuote = async () => {
    setFlowStage('creating_pr')
    addMessage('user', 'Yes, that looks correct. Create the PR.')

    await typeAndAdd("Creating Purchase Requisition with monthly billing schedule...", 1200)

    setIsTyping(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsTyping(false)

    addMessage('agent',
      "**PR-2026-0350** has been created successfully.\n\n" +
      "I've set up the following:\n" +
      "- 36 monthly goods receipt schedule lines (Jul 2026 — Jun 2029)\n" +
      "- Each line: EUR 10,000.00 billed in advance on the 1st\n" +
      "- GL Account: 6520 — Software Subscriptions\n" +
      "- Cost Center: CC-4200 Digital Transformation"
    )

    setFlowStage('show_pr')

    await new Promise(r => setTimeout(r, 1500))

    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1800))
    setIsTyping(false)

    addMessage('agent',
      "**Approval required.** The total contract value of **EUR 360,000.00** exceeds the EUR 50,000 auto-approval threshold.\n\n" +
      "Per procurement policy, this requires **CIO approval**. I've identified **Sarah Chen (CIO)** as the designated approver.\n\n" +
      "Shall I start the approval workflow?"
    )
    setFlowStage('approval_prompt')
  }

  const handleStartApproval = async () => {
    addMessage('user', 'Yes, start the approval workflow.')
    setFlowStage('approval_starting')

    await typeAndAdd("Starting approval workflow...", 1000)

    setIsTyping(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsTyping(false)

    setFlowStage('approval_started')
  }

  const schedule = generateSchedule()

  return (
    <div className="pr-chat">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon pr-welcome-icon"><ClipboardList size={32} /></div>
            <h1>Purchase Requisition Agent</h1>
            <p>I can create purchase requisitions, extract details from vendor quotes, set up billing schedules, and route approvals automatically.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="message-bubble">
              <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
              <div className="message-time">{msg.time}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message agent">
            <div className="message-avatar"><Bot size={16} /></div>
            <div className="message-bubble">
              <div className="typing-indicator"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {/* Quote Card */}
        {flowStage === 'show_quote' && (
          <div className="quote-card">
            <div className="quote-card-header">
              <FileText size={16} />
              <span>Extracted Quote Details</span>
              <span className="quote-ref">{QUOTE_DATA.quoteRef}</span>
            </div>
            <div className="quote-card-body">
              <div className="quote-grid">
                <div className="quote-field">
                  <Building2 size={14} />
                  <div>
                    <label>Vendor</label>
                    <span>{QUOTE_DATA.vendor}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <Cpu size={14} />
                  <div>
                    <label>Product</label>
                    <span>{QUOTE_DATA.product}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <Calendar size={14} />
                  <div>
                    <label>Contract Term</label>
                    <span>{QUOTE_DATA.contractTerm}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <Calendar size={14} />
                  <div>
                    <label>Period</label>
                    <span>{QUOTE_DATA.startDate} — {QUOTE_DATA.endDate}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <Sparkles size={14} />
                  <div>
                    <label>Instances</label>
                    <span>{QUOTE_DATA.instances}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <UsersIcon size={14} />
                  <div>
                    <label>Users</label>
                    <span>{QUOTE_DATA.users}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <DollarSign size={14} />
                  <div>
                    <label>Monthly Price</label>
                    <span>EUR {QUOTE_DATA.monthlyPrice.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="quote-field">
                  <DollarSign size={14} />
                  <div>
                    <label>Total Contract Value</label>
                    <span className="quote-total">EUR {QUOTE_DATA.totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              <div className="quote-extras">
                <span>Billing: {QUOTE_DATA.billing}</span>
                <span>Payment: {QUOTE_DATA.paymentTerms}</span>
                <span>{QUOTE_DATA.supportLevel}</span>
              </div>
            </div>
            <div className="quote-card-footer">
              <span className="quote-ai-badge"><Sparkles size={12} /> AI-extracted with 98% confidence</span>
              <button className="btn btn-primary btn-lg" onClick={handleConfirmQuote}>
                <CheckCircle2 size={16} /> Looks correct — Create PR
              </button>
            </div>
          </div>
        )}

        {/* PR Schedule */}
        {(flowStage === 'show_pr' || flowStage === 'approval_prompt' || flowStage === 'approval_starting' || flowStage === 'approval_started') && (
          <div className="schedule-card">
            <div className="schedule-header" onClick={() => setShowSchedule(!showSchedule)}>
              <div className="schedule-header-left">
                <Calendar size={16} />
                <span>Goods Receipt / Billing Schedule (36 months)</span>
              </div>
              <button className="btn btn-text">{showSchedule ? 'Hide' : 'Show'} Schedule</button>
            </div>
            {showSchedule && (
              <div className="schedule-body">
                <div className="schedule-table-wrap">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Month</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row, i) => (
                        <tr key={i}>
                          <td className="schedule-num">{i + 1}</td>
                          <td>{row.month}</td>
                          <td className="schedule-amount">EUR {row.amount.toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                          <td><span className="schedule-status">Planned</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="schedule-total">
                  <span>Total (36 months)</span>
                  <span>EUR {QUOTE_DATA.totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Approval Prompt Button */}
        {flowStage === 'approval_prompt' && (
          <div className="approval-prompt-card">
            <button className="btn btn-primary btn-lg" onClick={handleStartApproval}>
              <ArrowRight size={16} /> Start CIO Approval Workflow
            </button>
          </div>
        )}

        {/* Approval Started */}
        {flowStage === 'approval_started' && (
          <div className="approval-card">
            <div className="approval-card-header">
              <ShieldCheck size={18} />
              <span>Approval Workflow Active</span>
            </div>
            <div className="approval-card-body">
              <div className="approval-timeline">
                <div className="approval-step done">
                  <CheckCircle2 size={16} />
                  <div>
                    <div className="approval-step-title">PR Created</div>
                    <div className="approval-step-meta">PR-2026-0350 — just now</div>
                  </div>
                </div>
                <div className="approval-step done">
                  <CheckCircle2 size={16} />
                  <div>
                    <div className="approval-step-title">Budget Validation</div>
                    <div className="approval-step-meta">CC-4200 has sufficient budget — verified</div>
                  </div>
                </div>
                <div className="approval-step done">
                  <CheckCircle2 size={16} />
                  <div>
                    <div className="approval-step-title">Compliance Check</div>
                    <div className="approval-step-meta">Vendor on approved supplier list — passed</div>
                  </div>
                </div>
                <div className="approval-step active">
                  <Loader2 size={16} className="spin" />
                  <div>
                    <div className="approval-step-title">CIO Approval — Sarah Chen</div>
                    <div className="approval-step-meta">Email and Teams notification sent. Awaiting response.</div>
                  </div>
                </div>
                <div className="approval-step pending">
                  <span className="step-dot-empty" />
                  <div>
                    <div className="approval-step-title">PO Creation</div>
                    <div className="approval-step-meta">Will auto-create once approved</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="approval-card-footer">
              <Bot size={14} />
              <span>I'll notify you as soon as Sarah approves. The PO will be created automatically and the first GR line (Jul 2026) will be ready for processing.</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        {showPrompts && (
          <div className="prompt-suggestions">
            {prPrompts.map((prompt) => (
              <button key={prompt.id} className="prompt-chip" onClick={() => handlePromptClick(prompt)}>
                <prompt.icon size={14} className="prompt-chip-icon" />
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>
        )}

        {flowStage === 'ask_quote' && (
          <div className="upload-hint">
            <Upload size={14} />
            <span>Paste a file path, SharePoint link, or type the quote location</span>
          </div>
        )}

        <div className="chat-input-row">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={flowStage === 'ask_quote' ? 'e.g. /Documents/Quotes/SAP_BTP_Quote_2026.pdf' : 'Ask the PR agent...'}
            className="chat-input"
            disabled={isTyping || flowStage === 'creating_pr' || flowStage === 'approval_starting'}
          />
          <button className="chat-send" onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n/g, '<br/>')
}

export default PurchaseReqs
