'use client'

import { motion } from 'framer-motion'
import { Zap, Plus, Play, Pause, History, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const workflows = [
  {
    id: '1',
    name: 'Auto Reorder on Low Stock',
    description: 'Creates PO automatically when inventory drops below reorder level',
    trigger: 'THRESHOLD',
    triggerLabel: 'Stock < reorder level',
    active: true,
    executionCount: 47,
    successCount: 45,
    lastRun: '2 hours ago',
    steps: 3,
  },
  {
    id: '2',
    name: 'PO Delay Alert',
    description: 'Notifies purchase manager when a PO is delayed by 3+ days',
    trigger: 'EVENT',
    triggerLabel: 'PO_DELAYED (>3 days)',
    active: true,
    executionCount: 12,
    successCount: 12,
    lastRun: '5 hours ago',
    steps: 3,
  },
  {
    id: '3',
    name: 'Daily Low Stock Summary',
    description: 'Sends daily email report to warehouse manager at 9am',
    trigger: 'SCHEDULE',
    triggerLabel: 'Every day at 9:00 AM IST',
    active: true,
    executionCount: 30,
    successCount: 30,
    lastRun: '6 hours ago',
    steps: 2,
  },
  {
    id: '4',
    name: 'GRN Auto Approval',
    description: 'Auto-approves GRNs under ₹10,000, escalates above to purchase manager',
    trigger: 'EVENT',
    triggerLabel: 'GRN_RECEIVED',
    active: false,
    executionCount: 8,
    successCount: 7,
    lastRun: '2 days ago',
    steps: 3,
  },
]

const TRIGGER_COLORS: Record<string, string> = {
  THRESHOLD: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  EVENT: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  SCHEDULE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  MANUAL: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
}

export default function WorkflowsPage() {
  const [wfs, setWfs] = useState(workflows)
  const router = useRouter()

  const toggleActive = (id: string) => {
    setWfs(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflow Automation</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered ERP automations — describe in natural language</p>
        </div>
        <div className="flex gap-3">
          <button
            id="ask-ai-workflow-btn"
            onClick={() => router.push('/copilot')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 text-violet-400 text-sm font-medium hover:border-violet-500/50 hover:from-violet-600/30 transition-all"
          >
            <Zap className="w-4 h-4" />
            Create with AI
          </button>
          <button
            id="new-workflow-btn"
            onClick={() => router.push('/workflows/builder')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" /> New Workflow
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: wfs.length, color: 'from-indigo-500 to-purple-500' },
          { label: 'Active', value: wfs.filter(w => w.active).length, color: 'from-emerald-500 to-teal-500' },
          { label: 'Total Executions', value: wfs.reduce((a, w) => a + w.executionCount, 0), color: 'from-blue-500 to-cyan-500' },
          { label: 'Success Rate', value: `${Math.round(wfs.reduce((a, w) => a + w.successCount, 0) / Math.max(wfs.reduce((a, w) => a + w.executionCount, 0), 1) * 100)}%`, color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="kpi-card">
            <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${s.color} mr-2 inline-block align-middle`} />
            <div className="inline-block align-middle">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Create Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 border border-violet-500/30 bg-violet-500/5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Create Workflows with Natural Language</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Just describe what you want: <em>"Auto-create a PO when stock falls below reorder level"</em>
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {[
                  'Auto-create PO when stock is low',
                  'Alert when PO is delayed',
                  'Daily low stock report at 9am',
                ].map(ex => (
                  <button
                    key={ex}
                    onClick={() => router.push(`/copilot?q=${encodeURIComponent(ex)}`)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => router.push('/copilot')} className="flex-shrink-0 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-colors">
            Open Copilot →
          </button>
        </div>
      </motion.div>

      {/* Workflow Cards */}
      <div className="grid gap-4">
        {wfs.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 + 0.3 }}
            className={`glass-card p-5 border transition-colors ${wf.active ? 'border-border/50' : 'border-border/20 opacity-75'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${wf.active ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-muted/50'}`}>
                  <Zap className={`w-5 h-5 ${wf.active ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{wf.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${TRIGGER_COLORS[wf.trigger]}`}>
                      {wf.trigger}
                    </span>
                    {wf.active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">● Active</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{wf.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {wf.triggerLabel}</span>
                    <span>{wf.steps} steps</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> {wf.successCount}/{wf.executionCount} runs</span>
                    <span>Last: {wf.lastRun}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  id={`workflow-toggle-${wf.id}`}
                  onClick={() => toggleActive(wf.id)}
                  className={`p-2 rounded-lg transition-colors ${wf.active ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'}`}
                  title={wf.active ? 'Disable' : 'Enable'}
                >
                  {wf.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  id={`workflow-history-${wf.id}`}
                  onClick={() => router.push(`/workflows/${wf.id}`)}
                  className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="View execution history"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  id={`workflow-detail-${wf.id}`}
                  onClick={() => router.push(`/workflows/${wf.id}`)}
                  className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
