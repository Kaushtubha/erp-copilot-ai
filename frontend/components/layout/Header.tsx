'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Bell, Sparkles, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/copilot': 'AI Copilot',
  '/inventory': 'Inventory',
  '/warehouse': 'Warehouse',
  '/grn': 'GRN',
  '/purchase': 'Purchase Orders',
  '/sales': 'Sales Orders',
  '/vendors': 'Vendors',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/workflows': 'Workflow Automation',
  '/employees': 'Employees',
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchVal, setSearchVal] = useState('')

  const pageName = BREADCRUMB_MAP[pathname] || 'ERP Copilot'

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-border/50 bg-card/20 backdrop-blur-xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">ERP Copilot</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
        <span className="font-semibold text-foreground">{pageName}</span>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            id="global-search"
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchVal.trim()) {
                router.push(`/copilot?q=${encodeURIComponent(searchVal)}`)
                setSearchVal('')
              }
            }}
            placeholder="Search or ask AI..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-muted/40 border border-border/50 rounded-xl placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* AI Copilot Quick Access */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/copilot')}
          id="open-copilot-btn"
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-400 hover:border-indigo-500/50 hover:from-indigo-600/30 hover:to-purple-600/30 transition-all font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask AI
        </motion.button>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
