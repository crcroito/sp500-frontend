'use client'

// ─── MACRO PANEL ─────────────────────────────────────────────
export function MacroPanel({ macro }: any) {
  const indicators = [
    { icon: '🏛️', label: 'Fed Funds Rate', value: macro?.fed_rate || '5.25%', trend: '→ Unchanged', color: 'var(--yellow)' },
    { icon: '📊', label: 'CPI (YoY)',       value: macro?.cpi || '3.2%',      trend: '↓ În scădere', color: 'var(--green)' },
    { icon: '📈', label: 'Core PCE',        value: macro?.core_pce || '2.8%', trend: '↓ Aproape de 2%', color: 'var(--green)' },
    { icon: '👷', label: 'Unemployment',    value: macro?.unemployment || '3.9%', trend: '→ Stabil', color: 'var(--accent)' },
  ]
  const calendar = [
    { day: '4', month: 'Jun', name: 'FOMC Meeting', prev: 'Anterior: 5.25-5.50%', impact: 'H' },
    { day: '6', month: 'Jun', name: 'NFP Jobs Report', prev: 'Anterior: 303K', impact: 'H' },
    { day: '12', month: 'Jun', name: 'CPI Report (May)', prev: 'Anterior: 3.2%', impact: 'H' },
    { day: '18', month: 'Jun', name: 'Retail Sales (May)', prev: 'Anterior: +0.6%', impact: 'M' },
    { day: '26', month: 'Jun', name: 'GDP Q1 Final', prev: 'Anterior: 1.3%', impact: 'H' },
  ]
  const news = [
    { src: 'Federal Reserve', txt: 'Fed menține rata la 5.25%, Powell semnalează răbdare înainte de tăieri.', time: '1z', imp: 'H' },
    { src: 'BLS', txt: 'CPI Aprilie: 3.2% YoY, sub estimările de 3.6%. Cel mai bun număr din 2024.', time: '2z', imp: 'H' },
    { src: 'Treasury', txt: 'Randamentul 10Y sub 4.4% după CPI. Favorabil pentru growth stocks.', time: '3z', imp: 'M' },
    { src: 'Goldman Sachs', txt: 'GS ridică target S&P 500 la 6,100 pentru 2025.', time: '4z', imp: 'L' },
  ]
  const impColor = (i: string) => i === 'H' ? 'var(--red)' : i === 'M' ? 'var(--yellow)' : 'var(--muted2)'
  const impLabel = (i: string) => i === 'H' ? 'MAJOR' : i === 'M' ? 'MED' : 'LOW'

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {indicators.map(m => (
          <div key={m.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 22, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 10, color: m.color }}>{m.trend}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>Calendar Economic</div>
          <div style={{ padding: '8px 14px' }}>
            {calendar.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', minWidth: 44 }}>
                  <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 20, fontWeight: 700 }}>{e.day}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase' }}>{e.month}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)' }}>{e.prev}</div>
                </div>
                <span style={{ padding: '3px 8px', borderRadius: 2, fontSize: 9, fontWeight: 700, color: impColor(e.impact), background: `${impColor(e.impact)}18`, border: `1px solid ${impColor(e.impact)}40` }}>{impLabel(e.impact)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>Știri Macro</div>
          <div style={{ padding: '8px 14px' }}>
            {news.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: impColor(n.imp), marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 9, color: 'var(--muted2)', marginBottom: 4 }}>{n.src} · {n.time}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.6 }}>{n.txt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SIGNALS PANEL ────────────────────────────────────────────
export function SignalsPanel({ market, sectors }: any) {
  const vix = market?.['%5EVIX']?.price || market?.['^VIX']?.price || 13.2
  const vixPct = Math.min(100, (vix / 40) * 100)
  const spChg = market?.['%5EGSPC']?.change || market?.['^GSPC']?.change || 0
  const fg = Math.round(100 - (vix / 40 * 100))
  const fgColor = fg > 65 ? 'var(--green)' : fg > 45 ? 'var(--yellow)' : 'var(--red)'
  const fgLabel = fg > 75 ? 'Extreme Greed' : fg > 55 ? 'Greed' : fg > 45 ? 'Neutral' : fg > 25 ? 'Fear' : 'Extreme Fear'
  const sorted = [...(sectors || [])].sort((a: any, b: any) => (b.change || 0) - (a.change || 0))

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Sentiment Piață</div>
          <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 28, fontWeight: 900, color: vixPct < 40 ? 'var(--green)' : vixPct < 65 ? 'var(--yellow)' : 'var(--red)', marginBottom: 10 }}>
            {vix < 15 ? 'GREED' : vix < 20 ? 'NEUTRAL' : vix < 30 ? 'FEAR' : 'PANIC'}
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, var(--green), var(--yellow) 50%, var(--red))', position: 'relative', marginBottom: 8 }}>
            <div style={{ position: 'absolute', top: -5, left: `${vixPct}%`, width: 16, height: 16, borderRadius: '50%', background: 'white', border: '2px solid var(--bg)', transform: 'translateX(-50%)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--muted2)' }}>
            <span>CALM</span><span>NORMAL</span><span>FRICĂ</span><span>PANIC</span>
          </div>
        </div>
        {[
          { label: 'Fear & Greed', val: fg, sub: fgLabel, color: fgColor },
          { label: 'VIX Regim', val: vix.toFixed(1), sub: vix < 15 ? 'Low Vol · Bullish' : vix < 20 ? 'Normal' : 'Elevated', color: vix < 15 ? 'var(--green)' : vix < 20 ? 'var(--yellow)' : 'var(--red)' },
          { label: 'Trend SPX', val: spChg >= 0 ? '↑' : '↓', sub: `${spChg >= 0 ? '+' : ''}${spChg.toFixed(2)}% azi`, color: spChg >= 0 ? 'var(--green)' : 'var(--red)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 32, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--muted2)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>Sectoare Recomandate · Context Macro</div>
        <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {sorted.slice(0, 3).map((s: any, i: number) => {
            const c = s.change || 0
            return (
              <div key={s.ticker} style={{ background: 'var(--surface2)', border: `1px solid ${i === 0 ? 'var(--green)' : 'var(--border)'}`, borderRadius: 6, padding: 14 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: c >= 0 ? 'var(--green)' : 'var(--red)', marginBottom: 8 }}>{c >= 0 ? '+' : ''}{c.toFixed(2)}%</div>
                {i === 0 && <span style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(0,255,148,0.1)', color: 'var(--green)', borderRadius: 2 }}>⭐ TOP PICK</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MacroPanel
