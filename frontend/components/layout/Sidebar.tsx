'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bot, LayoutDashboard, Package, Warehouse, FileCheck,
  ShoppingCart, TrendingUp, Users, BarChart3, FileText,
  Zap, Settings, LogOut, ChevronRight, Building2
} from 'lucide-react'

const navGroups = [
  {
    label: 'Core',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/copilot', label: 'AI Copilot', icon: Bot, badge: 'AI' },
    ],
  },
  {
    label: 'ERP Modules',
    items: [
      { href: '/inventory', label: 'Inventory', icon: Package },
      { href: '/warehouse', label: 'Warehouse', icon: Warehouse },
      { href: '/grn', label: 'GRN', icon: FileCheck },
      { href: '/purchase', label: 'Purchase Orders', icon: ShoppingCart },
      { href: '/sales', label: 'Sales Orders', icon: TrendingUp },
      { href: '/vendors', label: 'Vendors', icon: Building2 },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/reports', label: 'Reports', icon: FileText },
      { href: '/workflows', label: 'Workflows', icon: Zap, badge: 'NEW' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/employees', label: 'Employees', icon: Users },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <aside
      className="flex flex-col border-r border-border/50 bg-card/40 backdrop-blur-xl"
      style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)' }}
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-glow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold gradient-text">ERP Copilot</h1>
            <p className="text-[10px] text-muted-foreground">AI-Powered ERP</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 px-3">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname.endsWith(item.href) || pathname === item.href
                return (
                  <motion.button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`nav-item w-full ${active ? 'active' : ''}`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left text-[13px]">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badge === 'AI' ? 'bg-indigo-500/20 text-indigo-400' :
                        item.badge === 'NEW' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {active && <ChevronRight className="w-3 h-3 opacity-60" />}
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="px-3 pb-4 border-t border-border/50 pt-3">
        <UserProfile />
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="nav-item w-full mt-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[13px]">Logout</span>
        </button>
      </div>
    </aside>
  )
}

function UserProfile() {
  if (typeof window === 'undefined') return null
  const user = JSON.parse(localStorage.getItem('erp_user') || '{}')
  if (!user.email) return null

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-500/20 text-red-400',
    WAREHOUSE_MANAGER: 'bg-blue-500/20 text-blue-400',
    PURCHASE_MANAGER: 'bg-amber-500/20 text-amber-400',
    SALES_MANAGER: 'bg-emerald-500/20 text-emerald-400',
    FINANCE: 'bg-purple-500/20 text-purple-400',
  }

  return (
    <div className="px-3 py-2.5 rounded-xl bg-muted/30 border border-border/40 mb-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {user.fullName?.[0] || user.email[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">{user.fullName || user.email}</p>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${roleColors[user.role] || 'bg-muted text-muted-foreground'}`}>
            {user.role?.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  )
}
