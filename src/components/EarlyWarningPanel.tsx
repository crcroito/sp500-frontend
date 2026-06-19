'use client'
import { useState, useEffect, useCallback } from 'react'
import TVChart from './TVChart'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Paleta de culori pentru cei 4 piloni noi din backend
const PILON_COLORS: Record<number, string> = {
  1: '#00d4ff', // MA50 Breakout
  2: '#ffcc00', // Volume Anomaly
  3: '#ff7730', // Medium-Term Momentum
  4: '#bf5af2', // Institutional Accumulation
}

function scoreColor(s: number) {
  if (s >= 4) return '#00ff94'
  if (s >= 3) return '#00d4ff'
  if (s >= 2) return '#ffcc00'
  return '#5a7385'
}

function scoreLabel(s: number) {
  if (s >= 4) return '🔥 MAXIM'
  if (s >= 3) return '⚡ PUTERNIC'
  if (s >= 2) return '👀 WATCH'
  return 'SLAB'
}

export default function EarlyWarningPanel() {
  const [signals, setSignals]     = useState<any[]>([])
  const [statusInfo, setStatusInfo] = useState<any>(null)
  const [loading, setLoading]     = useState(false)
  const [scanning, setScanning]   = useState(false)
  const [selected, setSelected]   = useState<any>(null)
  const [minScore, setMinScore]   = useState(2) // Schimbat la 2 implicit deoarece e pragul optim din backend

  // 1. Verifică starea memoriei RAM din backend (/status)
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API}/status`)
      if (res.ok) {
        const statusData = await res.json()
        setStatusInfo(statusData)
      }
    } catch (e) {
      console.error("Eroare la verificarea statusului RAM:", e)
    }
  }, [])

  // 2. Rulează scanarea peste datele din RAM (/scan)
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/scan?min_score=${minScore}`)
      if (res.ok) {
        const scanResults = await res.json()
        setSignals(scanResults)
      }
    } catch (e) {
      console.error("Eroare la rularea scanării:", e)
    }
    setLoading(false)
  }, [minScore])

  // Monitorizare automată la inițializare
  useEffect(() => {
    checkStatus()
    loadData()
    // Verifică statusul din RAM la fiecare 10 secunde pentru a vedea progresul descărcării
    const interval = setInterval(checkStatus, 10000)
    return () => clearInterval(interval)
  }, [checkStatus, loadData])

  // Declanșator manual (Bypassează eroarea 404 și re-scanează RAM-ul local)
  const triggerScan = async () => {
    setScanning(true)
    await checkStatus()
    await loadData()
    setScanning(false)
  }

  return (
    <div>
      {/* Indicator dinamic pentru starea bazei de date din RAM */}
      {statusInfo && (
        <div style={{
          background: statusInfo.status === 'updating' ? 'rgba(255,204,0,0.1)' : 'rgba(0,255,148,0.1)',
          border: `1px solid ${statusInfo.status === 'updating' ? '#ffcc00' : '#00ff94'}`,
          borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12, display: 'flex', justifyContent: 'between', alignItems: 'center'
        }}>
          <div>
            <span>Stare RAM S&P 500: </span>
            <strong style={{ color: statusInfo.status === 'updating' ? '#ffcc00' : '#00ff94', textTransform: 'uppercase' }}>
              {statusInfo.status === 'updating' ? '⏳ Se descarcă cele 65 de zile...' : '✅ GATA DE SCANARE'}
            </strong>
            {statusInfo.status === 'updating' && (
              <span style={{ marginLeft: 8, color: 'var(--muted2)', fontSize: 11 }}>
                (Se completează istoricul pe furiș pentru a proteja cheia Polygon. Nu închide serverul.)
              </span>
            )}
          </div>
          <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
            Companii active: {statusInfo.count}
          </div>
        </div>
      )}

      {/* Header info */}
      <div style={{ background: 'rgba(255,64,96,0.05)', border: '1px solid rgba(255,64,96,0.2)', borderRadius: 6, padding: '12px 16px', marginBottom: 20, fontSize: 11, lineHeight: 1.8, color: 'var(--muted2)' }}>
        <strong style={{ color: 'var(--red)' }}>🚨 Early Warning System (Engine 65z RAM)</strong> — Scanează structural S&P 500 direct din memorie utilizând corelații macro și anomalii de volum instituțional pe o fereastră istorică stabilă.
        <br />
        <span style={{ color: 'var(--yellow)' }}>⚠️ Datele se actualizează automat în RAM în fiecare dimineață (ora 06:00 UTC), după ce Polygon finalizează datele ședinței anterioare. Fă research propriu.</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--muted2)' }}>Scor minim cerut:</span>
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => setMinScore(n)} style={{
              padding: '6px 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              cursor: 'pointer', borderRadius: 4, border: '1px solid',
              borderColor: minScore === n ? scoreColor(n) : 'var(--border)',
              background: minScore === n ? `${scoreColor(n)}18` : 'var(--surface)',
              color: minScore === n ? scoreColor(n) : 'var(--muted2)',
              fontWeight: minScore === n ? 700 : 400,
            }}>{n}/4</button>
          ))}
        </div>

        <button onClick={triggerScan} disabled={scanning} style={{
          padding: '7px 16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
          cursor: scanning ? 'wait' : 'pointer', borderRadius: 4,
          border: '1px solid var(--accent)', background: 'rgba(0,212,255,0.08)',
          color: 'var(--accent)', fontWeight: 700,
        }}>
          {scanning ? '⏳ Reîncărcare...' : '⚡ Scan Instant'}
        </button>

        {signals.length > 0 && (
          <span style={{ fontSize: 10, color: 'var(--muted2)', marginLeft: 'auto' }}>
            S-au găsit {signals.length} companii care respectă criteriile ·{' '}
            {signals[0]?.scanned_at ? new Date(signals[0].scanned_at).toLocaleTimeString('ro-RO') : ''}
          </span>
        )}
      </div>

      {/* Legendă Piloni noi */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', background: 'var(--surface)', padding: 10, borderRadius: 4, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 'bold', marginRight: 4 }}>PILONI TEHNICI ACTIVI:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: PILON_COLORS[1] }}>📈 Breakout MA50</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: PILON_COLORS[2] }}>🔊 Anomalie Volum MA20</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: PILON_COLORS[3] }}>💪 Momentum (15z/30z)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: PILON_COLORS[4] }}>🏦 Acumulare Smart Money</div>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="shimmer" style={{ height: 80, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }} />
          ))}
        </div>
      ) : signals.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted2)', fontSize: 13, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}>
          {statusInfo?.status === 'updating' 
            ? 'Baza de date din RAM se construiește. În câteva minute primele companii care trec pragul de 55 de zile vor apărea aici...'
            : `Nu s-au găsit companii din S&P 500 cu scorul minim de ${minScore}/4 în acest moment.`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {signals.map((s: any, i: number) => (
            <div key={s.ticker} className="card"
              onClick={() => setSelected(selected?.ticker === s.ticker ? null : s)}
              style={{ cursor: 'pointer', transition: 'border-color 0.2s',
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
                borderColor: selected?.ticker === s.ticker ? scoreColor(s.score) : 'var(--border)',
                borderLeft: `4px solid ${scoreColor(s.score)}` }}>

              <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 14, alignItems: 'center' }}>
                
                {/* Scorul Central */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted2)' }}>#{i + 1}</div>
                  <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 26, fontWeight: 900, color: scoreColor(s.score), lineHeight: 1 }}>{s.score}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted2)', letterSpacing: 0.5 }}>PILONI</div>
                </div>

                {/* Detalii Companie & Semnale text */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 17 }}>{s.ticker}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 'bold' }}>{scoreLabel(s.score)}</span>
                    <span style={{ fontSize: 9, padding: '1px 6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 2, color: 'var(--muted2)' }}>S&P 500</span>
                  </div>

                  {/* Afișarea dinamică a listei de motive primite de la backend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {s.signals.map((signalText: string, idx: number) => {
                      // Detectăm pilonul din text pentru a-i pune culoarea corectă
                      let color = '#fff'
                      let icon = '•'
                      if (signalText.includes('MA50')) { color = PILON_COLORS[1]; icon = '📈'; }
                      else if (signalText.includes('Volum')) { color = PILON_COLORS[2]; icon = '🔊'; }
                      else if (signalText.includes('Momentum')) { color = PILON_COLORS[3]; icon = '💪'; }
                      else if (signalText.includes('Acumulare')) { color = PILON_COLORS[4]; icon = '🏦'; }

                      return (
                        <div key={idx} style={{ fontSize: 11, color: color, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{icon}</span>
                          <span>{signalText}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Preț curent și variație zilnică */}
                <div style={{ textAlign: 'right', minWidth: 90 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: 'IBM Plex Mono, monospace' }}>${s.price}</div>
                  <div style={{ fontSize: 12, color: s.change_percent >= 0 ? '#00ff94' : '#ff4060', fontWeight: 700 }}>
                    {s.change_percent >= 0 ? '▲ +' : '▼ '} {s.change_percent}%
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--muted2)', marginTop: 4 }}>Volum: {(s.volume / 1000000).toFixed(1)}M</div>
                </div>
              </div>

              {/* Graficul integrat TradingView la click */}
              {selected?.ticker === s.ticker && (
                <div style={{ borderTop: '1px solid var(--border)', padding: 1 }}>
                  <TVChart symbol={`NASDAQ:${s.ticker}`} height={380} interval="D" studies={['STD;RSI', 'STD;MACD', 'STD;Volume']} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sectiunea Info / Sistem de Alerte */}
      <div className="card" style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--muted2)', lineHeight: 1.6 }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, color: 'var(--accent)', fontWeight: 'bold' }}>
          💡 INFORMAȚII MOTOR ANALITIC
        </div>
        Sistemul rulează integral in-memory (RAM) pe serverul Railway. Acest lucru elimină complet interogările repetate la baza de date și oferă rezultate instantanee. Actualizarea bazei de date se face o singură dată pe zi, automat, la ora 06:00 UTC, preluând exclusiv pachetul aggregated final emis de Polygon API pentru ultima ședință de tranzacționare încheiată.
      </div>
    </div>
  )
}
