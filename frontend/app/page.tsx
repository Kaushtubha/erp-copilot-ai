'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('erp_token')
    router.push(token ? '/dashboard' : '/login')
  }
  return null
}
