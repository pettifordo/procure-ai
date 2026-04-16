import { useState, useEffect, useRef } from 'react'
import {
  Bot,
  Send,
  PackageCheck,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Edit3,
  X,
  Inbox,
  Building2,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  Calendar,
  Sparkles,
  User,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { myGoodsReceipts, suggestedPrompts, grHistory } from '../data/mockData'
import './AgentChat.css'

const ICON_MAP = {
  inbox: Inbox,
  building: Building2,
  alert: AlertTriangle,
  clipboard: ClipboardList,
  chart: BarChart3,
  calendar: Calendar,
}

const TYPING_DELAY = 40
const THINKING_DELAY = 1500

function AgentChat() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [grItems, setGrItems] = useState([])
  const [showGrList, setShowGrList] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [showPrompts, setShowPrompts] = useState(true)
  const [expandedHistory, setExpandedHistory] = useState(null)
  const [completedItems, setCompletedItems] = useState([])
  const [showBreakdown, setShowBreakdown] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, showGrList, processing, completed])

  const addMessage = (role, content, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setMessages(prev => [...prev, { role, content, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }])
        resolve()
      }, delay)
    })
  }

  const typeMessage = async (content) => {
    setIsTyping(true)
    await new Promise(r => setTimeout(r, THINKING_DELAY))
    setIsTyping(false)
    await addMessage('agent', content)
  }

  const handlePromptClick = async (prompt) => {
    setShowPrompts(false)
    await addMessage('user', prompt.text)

    if (prompt.id === 'gr-mine') {
      await runGrFlow()
    } else {
      await typeMessage("I can help with that! For this demo, try clicking **\"What POs do I need to goods receipt this month?\"** to see the full flow in action.")
      setShowPrompts(true)
    }
  }

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text) return
    setInputValue('')
    setShowPrompts(false)
    await addMessage('user', text)

    const lower = text.toLowerCase()
    if (lower.includes('goods receipt') || lower.includes('gr') || lower.includes('po') || lower.includes('receipt')) {
      await runGrFlow()
    } else {
      await typeMessage("I can help with that! Try asking me about goods receipts, POs, or click one of the suggested prompts.")
      setShowPrompts(true)
    }
  }

  const runGrFlow = async () => {
    await typeMessage("Let me check your assigned purchase orders...")

    setIsTyping(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsTyping(false)

    const items = myGoodsReceipts.map(i => ({ ...i, selected: true }))
    setGrItems(items)

    const totalValue = items.reduce((s, i) => s + i.totalValue, 0)
    await addMessage('agent',
      `I found **${items.length} purchase orders** assigned to you that need goods receipting for May 2026.\n\n` +
      `**Total value: EUR ${totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}**\n\n` +
      `I've pre-filled the GR amounts based on the PO terms, invoices, and usage data. ` +
      `Everything looks good — all items have high confidence scores. You can review the details below, edit any amounts, or just hit approve.`
    )

    setShowGrList(true)
  }

  const processSteps = [
    'Validating PO line items...',
    'Cross-referencing invoices...',
    'Posting goods receipt documents...',
    'Updating GL accounts...',
    'Sending vendor confirmations...',
    'Done!',
  ]

  useEffect(() => {
    if (processing && processStep < processSteps.length - 1) {
      const timer = setTimeout(() => setProcessStep(s => s + 1), 700)
      return () => clearTimeout(timer)
    }
    if (processing && processStep === processSteps.length - 1) {
      const timer = setTimeout(() => {
        setProcessing(false)
        setCompleted(true)
        setShowGrList(false)
        const selected = grItems.filter(i => i.selected)
        setCompletedItems(selected)
        const totalValue = selected.reduce((s, i) => s + i.totalValue, 0)
        addMessage('agent',
          `All done! I've successfully posted **${selected.length} goods receipts** totalling **EUR ${totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}**.\n\n` +
          `Here's what happened:\n` +
          `- ${selected.length} GR documents created in SAP\n` +
          `- GL postings completed across ${new Set(selected.map(i => i.glAccount)).size} accounts\n` +
          `- Vendor confirmation emails sent to ${new Set(selected.map(i => i.vendor)).size} suppliers\n` +
          `- All items cleared from your pending queue\n\n` +
          `Is there anything else you'd like me to help with?`
        )
        setShowPrompts(true)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [processing, processStep])

  const handleApproveAll = () => {
    setProcessing(true)
    setProcessStep(0)
  }

  const toggleItem = (id) => {
    setGrItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i))
  }

  const startEdit = (id, val) => {
    setEditingId(id)
    setEditValue(val.toString())
  }

  const saveEdit = (id) => {
    const num = parseFloat(editValue)
    if (num > 0) {
      setGrItems(prev => prev.map(i => i.id === id ? { ...i, totalValue: num } : i))
    }
    setEditingId(null)
  }

  const toggleHistory = (id) => {
    setExpandedHistory(prev => prev === id ? null : id)
    setTimeout(scrollToBottom, 100)
  }

  const getTrend = (itemId, currentAmount) => {
    const history = grHistory[itemId]
    if (!history || history.length === 0) return null
    const lastAmount = history[0].amount
    const diff = currentAmount - lastAmount
    const pct = ((diff / lastAmount) * 100).toFixed(1)
    if (Math.abs(diff) < 1) return { direction: 'flat', pct: '0.0', diff: 0 }
    return { direction: diff > 0 ? 'up' : 'down', pct: Math.abs(pct), diff }
  }

  const selectedItems = grItems.filter(i => i.selected)
  const selectedTotal = selectedItems.reduce((s, i) => s + i.totalValue, 0)

  return (
    <div className="agent-chat">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon"><Bot size={32} /></div>
            <h1>ProcureAI Agent</h1>
            <p>I can help you manage goods receipts, purchase requisitions, and procurement tasks. What would you like to do?</p>
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
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {showGrList && !processing && !completed && (
          <div className="gr-inline-list">
            <div className="gr-inline-header">
              <div className="gr-inline-header-left">
                <PackageCheck size={16} />
                <span>{selectedItems.length} of {grItems.length} items selected</span>
              </div>
              <div className="gr-inline-total">
                EUR {selectedTotal.toLocaleString('en', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="gr-inline-items">
              {grItems.map((item) => {
                const trend = getTrend(item.id, item.totalValue)
                const history = grHistory[item.id] || []
                const isExpanded = expandedHistory === item.id
                return (
                  <div key={item.id} className={`gr-inline-item-wrap ${!item.selected ? 'deselected' : ''}`}>
                    <div className="gr-inline-item">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleItem(item.id)}
                        className="gr-check"
                      />
                      <div className="gr-inline-info">
                        <div className="gr-inline-desc">{item.description}</div>
                        <div className="gr-inline-meta">
                          {item.vendor} &middot; {item.poNumber} &middot; {item.category}
                          {history.length > 0 && (
                            <button className="gr-history-link" onClick={() => toggleHistory(item.id)}>
                              <History size={10} />
                              GR History
                              {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="gr-inline-amount">
                        {editingId === item.id ? (
                          <div className="amt-edit" onClick={e => e.stopPropagation()}>
                            <span className="amt-prefix">EUR</span>
                            <input
                              type="number"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="amt-input"
                              autoFocus
                              onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                            />
                            <button className="amt-save" onClick={() => saveEdit(item.id)}>
                              <CheckCircle2 size={14} />
                            </button>
                            <button className="amt-cancel" onClick={() => setEditingId(null)}>
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <span className="amt-display" onClick={() => startEdit(item.id, item.totalValue)}>
                            EUR {item.totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}
                            <Edit3 size={11} className="amt-edit-icon" />
                          </span>
                        )}
                        {trend && !editingId && (
                          <div className={`amt-trend ${trend.direction}`}>
                            {trend.direction === 'up' && <TrendingUp size={10} />}
                            {trend.direction === 'down' && <TrendingDown size={10} />}
                            {trend.direction === 'flat' && <Minus size={10} />}
                            <span>{trend.direction === 'flat' ? 'No change' : `${trend.pct}% vs last month`}</span>
                          </div>
                        )}
                      </div>
                      <div className="gr-inline-confidence" title={item.aiNote}>
                        <Sparkles size={12} />
                        <span>{item.aiConfidence}%</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="gr-history-panel">
                        <div className="gr-history-title">
                          <History size={12} />
                          Last {history.length} months — {item.vendor}
                        </div>
                        <table className="gr-history-table">
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>GR #</th>
                              <th>Amount</th>
                              <th>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history.map((h, hi) => (
                              <tr key={hi}>
                                <td>{h.month}</td>
                                <td className="gr-hist-num">{h.grNumber}</td>
                                <td className="gr-hist-amt">EUR {h.amount.toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                                <td className="gr-hist-note">{h.note || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="gr-history-avg">
                          Avg: EUR {(history.reduce((s, h) => s + h.amount, 0) / history.length).toLocaleString('en', { minimumFractionDigits: 2 })}
                          {' '}/ month
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="gr-inline-footer">
              <button className="btn btn-success btn-lg gr-approve-btn" onClick={handleApproveAll}>
                <CheckCircle2 size={18} />
                Approve & Post All ({selectedItems.length} items — EUR {selectedTotal.toLocaleString('en', { minimumFractionDigits: 2 })})
              </button>
            </div>
          </div>
        )}

        {processing && (
          <div className="chat-message agent">
            <div className="message-avatar"><Bot size={16} /></div>
            <div className="message-bubble processing-bubble">
              <div className="processing-title">
                <Loader2 size={16} className="spin" />
                Processing Goods Receipts...
              </div>
              <div className="processing-steps">
                {processSteps.map((step, i) => (
                  <div key={i} className={`proc-step ${i < processStep ? 'done' : ''} ${i === processStep ? 'active' : ''} ${i > processStep ? 'pending' : ''}`}>
                    {i < processStep ? <CheckCircle2 size={13} /> : i === processStep ? <Loader2 size={13} className="spin" /> : <span className="proc-dot" />}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {completed && completedItems.length > 0 && (
          <div className="gr-breakdown-card">
            <div className="gr-breakdown-header" onClick={() => setShowBreakdown(!showBreakdown)}>
              <div className="gr-breakdown-header-left">
                <PackageCheck size={16} />
                <span>GR Posting Summary — {completedItems.length} items</span>
              </div>
              <button className="gr-breakdown-toggle">
                {showBreakdown ? 'Hide' : 'View'} Breakdown
                {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
            {showBreakdown && (
              <>
                <div className="gr-breakdown-body">
                  <table className="gr-breakdown-table">
                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Description</th>
                        <th>PO</th>
                        <th>Cost Center</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedItems.map(item => (
                        <tr key={item.id}>
                          <td className="gr-bd-vendor">{item.vendor}</td>
                          <td className="gr-bd-desc">{item.description}</td>
                          <td className="gr-bd-po">{item.poNumber}</td>
                          <td className="gr-bd-cc">{item.costCenter}</td>
                          <td className="gr-bd-amt">EUR {item.totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="gr-breakdown-footer">
                  <div className="gr-breakdown-totals">
                    {Object.entries(
                      completedItems.reduce((acc, item) => {
                        const cat = item.category
                        acc[cat] = (acc[cat] || 0) + item.totalValue
                        return acc
                      }, {})
                    ).map(([cat, val]) => (
                      <div key={cat} className="gr-bd-cat-row">
                        <span className="gr-bd-cat-name">{cat}</span>
                        <span className="gr-bd-cat-val">EUR {val.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    <div className="gr-bd-cat-row gr-bd-total-row">
                      <span className="gr-bd-cat-name">Total</span>
                      <span className="gr-bd-cat-val">EUR {completedItems.reduce((s, i) => s + i.totalValue, 0).toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        {showPrompts && (
          <div className="prompt-suggestions">
            {suggestedPrompts.map((prompt) => {
              const Icon = ICON_MAP[prompt.icon] || Inbox
              return (
                <button
                  key={prompt.id}
                  className="prompt-chip"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <Icon size={14} className="prompt-chip-icon" />
                  <span>{prompt.text}</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="chat-input-row">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask the procurement agent..."
            className="chat-input"
            disabled={isTyping || processing}
          />
          <button className="chat-send" onClick={handleSend} disabled={!inputValue.trim() || isTyping || processing}>
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

export default AgentChat
