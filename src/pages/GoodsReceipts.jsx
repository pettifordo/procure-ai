import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PackageCheck,
  CheckCircle2,
  Bot,
  ChevronDown,
  ChevronRight,
  Edit3,
  X,
  Loader2,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import { myGoodsReceipts } from '../data/mockData'
import './GoodsReceipts.css'

const STATES = {
  REVIEW: 'review',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
}

function GoodsReceipts() {
  const navigate = useNavigate()
  const [items, setItems] = useState(myGoodsReceipts.map(i => ({ ...i, selected: true, expanded: false })))
  const [flowState, setFlowState] = useState(STATES.REVIEW)
  const [processStep, setProcessStep] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const selectedItems = items.filter(i => i.selected)
  const totalValue = selectedItems.reduce((sum, i) => sum + i.totalValue, 0)

  const processSteps = [
    'Validating PO line items...',
    'Cross-referencing invoices...',
    'Posting goods receipt documents...',
    'Updating GL accounts...',
    'Sending vendor confirmations...',
    'Complete!',
  ]

  useEffect(() => {
    if (flowState === STATES.PROCESSING && processStep < processSteps.length - 1) {
      const timer = setTimeout(() => setProcessStep(s => s + 1), 700)
      return () => clearTimeout(timer)
    }
    if (flowState === STATES.PROCESSING && processStep === processSteps.length - 1) {
      const timer = setTimeout(() => setFlowState(STATES.COMPLETE), 600)
      return () => clearTimeout(timer)
    }
  }, [flowState, processStep])

  const handleApproveAll = () => {
    setFlowState(STATES.PROCESSING)
    setProcessStep(0)
  }

  const toggleSelect = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, selected: !i.selected } : i))
  }

  const toggleExpand = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, expanded: !i.expanded } : i))
  }

  const startEdit = (id, val) => {
    setEditingId(id)
    setEditValue(val.toString())
  }

  const saveEdit = (id) => {
    const num = parseFloat(editValue)
    if (num > 0) {
      setItems(items.map(i => i.id === id ? { ...i, totalValue: num } : i))
    }
    setEditingId(null)
  }

  if (flowState === STATES.COMPLETE) {
    return (
      <div className="gr-page">
        <div className="gr-complete">
          <div className="gr-complete-icon">
            <ShieldCheck size={48} />
          </div>
          <h1>Goods Receipts Posted Successfully</h1>
          <p className="gr-complete-summary">
            {selectedItems.length} line items totalling <strong>EUR {totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}</strong> have been posted.
          </p>
          <div className="gr-complete-details">
            <div className="gr-complete-stat">
              <span className="gr-complete-stat-value">{selectedItems.length}</span>
              <span className="gr-complete-stat-label">GR Documents</span>
            </div>
            <div className="gr-complete-stat">
              <span className="gr-complete-stat-value">{new Set(selectedItems.map(i => i.vendor)).size}</span>
              <span className="gr-complete-stat-label">Vendors Notified</span>
            </div>
            <div className="gr-complete-stat">
              <span className="gr-complete-stat-value">0</span>
              <span className="gr-complete-stat-label">Errors</span>
            </div>
          </div>
          <div className="gr-complete-agent-note">
            <Bot size={16} />
            <span>GR Agent posted all documents and sent confirmations to {new Set(selectedItems.map(i => i.vendor)).size} vendors.</span>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
            Back to Agent
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gr-page" style={{ overflow: 'auto', padding: '1.5rem 0' }}>
      <div className="page-header">
        <div>
          <button className="btn btn-text" onClick={() => navigate('/')} style={{ marginBottom: 4, padding: 0 }}>
            <ArrowLeft size={14} /> Back to Agent
          </button>
          <h1 className="page-title">Goods Receipts — May 2026</h1>
          <p className="page-subtitle">
            {items.length} IT service items from {new Set(items.map(i => i.vendor)).size} vendors
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => setItems(items.map(i => ({ ...i, selected: true })))}>
            Select All
          </button>
          <button
            className="btn btn-success btn-lg"
            onClick={handleApproveAll}
            disabled={flowState === STATES.PROCESSING || selectedItems.length === 0}
          >
            {flowState === STATES.PROCESSING ? (
              <><Loader2 size={16} className="spin" /> Processing...</>
            ) : (
              <><PackageCheck size={16} /> Approve & Post All ({selectedItems.length})</>
            )}
          </button>
        </div>
      </div>

      {flowState === STATES.PROCESSING && (
        <div className="processing-banner">
          <div className="processing-steps">
            {processSteps.map((step, i) => (
              <div key={i} className={`processing-step ${i < processStep ? 'done' : ''} ${i === processStep ? 'active' : ''}`}>
                {i < processStep ? <CheckCircle2 size={14} /> : i === processStep ? <Loader2 size={14} className="spin" /> : <span className="step-dot" />}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="gr-summary-bar">
        <div className="gr-summary-item">
          <span className="gr-summary-label">Selected Value</span>
          <span className="gr-summary-value">EUR {totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="gr-summary-item">
          <span className="gr-summary-label">Items Selected</span>
          <span className="gr-summary-value">{selectedItems.length} / {items.length}</span>
        </div>
        <div className="gr-summary-item">
          <span className="gr-summary-label">Avg AI Confidence</span>
          <span className="gr-summary-value">{Math.round(selectedItems.reduce((s, i) => s + i.aiConfidence, 0) / (selectedItems.length || 1))}%</span>
        </div>
      </div>

      <div className="gr-list">
        {items.map((item) => (
          <div key={item.id} className={`gr-item ${item.expanded ? 'expanded' : ''}`}>
            <div className="gr-item-main" onClick={() => toggleExpand(item.id)}>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={(e) => { e.stopPropagation(); toggleSelect(item.id) }}
                className="gr-checkbox"
              />
              <div className="gr-expand-icon">
                {item.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              <div className="gr-item-info">
                <div className="gr-item-material">{item.description}</div>
                <div className="gr-item-meta">
                  {item.vendor} &middot; {item.poNumber} &middot; {item.category}
                </div>
              </div>
              <div className="gr-item-value">
                {editingId === item.id ? (
                  <div className="qty-edit" onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize: 11, color: '#706E6B' }}>EUR</span>
                    <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className="qty-input" autoFocus onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)} />
                    <button className="qty-save" onClick={() => saveEdit(item.id)}><CheckCircle2 size={14} /></button>
                    <button className="qty-cancel" onClick={() => setEditingId(null)}><X size={12} /></button>
                  </div>
                ) : (
                  <span className="qty-display" onClick={(e) => { e.stopPropagation(); startEdit(item.id, item.totalValue) }}>
                    EUR {item.totalValue.toLocaleString('en', { minimumFractionDigits: 2 })}
                    <Edit3 size={11} className="qty-edit-icon" />
                  </span>
                )}
              </div>
              <div className="gr-item-confidence">
                <div className={`confidence-bar ${item.aiConfidence >= 90 ? 'high' : item.aiConfidence >= 70 ? 'medium' : 'low'}`}>
                  <div className="confidence-fill" style={{ width: `${item.aiConfidence}%` }} />
                </div>
                <span className="confidence-label">{item.aiConfidence}%</span>
              </div>
            </div>

            {item.expanded && (
              <div className="gr-item-detail">
                <div className="gr-detail-grid">
                  <div className="gr-detail-field">
                    <label>Cost Center</label>
                    <span>{item.costCenter}</span>
                  </div>
                  <div className="gr-detail-field">
                    <label>GL Account</label>
                    <span>{item.glAccount}</span>
                  </div>
                  <div className="gr-detail-field">
                    <label>Period</label>
                    <span>{item.period}</span>
                  </div>
                  <div className="gr-detail-field">
                    <label>Quantity</label>
                    <span>{item.quantity.toLocaleString()} {item.uom}</span>
                  </div>
                </div>
                <div className="gr-ai-note">
                  <Sparkles size={14} />
                  <div>
                    <div className="ai-note-label">AI Agent Assessment</div>
                    <div className="ai-note-text">{item.aiNote}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GoodsReceipts
