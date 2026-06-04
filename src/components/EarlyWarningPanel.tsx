'use client'
import { useState, useEffect, useCallback } from 'react'
import TVChart from './TVChart'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SIGNAL_META: Record<string, { icon: string; label: string; color: string }> = {
  earnings_surprise:  { icon: '📈', label: 'Earnings Surprise',        color: '#00ff94' },
  analyst_revision:   { icon: '🎯', label: 'Analyst Revision',         color: '#00d4ff' },
  volume_anomaly:     { icon: '🔊', label: 'Volume Anomaly',           color: '#ffcc00' },
  relative_strength:  { icon: '💪', label: 'Relative Strength',        color: '#ff7730' },
  inst_accumulation:  { icon: '🏦', label: 'Institutional Accum.',     color: '#bf5af2' },
}

function scoreColor(s: number) {
  if (s >= 5) return '#00ff94'
  if (s >= 4) return '#00d4ff'
  if (s >= 3) return '#ffcc00'
  return '#5a7385'
}

function scoreLabel(s: number) {
  if (s >= 5) return '🔥 MAXIM'
  if (s >= 4) return '⚡ PUTERNIC'
  if (s >= 3) return '👀 WATCH'
  return 'SLAB'
}

export default function EarlyWarningPanel() {
  const [data, setData]         = useState<any>(null)
  const [loading, setLoading]   = useState(false)
  const [scanning, setScanning] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [email, setEmail]       = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [minScore, setMinScore] = useState(4)
  const [filter, setFilter]     = useState('all')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/early-warning?min_score=${minScore}`)
      if (res.ok) setData(await res.json())
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [minScore])

  useEffect(() => { loadData() }, [loadData])

  const triggerScan = async () => {
    setScanning(true)
    try {
      await fetch(`${API}/api/early-warning/scan-now`)
      // Asteaptă 5s pentru background task
      setTimeout(() => { loadData(); setScanning(false) }, 5000)
    } catch (e) {
      setScanning(false)
    }
  }

  const sendEmail = async () => {
    if (!email) return
    try {
      const res = await fetch(`${API}/api/early-warning/email?to=${encodeURIComponent(email)}`, { method: 'POST' })
      if (res.ok) setEmailSent(true)
    } catch (e) {}
  }

  const signals = data?.signals || []
  const filtered = filter === 'all' ? signals : signals.filter((s: any) => s.sector === filter)
  const sectors  = [...new Set(signals.map((s: any) => s.sector))].filter(Boolean)

  return (
    <div>
      {/* Header info */}
      <div style={{ background: 'rgba(255,64,96,0.05)', border: '1px solid rgba(255,64,96,0.2)', borderRadius: 6, padding: '12px 16px', marginBottom: 20, fontSize: 11, lineHeight: 1.8, color: 'var(--muted2)' }}>
        <strong style={{ color: 'var(--red)' }}>🚨 Early Warning System</strong> — Scanează toate companiile din S&P 500 și identifică cele care aprind simultan mai multe semne de acumulare instituțională înainte ca piața să le descopere.
        <br />
        <span style={{ color: 'var(--yellow)' }}>⚠️ Nu este recomandare de investiție. Fă research propriu.</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Min score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--muted2)' }}>Semne minime:</span>
          {[3, 4, 5].map(n => (
            <button key={n} onClick={() => setMinScore(n)} style={{
              padding: '6px 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              cursor: 'pointer', borderRadius: 4, border: '1px solid',
              borderColor: minScore === n ? scoreColor(n) : 'var(--border)',
              background: minScore === n ? `${scoreColor(n)}18` : 'var(--surface)',
              color: minScore === n ? scoreColor(n) : 'var(--muted2)',
              fontWeight: minScore === n ? 700 : 400,
            }}>{n}/5</button>
          ))}
        </div>

        <button onClick={triggerScan} disabled={scanning} style={{
          padding: '7px 16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
          cursor: scanning ? 'wait' : 'pointer', borderRadius: 4,
          border: '1px solid var(--accent)', background: 'rgba(0,212,255,0.08)',
          color: 'var(--accent)', fontWeight: 700,
        }}>
          {scanning ? '⏳ Scanare...' : '🔍 Scan Acum'}
        </button>

        {data && (
          <span style={{ fontSize: 10, color: 'var(--muted2)', marginLeft: 'auto' }}>
            {data.count} semnale din {data.scanned} companii ·{' '}
            {data.scanned_at ? new Date(data.scanned_at).toLocaleTimeString('ro-RO') : ''}
          </span>
        )}
      </div>

      {/* Sector filter */}
      {sectors.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')} style={{
            padding: '5px 12px', fontSize: 10, cursor: 'pointer', borderRadius: 3,
            border: '1px solid', fontFamily: 'IBM Plex Mono, monospace',
            borderColor: filter === 'all' ? 'var(--accent)' : 'var(--border)',
            background: filter === 'all' ? 'var(--accent)' : 'var(--surface)',
            color: filter === 'all' ? 'var(--bg)' : 'var(--muted2)',
          }}>Toate</button>
          {sectors.map((s: any) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '5px 12px', fontSize: 10, cursor: 'pointer', borderRadius: 3,
              border: '1px solid', fontFamily: 'IBM Plex Mono, monospace',
              borderColor: filter === s ? 'var(--accent)' : 'var(--border)',
              background: filter === s ? 'rgba(0,212,255,0.08)' : 'var(--surface)',
              color: filter === s ? 'var(--accent)' : 'var(--muted2)',
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* Signal legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(SIGNAL_META).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--muted2)' }}>
            <span>{v.icon}</span>
            <span>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="shimmer" style={{ height: 80, borderRadius: 6 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted2)', fontSize: 13 }}>
          {data ? `Nu s-au găsit companii cu ${minScore}+ semne simultane. Încearcă cu ${minScore - 1} semne.` : 'Apasă "Scan Acum" pentru a porni scanarea.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {filtered.map((s: any, i: number) => (
            <div key={s.ticker} className="card"
              onClick={() => setSelected(selected?.ticker === s.ticker ? null : s)}
              style={{ cursor: 'pointer', transition: 'border-color 0.2s',
                borderColor: selected?.ticker === s.ticker ? scoreColor(s.score) : 'var(--border)',
                borderLeft: `3px solid ${scoreColor(s.score)}` }}>

              <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 14, alignItems: 'center' }}>
                {/* Rank */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted2)' }}>#{i + 1}</div>
                  <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 26, fontWeight: 900, color: scoreColor(s.score), lineHeight: 1 }}>{s.score}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted2)', letterSpacing: 1 }}>SEMNE</div>
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>{s.ticker}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted2)' }}>{s.name}</span>
                    <span style={{ fontSize: 9, padding: '1px 6px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 2, color: 'var(--muted2)' }}>{s.sector}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: scoreColor(s.score) }}>{scoreLabel(s.score)}</span>
                  </div>

                  {/* Signal icons + notes */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(s.signals).map(([k, active]: any) => {
                      const meta = SIGNAL_META[k]
                      if (!meta) return null
                      return (
                        <div key={k} title={s.notes[k] || meta.label}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
                            background: active ? `${meta.color}15` : 'var(--surface2)',
                            border: `1px solid ${active ? meta.color + '40' : 'var(--border)'}`,
                            borderRadius: 3, fontSize: 10,
                            color: active ? meta.color : 'var(--muted)',
                            opacity: active ? 1 : 0.4 }}>
                          <span>{meta.icon}</span>
                          <span style={{ fontSize: 9 }}>{meta.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Notes */}
                  <div style={{ marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {Object.entries(s.notes).map(([k, note]: any) => note ? (
                      <div key={k} style={{ fontSize: 10, color: 'var(--muted2)' }}>• {note}</div>
                    ) : null)}
                  </div>
                </div>

                {/* Price + change */}
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>${s.price}</div>
                  <div style={{ fontSize: 12, color: s.change_1d >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                    {s.change_1d >= 0 ? '▲' : '▼'} {Math.abs(s.change_1d)}%
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2 }}>
                    5z: <span style={{ color: s.change_5d >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {s.change_5d >= 0 ? '+' : ''}{s.change_5d}%
                    </span>
                  </div>
                  {s.pe && <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2 }}>P/E: {s.pe}</div>}
                </div>
              </div>

              {/* Expanded chart */}
              {selected?.ticker === s.ticker && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <TVChart symbol={`NASDAQ:${s.ticker}`} height={350} interval="D" studies={['STD;RSI', 'STD;MACD', 'STD;Volume']} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Email section */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
          📧 Alertă Email Zilnică
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 14, lineHeight: 1.7 }}>
          Primești automat un email în fiecare zi cu companiile care aprind <strong style={{ color: 'var(--accent)' }}>4-5 semne simultane</strong>.
          <br />
          <span style={{ fontSize: 10 }}>Necesită configurare SMTP în Railway (Gmail App Password). Vezi instrucțiunile de mai jos.</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="emailul@tau.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 14px', borderRadius: 4,
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
              outline: 'none', minWidth: 260,
            }}
          />
          <button onClick={sendEmail} disabled={!email || emailSent} style={{
            padding: '8px 18px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
            cursor: email && !emailSent ? 'pointer' : 'default', borderRadius: 4,
            border: '1px solid var(--green)', background: 'rgba(0,255,148,0.08)',
            color: emailSent ? 'var(--muted2)' : 'var(--green)', fontWeight: 700,
          }}>
            {emailSent ? '✅ Trimis!' : '📤 Trimite Test'}
          </button>
        </div>
        {emailSent && (
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--green)' }}>
            ✅ Email trimis! Verifică inbox-ul (și spam).
          </div>
        )}

        {/* SMTP Setup instructions */}
        <div style={{ marginTop: 16, padding: 14, background: 'var(--surface2)', borderRadius: 5, fontSize: 11, lineHeight: 1.8, color: 'var(--muted2)' }}>
          <strong style={{ color: 'var(--accent)' }}>⚙️ Setup Email Automat (Railway):</strong><br />
          1. Mergi la Railway → sp500-backend → <strong>Variables</strong><br />
          2. Adaugă aceste variabile:<br />
          <div style={{ margin: '8px 0', padding: '8px 12px', background: 'var(--bg)', borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace', fontSize: 10 }}>
            SMTP_USER = emailul_tau@gmail.com<br />
            SMTP_PASS = parola_aplicatie_gmail<br />
            ALERT_EMAIL = emailul_tau@gmail.com
          </div>
          3. <a href="https://myaccount.google.com/apppasswords" target="_blank" style={{ color: 'var(--accent)' }}>Generează App Password Gmail</a> (nu parola contului!)<br />
          4. Redeploy Railway → emailul vine automat zilnic la ora 9:00
        </div>
      </div>
    </div>
  )
}
