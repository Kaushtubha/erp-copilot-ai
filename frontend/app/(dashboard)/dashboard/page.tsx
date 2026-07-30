'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Package, ShoppingCart, Truck, AlertTriangle, Activity, DollarSign } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// ─── Mock KPI Data ────────────────────────────────────────────────────────────
const kpis = [
  { title: 'Total Revenue', value: '₹1.52 Cr', change: '+12.4%', up: true, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
  { title: 'Active Orders', value: '248', change: '+8.1%', up: true, icon: ShoppingCart, color: 'from-blue-500 to-cyan-500' },
  { title: 'Low Stock Alerts', value: '14', change: '+3', up: false, icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
  { title: 'Pending GRNs', value: '7', change: '-2', up: true, icon: Truck, color: 'from-indigo-500 to-purple-500' },
  { title: 'Delayed POs', value: '3', change: '+1', up: false, icon: Package, color: 'from-red-500 to-rose-500' },
  { title: 'Warehouse Utilization', value: '72%', change: '+4%', up: false, icon: Activity, color: 'from-violet-500 to-purple-500' },
]

const salesData = [
  { month: 'Jan', revenue: 850000, orders: 185 },
  { month: 'Feb', revenue: 920000, orders: 198 },
  { month: 'Mar', revenue: 1100000, orders: 234 },
  { month: 'Apr', revenue: 980000, orders: 212 },
  { month: 'May', revenue: 1250000, orders: 267 },
  { month: 'Jun', revenue: 1380000, orders: 289 },
  { month: 'Jul', revenue: 1520000, orders: 312 },
]

const inventoryStatus = [
  { name: 'Healthy', value: 68, color: '#22c55e' },
  { name: 'Low Stock', value: 18, color: '#f59e0b' },
  { name: 'Critical', value: 8, color: '#ef4444' },
  { name: 'Dead Stock', value: 6, color: '#6b7280' },
]

const warehouseCapacity = [
  { name: 'Mumbai WH', used: 77, free: 23 },
  { name: 'Pune Hub', used: 60, free: 40 },
  { name: 'Bengaluru WH', used: 90, free: 10 },
  { name: 'Delhi Depot', used: 52, free: 48 },
]

const alerts = [
  { type: 'critical', message: 'ELEC-002 (Raspberry Pi 4) — Only 7 units left, below reorder level', time: '2m ago' },
  { type: 'warning', message: 'PO-2024-002 — Overdue by 2 days (Global Parts Ltd.)', time: '15m ago' },
  { type: 'warning', message: 'Bengaluru WH-North at 90% capacity', time: '1h ago' },
  { type: 'success', message: 'Workflow "Auto Reorder" triggered PO-2024-006 for ELEC-003', time: '2h ago' },
]

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6b7280']

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time ERP overview — July 31, 2026</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="kpi-card group"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <kpi.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{kpi.title}</div>
            <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <h2 className="text-sm font-semibold text-foreground mb-1">Revenue Trend</h2>
          <p className="text-xs text-muted-foreground mb-4">Monthly revenue & order count</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: number) => [`₹${(val/100000).toFixed(2)}L`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenueGrad)" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Inventory Status Pie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="glass-card p-5"
        >
          <h2 className="text-sm font-semibold text-foreground mb-1">Inventory Health</h2>
          <p className="text-xs text-muted-foreground mb-4">By stock status</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={inventoryStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {inventoryStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {inventoryStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-muted-foreground">{s.name}</span>
                <span className="text-xs font-medium ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Warehouse Capacity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <h2 className="text-sm font-semibold text-foreground mb-1">Warehouse Capacity</h2>
          <p className="text-xs text-muted-foreground mb-4">Utilization percentage across locations</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={warehouseCapacity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={100} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: number) => [`${val}%`]}
              />
              <Bar dataKey="used" name="Used" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="free" name="Free" stackId="a" fill="rgba(99,102,241,0.15)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="glass-card p-5"
        >
          <h2 className="text-sm font-semibold text-foreground mb-1">Smart Alerts</h2>
          <p className="text-xs text-muted-foreground mb-4">AI-detected issues</p>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-3 rounded-xl text-xs border ${
                  alert.type === 'critical' ? 'bg-red-500/10 border-red-500/25 text-red-400' :
                  alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                  'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span>{alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🟢'}</span>
                  <div>
                    <p className="leading-snug">{alert.message}</p>
                    <p className="text-muted-foreground mt-1 text-[10px]">{alert.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
