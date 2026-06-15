const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Funcții actualizate pentru a preveni erorile de tip "Ecran gol"
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
