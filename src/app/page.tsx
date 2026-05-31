'use client'
import { useState, useEffect, useCallback } from 'react'
import { fetchMarket, fetchSectors, fetchMacro, fmtChange, fmtPrice } from '../lib/api'
import TickerTape from '../components/TickerTape'
import OverviewPanel from '../components/OverviewPanel'
import SectorsPanel from '../components/SectorsPanel'
import MacroPanel from '../components/MacroPanel'
import SignalsPanel from '../components/SignalsPanel'
import GuruPanel from '../components/GuruPanel'
import GemPanel from '../components/GemPanel'

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'sectors',   label: 'Sectoare' },
  { id: 'macro',     label: 'Macro / FED' },
  { id: 'signals',   label: 'Semnale' },
  { id: 'gurus',     label: '🧠 Guru Portfolios' },
  { id: 'gems',      label: '💎 Gem Finder' },
]

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const [market, setMarket] = useState<any>(null)
  const [sectors, setSectors] = useState<any[]>([])
  const [macro, setMacro] = useState<any>(null)
  const [clock, setClock] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [m, s, mac] = await Promise.all([fetchMarket(), fetchSectors(), fetchMacro()])
    if (m) setMarket(m)
    if (s) setSectors(s)
    if (mac) setMacro(mac)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const iv = setInterval(load, 60000)
    return () => clearInterval(iv)
  }, [load])

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('ro-RO', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: 'Europe/Bucharest'
      }) + ' EET')
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  const spx = market?.['%5EGSPC'] || market?.['^GSPC']
  const vix = market?.['%5EVIX'] || market?.['^VIX']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Ticker Tape */}
      <TickerTape />

      {/* Header */}
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 17, fontWeight: 900 }}>
          S&P<span style={{ color: 'var(--accent)' }}>500</span>{' '}
          <span style={{
            fontSize: 9, fontFamily: 'IBM Plex Mono, monospace',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
            color: 'var(--accent)', padding: '2px 8px', borderRadius: 2, letterSpacing: 2
          }}>INTELLIGENCE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 10, color: 'var(--muted2)' }}>
          <span>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--green)',
              boxShadow: '0 0 8px var(--green)', display: 'inline-block', marginRight: 6
            }} className="blink" />
            LIVE
          </span>
          <span>{clock}</span>
          <span style={{ fontSize: 9 }}>NYSE · NASDAQ</span>
        </div>
      </header>

      {/* Nav */}
      <nav style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 14px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 11,
            cursor: 'pointer',
            borderRadius: 5,
            border: '1px solid',
            borderColor: tab === t.id ? 'var(--accent)' : 'var(--border)',
            background: tab === t.id ? 'var(--accent)' : 'var(--surface)',
            color: tab === t.id ? 'var(--bg)' : 'var(--muted2)',
            fontWeight: tab === t.id ? 700 : 400,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: '20px 16px', maxWidth: 1400, margin: '0 auto' }}>
        {tab === 'overview'  && <OverviewPanel market={market} sectors={sectors} loading={loading} />}
        {tab === 'sectors'   && <SectorsPanel sectors={sectors} loading={loading} />}
        {tab === 'macro'     && <MacroPanel macro={macro} />}
        {tab === 'signals'   && <SignalsPanel market={market} sectors={sectors} />}
        {tab === 'gurus'     && <GuruPanel />}
        {tab === 'gems'      && <GemPanel />}
      </main>
    </div>
  )
}
