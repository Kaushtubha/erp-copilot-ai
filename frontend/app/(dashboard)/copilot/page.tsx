'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, Mic, MicOff, Sparkles, User, RotateCcw,
  ChevronRight, Copy, CheckCheck, BarChart2, Download, Zap
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  agent?: string
  intent?: string
  chartData?: any
  sqlQuery?: string
  workflowDefinition?: any
  timestamp: Date
  streaming?: boolean
}

const SUGGESTIONS = [
  '📦 Show today\'s pending GRNs',
  '⚠️ Which purchase orders are delayed?',
  '📉 What inventory will run out in 7 days?',
  '🏭 Which warehouse has maximum dead stock?',
  '📈 Predict next month\'s demand',
  '🤖 Auto-create PO when stock falls below reorder level',
  '⚡ Send daily low stock summary at 9am',
  '🔍 Which vendor is performing poorly?',
]

const AGENT_COLORS: Record<string, string> = {
  inventory_agent: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warehouse_agent: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  sales_agent: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  purchase_agent: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  analytics_agent: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  forecast_agent: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  report_agent: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  sql_agent: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  workflow_agent: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  explanation_agent: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  planner: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
}

function ChartRenderer({ data }: { data: any }) {
  if (!data) return null
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#ef4444']

  if (data.type === 'bar') {
    return (
      <div className="glass-card p-4 mt-3">
        <p className="text-xs font-medium text-muted-foreground mb-3">{data.title}</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.data.map((_: any, i: number) => (
                <Cell key={i} fill={data.data[i]?.color || colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (data.type === 'line') {
    return (
      <div className="glass-card p-4 mt-3">
        <p className="text-xs font-medium text-muted-foreground mb-3">{data.title}</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', fontSize: '11px' }} />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (data.type === 'pie') {
    const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6366f1']
    return (
      <div className="glass-card p-4 mt-3">
        <p className="text-xs font-medium text-muted-foreground mb-3">{data.title}</p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={data.data} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
              {data.data.map((_: any, i: number) => <Cell key={i} fill={data.data[i]?.color || COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}

function WorkflowPreviewCard({ definition }: { definition: any }) {
  if (!definition) return null
  return (
    <div className="glass-card p-4 mt-3 border border-violet-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-violet-400" />
        <span className="text-xs font-semibold text-violet-400">Workflow Definition Preview</span>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground min-w-[80px]">Name:</span>
          <span className="font-medium">{definition.name}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground min-w-[80px]">Trigger:</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            definition.trigger_type === 'THRESHOLD' ? 'bg-amber-500/15 text-amber-400' :
            definition.trigger_type === 'SCHEDULE' ? 'bg-blue-500/15 text-blue-400' :
            definition.trigger_type === 'EVENT' ? 'bg-emerald-500/15 text-emerald-400' :
            'bg-zinc-500/15 text-zinc-400'
          }`}>{definition.trigger_type}</span>
        </div>
        {definition.steps && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Steps ({definition.steps.length}):</p>
            {definition.steps.map((step: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-border/30 last:border-0">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] flex items-center justify-center font-bold">{step.index}</span>
                <span className="font-medium">{step.name}</span>
                <span className="text-muted-foreground ml-auto text-[10px]">{step.action}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 py-2 text-xs rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:bg-violet-600/30 transition-colors font-medium">
            ✅ Save & Activate
          </button>
          <button className="flex-1 py-2 text-xs rounded-lg bg-muted/30 border border-border/50 text-muted-foreground hover:text-foreground transition-colors">
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "👋 **Hello! I'm ERP Copilot AI** — your intelligent multi-agent ERP assistant.\n\nI can help you with inventory, purchase orders, sales analytics, warehouse management, demand forecasting, and even **automate workflows** using natural language.\n\nWhat would you like to know?",
      agent: 'explanation_agent',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentAgent, setCurrentAgent] = useState('')
  const [listening, setListening] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true,
    }

    setMessages(prev => [...prev, userMsg, aiMsg])
    setLoading(true)

    const user = JSON.parse(localStorage.getItem('erp_user') || '{}')

    try {
      const response = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          session_id: 'main-session',
          stream: true,
          user_email: user.email || 'user@erp.com',
          user_role: user.role || 'ADMIN',
        }),
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let agentName = ''
      let chartData = null
      let workflowDef = null
      let sqlQuery = null
      let intentStr = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'agent_start') {
                agentName = data.agent
                intentStr = data.intent
                setCurrentAgent(agentName)
              } else if (data.type === 'token') {
                accumulated += data.content
                setMessages(prev => prev.map(m =>
                  m.id === aiMsg.id ? { ...m, content: accumulated, agent: agentName, intent: intentStr } : m
                ))
              } else if (data.type === 'metadata') {
                chartData = data.chart_data
                workflowDef = data.workflow_definition
                sqlQuery = data.sql_query
              } else if (data.type === 'done') {
                setMessages(prev => prev.map(m =>
                  m.id === aiMsg.id ? {
                    ...m,
                    streaming: false,
                    content: accumulated || m.content,
                    agent: agentName,
                    intent: intentStr,
                    chartData,
                    workflowDefinition: workflowDef,
                    sqlQuery,
                  } : m
                ))
                setCurrentAgent('')
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      // Fallback mock response
      const mockResponse = getMockResponse(text)
      setMessages(prev => prev.map(m =>
        m.id === aiMsg.id ? {
          ...m,
          streaming: false,
          content: mockResponse.content,
          agent: mockResponse.agent,
          chartData: mockResponse.chart,
        } : m
      ))
      setCurrentAgent('')
    } finally {
      setLoading(false)
    }
  }, [loading])

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in your browser.')
      return
    }
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'en-IN'
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    recognitionRef.current.onerror = () => setListening(false)
    recognitionRef.current.onend = () => setListening(false)
    recognitionRef.current.start()
    setListening(true)
  }

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 lg:flex-row">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col chat-container">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">ERP Copilot AI</h1>
              <p className="text-[11px] text-muted-foreground">12 agents • Gemini 2.0 Flash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentAgent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`agent-badge border ${AGENT_COLORS[currentAgent] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {currentAgent.replace('_agent', '').replace('_', ' ')}
              </motion.div>
            )}
            <button
              id="clear-chat"
              onClick={() => setMessages(prev => [prev[0]])}
              className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                    : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-border/50'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                </div>

                {/* Content */}
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.agent && msg.role === 'assistant' && (
                    <span className={`agent-badge border text-[10px] ${AGENT_COLORS[msg.agent] || ''}`}>
                      <Sparkles className="w-2.5 h-2.5" />
                      {msg.agent.replace('_agent', '').replace('_', ' ')} agent
                    </span>
                  )}

                  <div className={msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}>
                    {msg.streaming && !msg.content ? (
                      <div className="flex items-center gap-1.5 py-1">
                        {[0, 0.2, 0.4].map(delay => (
                          <span key={delay} className="typing-dot" style={{ animationDelay: `${delay}s`, animationDuration: '0.8s' }} />
                        ))}
                      </div>
                    ) : (
                      <ReactMarkdown
                        className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed
                          [&_code]:bg-muted/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-indigo-300 [&_code]:text-xs
                          [&_pre]:bg-muted/50 [&_pre]:rounded-xl [&_pre]:p-3 [&_pre]:overflow-x-auto
                          [&_table]:text-xs [&_th]:text-muted-foreground [&_td]:py-1"
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}

                    {/* Chart */}
                    {msg.chartData && <ChartRenderer data={msg.chartData} />}

                    {/* Workflow Preview */}
                    {msg.workflowDefinition && <WorkflowPreviewCard definition={msg.workflowDefinition} />}

                    {/* SQL Query */}
                    {msg.sqlQuery && (
                      <div className="mt-3 p-3 glass-card rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart2 className="w-3 h-3 text-indigo-400" />
                          <span className="text-[10px] text-indigo-400 font-medium">Generated SQL</span>
                        </div>
                        <pre className="text-[11px] text-muted-foreground overflow-x-auto"><code>{msg.sqlQuery}</code></pre>
                      </div>
                    )}
                  </div>

                  {/* Message actions */}
                  {msg.role === 'assistant' && !msg.streaming && msg.content && (
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity mt-1">
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedId === msg.id ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <span className="text-[10px] text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-border/50">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask anything about your ERP data..."
                disabled={loading}
                className="w-full px-4 py-3.5 pr-12 bg-muted/40 border border-border/50 rounded-2xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all disabled:opacity-60"
              />
              <button
                id="voice-btn"
                onClick={handleVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  listening ? 'text-red-400 bg-red-500/15' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                title={listening ? 'Stop recording' : 'Voice input'}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <button
              id="send-btn"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion Sidebar */}
      <div className="w-full lg:w-64 glass-card p-4 flex flex-col gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold">Quick Queries</h2>
        </div>
        <p className="text-xs text-muted-foreground">Click to ask the AI</p>
        <div className="space-y-2">
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ''))}
              className="w-full text-left text-xs px-3 py-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground flex items-center gap-2 group"
            >
              <span>{s}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock response for when AI service is unavailable
function getMockResponse(query: string): { content: string; agent: string; chart: any } {
  const q = query.toLowerCase()
  if (q.includes('stock') || q.includes('inventory')) {
    return {
      agent: 'inventory_agent',
      chart: { type: 'bar', title: 'Low Stock Items', data: [{ name: 'ESP32', value: 12 }, { name: 'Servo Motor', value: 8 }, { name: 'IPA 5L', value: 25 }, { name: 'Multimeter', value: 3 }] },
      content: `## 📦 Inventory Status

**3 items are critically low:**

| SKU | Product | Stock | Reorder Level | Status |
|-----|---------|-------|---------------|--------|
| ELEC-002 | Raspberry Pi 4 (4GB) | 7 | 15 | 🔴 CRITICAL |
| MECH-001 | Industrial Servo Motor | 8 | 10 | 🔴 CRITICAL |
| TOOL-001 | Digital Multimeter | 3 | 5 | 🔴 CRITICAL |

**Recommendation:** Create purchase orders immediately for all 3 items. Would you like me to auto-generate them?`,
    }
  }
  if (q.includes('delay') || q.includes('purchase') || q.includes('po')) {
    return {
      agent: 'purchase_agent',
      chart: null,
      content: `## 📋 Delayed Purchase Orders

**2 purchase orders are currently overdue:**

| PO Number | Vendor | Expected | Delay | Amount |
|-----------|--------|----------|-------|--------|
| PO-2024-002 | Global Parts Ltd. | -2 days | **2 days** 🔴 | ₹1,28,000 |
| PO-2024-005 | Global Parts Ltd. | -8 days | **8 days** 🚨 | ₹95,000 |

**Risk Assessment:** Global Parts Ltd. shows a pattern of delays. Their on-time delivery rate is **68%** — HIGH RISK vendor.

**Recommended Actions:**
1. Contact Global Parts Ltd. immediately
2. Consider splitting future orders across multiple vendors
3. Activate the "PO Delay Alert" workflow for automatic notifications`,
    }
  }
  if (q.includes('workflow') || q.includes('automat') || q.includes('auto')) {
    return {
      agent: 'workflow_agent',
      chart: null,
      content: `## ⚡ Workflow Automation

I'll create that workflow for you! Here's what I parsed:

**Workflow: Auto Reorder on Low Stock**
- **Trigger:** Inventory threshold (quantity_on_hand < reorder_level)
- **Check interval:** Every 60 minutes

**Steps:**
1. ✅ Create Purchase Order (vendor: preferred_vendor, qty: reorder_quantity)
2. 📢 Notify Purchase Manager ("Auto PO created for {product.name}")
3. 📝 Audit Log entry

**Confidence:** 92%

> Review the workflow definition panel and click "Save & Activate" to enable this automation.`,
    }
  }
  return {
    agent: 'explanation_agent',
    chart: null,
    content: `I understand you're asking about **"${query}"**. 

In your ERP system, I can help you with:
- 📦 **Inventory** — Stock levels, alerts, adjustments
- 🏭 **Warehouse** — Capacity, dead stock, zones  
- 🛒 **Purchase Orders** — Status, delays, vendor performance
- 💼 **Sales** — Orders, revenue, customer analytics
- 📊 **Analytics** — Cross-module KPIs and forecasts
- ⚡ **Workflows** — Natural language automation

Could you be more specific about what you'd like to know?`,
  }
}
