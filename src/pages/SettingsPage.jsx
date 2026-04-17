import { useState } from 'react'
import {
  Settings,
  Calendar,
  Mail,
  Bell,
  Users,
  Clock,
  Save,
  CheckCircle2,
  Bot,
  Shield,
} from 'lucide-react'
import './SettingsPage.css'

function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    autoGrEnabled: true,
    autoGrDay: '1',
    autoGrTime: '08:00',
    emailId: 'owen.pettiford@company.com',
    reminderFrequency: 'daily',
    reminderDaysBefore: '3',
    delegateName: '',
    delegateEmail: '',
    delegateActive: false,
    escalationTime: '48',
    escalationTarget: 'manager',
    autoApproveThreshold: '10000',
    autoApproveEnabled: true,
  })

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="settings-subtitle">Configure your GR automation, notifications, and delegation preferences</p>
      </div>

      <div className="settings-sections">
        {/* Auto GR Schedule */}
        <div className="settings-section">
          <div className="section-title">
            <Calendar size={18} />
            <div>
              <h2>Auto GR Schedule</h2>
              <p>Configure when the GR Agent automatically processes goods receipts</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="setting-row">
              <label className="setting-label">Enable Auto GR</label>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoGrEnabled}
                    onChange={e => updateSetting('autoGrEnabled', e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
                <span className="setting-hint">{settings.autoGrEnabled ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Day of Month</label>
              <div className="setting-control">
                <select
                  value={settings.autoGrDay}
                  onChange={e => updateSetting('autoGrDay', e.target.value)}
                  className="setting-select"
                >
                  {Array.from({ length: 28 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}{getOrdinal(i + 1)}</option>
                  ))}
                  <option value="last">Last business day</option>
                </select>
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Time</label>
              <div className="setting-control">
                <input
                  type="time"
                  value={settings.autoGrTime}
                  onChange={e => updateSetting('autoGrTime', e.target.value)}
                  className="setting-input"
                />
                <span className="setting-hint">UTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="settings-section">
          <div className="section-title">
            <Mail size={18} />
            <div>
              <h2>Email Configuration</h2>
              <p>Set your email for GR notifications and vendor confirmations</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="setting-row">
              <label className="setting-label">Email ID</label>
              <div className="setting-control">
                <input
                  type="email"
                  value={settings.emailId}
                  onChange={e => updateSetting('emailId', e.target.value)}
                  className="setting-input wide"
                  placeholder="your.email@company.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Frequency */}
        <div className="settings-section">
          <div className="section-title">
            <Bell size={18} />
            <div>
              <h2>Email Reminder Frequency</h2>
              <p>How often you receive reminders for pending goods receipts</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="setting-row">
              <label className="setting-label">Frequency</label>
              <div className="setting-control">
                <select
                  value={settings.reminderFrequency}
                  onChange={e => updateSetting('reminderFrequency', e.target.value)}
                  className="setting-select"
                >
                  <option value="none">No reminders</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Monday)</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Days Before Due Date</label>
              <div className="setting-control">
                <select
                  value={settings.reminderDaysBefore}
                  onChange={e => updateSetting('reminderDaysBefore', e.target.value)}
                  className="setting-select"
                >
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
                <span className="setting-hint">Reminder sent this many days before GR is due</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delegate */}
        <div className="settings-section">
          <div className="section-title">
            <Users size={18} />
            <div>
              <h2>Delegate</h2>
              <p>Assign a delegate to handle GRs when you are unavailable</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="setting-row">
              <label className="setting-label">Enable Delegate</label>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.delegateActive}
                    onChange={e => updateSetting('delegateActive', e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
                <span className="setting-hint">{settings.delegateActive ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Delegate Name</label>
              <div className="setting-control">
                <input
                  type="text"
                  value={settings.delegateName}
                  onChange={e => updateSetting('delegateName', e.target.value)}
                  className="setting-input wide"
                  placeholder="e.g. Jane Smith"
                />
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Delegate Email</label>
              <div className="setting-control">
                <input
                  type="email"
                  value={settings.delegateEmail}
                  onChange={e => updateSetting('delegateEmail', e.target.value)}
                  className="setting-input wide"
                  placeholder="delegate@company.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Escalation */}
        <div className="settings-section">
          <div className="section-title">
            <Clock size={18} />
            <div>
              <h2>Escalation Time</h2>
              <p>Automatically escalate unactioned GRs after a period of time</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="setting-row">
              <label className="setting-label">Escalate After</label>
              <div className="setting-control">
                <select
                  value={settings.escalationTime}
                  onChange={e => updateSetting('escalationTime', e.target.value)}
                  className="setting-select"
                >
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                  <option value="96">96 hours</option>
                  <option value="168">1 week</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Escalate To</label>
              <div className="setting-control">
                <select
                  value={settings.escalationTarget}
                  onChange={e => updateSetting('escalationTarget', e.target.value)}
                  className="setting-select"
                >
                  <option value="manager">Line Manager</option>
                  <option value="delegate">Delegate</option>
                  <option value="finance">Finance Team</option>
                  <option value="procurement">Procurement Lead</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Approve */}
        <div className="settings-section">
          <div className="section-title">
            <Shield size={18} />
            <div>
              <h2>Auto-Approve Threshold</h2>
              <p>GR items below this threshold with high AI confidence are auto-approved</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="setting-row">
              <label className="setting-label">Enable Auto-Approve</label>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoApproveEnabled}
                    onChange={e => updateSetting('autoApproveEnabled', e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
                <span className="setting-hint">{settings.autoApproveEnabled ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
            <div className="setting-row">
              <label className="setting-label">Threshold (EUR)</label>
              <div className="setting-control">
                <input
                  type="number"
                  value={settings.autoApproveThreshold}
                  onChange={e => updateSetting('autoApproveThreshold', e.target.value)}
                  className="setting-input"
                  placeholder="10000"
                />
                <span className="setting-hint">Items below this value with 98%+ AI confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-save" onClick={handleSave}>
          {saved ? <><CheckCircle2 size={16} /> Saved</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  )
}

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export default SettingsPage
