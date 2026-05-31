const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchMarket() {
  const res = await fetch(`${API}/api/market`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export async function fetchSectors() {
  const res = await fetch(`${API}/api/sectors`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export async function fetchGems() {
  const res = await fetch(`${API}/api/gems`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export async function fetchMacro() {
  const res = await fetch(`${API}/api/macro`, { next: { revalidate: 3600 } })
  if (!res.ok) return null
  return res.json()
}

export function fmtChange(c: number | null) {
  if (c === null || c === undefined) return '--'
  const sign = c >= 0 ? '+' : ''
  return `${sign}${c.toFixed(2)}%`
}

export function fmtPrice(p: number | null, decimals = 2) {
  if (p === null || p === undefined) return '--'
  if (p >= 1000) return p.toLocaleString('en', { maximumFractionDigits: decimals })
  return p.toFixed(decimals)
}
