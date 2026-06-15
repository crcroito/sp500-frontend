const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// 1. Funcții de date (Punte către backend)
export async function fetchMarket() {
  try {
    const res = await fetch(`${API}/api/market`)
    return res.ok ? res.json() : { market: {} }
  } catch { return { market: {} } }
}

export async function fetchSectors() {
  try {
    const res = await fetch(`${API}/api/sectors`)
    return res.ok ? res.json() : []
  } catch { return [] }
}

export async function fetchMacro() {
  try {
    const res = await fetch(`${API}/api/macro`)
    return res.ok ? res.json() : {}
  } catch { return {} }
}

// 2. Funcții de formatare (ESENȚIALE - nu le șterge!)
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
