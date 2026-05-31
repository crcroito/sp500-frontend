import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'S&P 500 Intelligence Dashboard',
  description: 'Analiză sectoare, Guru Portfolios, Gem Finder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
