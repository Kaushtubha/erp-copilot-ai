'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, Package, Search, ArrowUpDown, Plus, Filter } from 'lucide-react'
import { useState } from 'react'

const inventoryData = [
  { sku: 'ELEC-001', name: 'Arduino Mega 2560', category: 'Electronics', warehouse: 'Mumbai Central WH', qty: 85, reserved: 10, status: 'healthy', zone: 'A-101', lastMovement: '2 days ago' },
  { sku: 'ELEC-002', name: 'Raspberry Pi 4 (4GB)', category: 'Electronics', warehouse: 'Mumbai Central WH', qty: 12, reserved: 5, status: 'low', zone: 'A-102', lastMovement: '1 day ago' },
  { sku: 'ELEC-003', name: 'ESP32 Development Board', category: 'Electronics', warehouse: 'Mumbai Central WH', qty: 220, reserved: 50, status: 'healthy', zone: 'B-201', lastMovement: '3 days ago' },
  { sku: 'MECH-001', name: 'Industrial Servo Motor', category: 'Mechanical', warehouse: 'Pune Logistics Hub', qty: 8, reserved: 2, status: 'dead', zone: 'C-301', lastMovement: '95 days ago' },
  { sku: 'MECH-002', name: 'Precision Bearing 6205', category: 'Mechanical', warehouse: 'Pune Logistics Hub', qty: 450, reserved: 100, status: 'healthy', zone: 'C-302', lastMovement: '1 day ago' },
  { sku: 'CHEM-001', name: 'Isopropyl Alcohol 5L', category: 'Chemicals', warehouse: 'Bengaluru WH-North', qty: 25, reserved: 0, status: 'low', zone: 'D-401', lastMovement: '5 days ago' },
  { sku: 'ELEC-004', name: 'LiPo Battery 3.7V 2000mAh', category: 'Electronics', warehouse: 'Mumbai Central WH', qty: 280, reserved: 80, status: 'healthy', zone: 'A-103', lastMovement: '4 hours ago' },
  { sku: 'TOOL-001', name: 'Digital Multimeter', category: 'Tools', warehouse: 'Delhi NCR Depot', qty: 3, reserved: 0, status: 'dead', zone: 'E-501', lastMovement: '100 days ago' },
  { sku: 'ELEC-005', name: 'OLED Display 128x64', category: 'Electronics', warehouse: 'Mumbai Central WH', qty: 750, reserved: 200, status: 'healthy', zone: 'A-104', lastMovement: '4 hours ago' },
]

const STATUS_CONFIG = {
  healthy: { label: 'Healthy', className: 'status-approved', icon: CheckCircle },
  low: { label: 'Low Stock', className: 'status-pending', icon: AlertTriangle },
  dead: { label: 'Dead Stock', className: 'status-cancelled', icon: Clock },
  critical: { label: 'Critical', className: 'status-delayed', icon: AlertTriangle },
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const filtered = inventoryData.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.sku.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || item.status === filter
    return matchSearch && matchFilter
  })

  const summary = {
    total: inventoryData.length,
    low: inventoryData.filter(i => i.status === 'low').length,
    dead: inventoryData.filter(i => i.status === 'dead').length,
    healthy: inventoryData.filter(i => i.status === 'healthy').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{inventoryData.length} SKUs across 4 warehouses</p>
        </div>
        <button id="add-inventory-btn" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', value: summary.total, color: 'from-blue-500 to-cyan-500', icon: Package },
          { label: 'Healthy Stock', value: summary.healthy, color: 'from-emerald-500 to-teal-500', icon: CheckCircle },
          { label: 'Low Stock', value: summary.low, color: 'from-amber-500 to-orange-500', icon: AlertTriangle },
          { label: 'Dead Stock', value: summary.dead, color: 'from-zinc-500 to-slate-500', icon: Clock },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="kpi-card">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="inventory-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by SKU or product name..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-border/50 rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'healthy', 'low', 'dead'].map(f => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                filter === f
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-muted/30 text-muted-foreground border-border/40 hover:border-border/70'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th className="text-right">On Hand</th>
              <th className="text-right">Available</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Last Movement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
              const available = item.qty - item.reserved
              return (
                <motion.tr key={item.sku} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <td className="font-mono text-xs text-indigo-400">{item.sku}</td>
                  <td className="font-medium text-sm">{item.name}</td>
                  <td className="text-xs text-muted-foreground">{item.category}</td>
                  <td className="text-xs text-muted-foreground">{item.warehouse}</td>
                  <td className="text-right font-mono text-sm">{item.qty.toLocaleString()}</td>
                  <td className={`text-right font-mono text-sm ${available < 20 ? 'text-red-400' : ''}`}>{available}</td>
                  <td className="text-xs font-mono text-muted-foreground">{item.zone}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium ${cfg.className}`}>
                      <cfg.icon className="w-2.5 h-2.5" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="text-xs text-muted-foreground">{item.lastMovement}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No inventory items match your search.</div>
        )}
      </motion.div>
    </div>
  )
}
