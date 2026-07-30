'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Bot, Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/backend/auth/login', { email, password })
      const { accessToken, refreshToken, fullName, role } = res.data
      localStorage.setItem('erp_token', accessToken)
      localStorage.setItem('erp_refresh', refreshToken)
      localStorage.setItem('erp_user', JSON.stringify({ email, fullName, role }))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (role: string) => {
    const credentials: Record<string, string> = {
      admin: 'admin@erp.com',
      warehouse: 'warehouse@erp.com',
      purchase: 'purchase@erp.com',
      sales: 'sales@erp.com',
    }
    setEmail(credentials[role])
    setPassword('Pass@123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2a] to-[#0a0a1a]" />
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              background: `radial-gradient(circle, ${['#6366f1','#8b5cf6','#a855f7','#6366f1','#7c3aed','#4f46e5'][i]} 0%, transparent 70%)`,
              left: `${[10, 70, 30, 80, 5, 55][i]}%`,
              top: `${[20, 10, 60, 70, 80, 40][i]}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 border border-indigo-500/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Bot className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text">ERP Copilot AI</h1>
            <p className="text-muted-foreground text-sm mt-1">AI-powered enterprise ERP assistant</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="alert-critical mb-5 text-sm flex items-center gap-2"
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@erp.com"
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-muted/50 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign in to ERP Copilot'}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick login (demo)</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { role: 'admin', label: 'Admin', color: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400' },
                { role: 'warehouse', label: 'WH', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400' },
                { role: 'purchase', label: 'PO', color: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400' },
                { role: 'sales', label: 'Sales', color: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400' },
              ].map(({ role, label, color }) => (
                <button
                  key={role}
                  id={`quick-login-${role}`}
                  onClick={() => quickLogin(role)}
                  className={`py-2 rounded-lg bg-gradient-to-b ${color} border text-xs font-medium transition-all hover:scale-105`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
