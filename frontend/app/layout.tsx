import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERP Copilot AI',
  description: 'An AI-powered Multi-Agent ERP Assistant for Warehouse, Inventory, Purchase, Sales, and Business Analytics.',
  keywords: ['ERP', 'AI', 'Inventory', 'Warehouse', 'Purchase Orders', 'Sales', 'Analytics'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
