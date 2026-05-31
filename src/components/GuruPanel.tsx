'use client'
import { useState } from 'react'
import TVChart from './TVChart'

const GURUS: Record<string, any> = {
  buffett: {
    name: 'Warren Buffett', fund: 'Berkshire Hathaway', aum: '$263B', stocks: 29,
    style: 'Value · Buy & Hold', performance: '+20% anual (60 ani)', emoji: '🎩', color: '#00d4ff',
    note: 'Top 5 poziții = 65% din portofoliu total.',
    holdings: [
      {t:'AAPL',n:'Apple',w:21.99,b:'hold'},{t:'AXP',n:'American Express',w:17.43,b:'add'},
      {t:'KO',n:'Coca-Cola',w:11.56,b:'hold'},{t:'BAC',n:'Bank of America',w:9.52,b:'trim'},
      {t:'CVX',n:'Chevron',w:6.64,b:'hold'},{t:'OXY',n:'Occidental',w:4.81,b:'add'},
      {t:'KHC',n:'Kraft Heinz',w:3.90,b:'hold'},{t:'MCO',n:"Moody's",w:3.12,b:'hold'},
      {t:'CB',n:'Chubb',w:2.85,b:'add'},{t:'DVA',n:'DaVita',w:1.98,b:'hold'},
    ],
    sectors: {Financiar:35,'Consum Baz.':21,Tech:22,Energie:12,Sănătate:6,Altele:4},
  },
  ackman: {
    name: 'Bill Ackman', fund: 'Pershing Square', aum: '$13.7B', stocks: 11,
    style: 'Activist · Concentrat', performance: '+197% pe 10 ani', emoji: '🎯', color: '#ff7730',
    note: 'Pivot major Q1 2026 → Big Tech. MSFT poziție nouă $2.09B.',
    holdings: [
      {t:'BN',n:'Brookfield',w:17.62,b:'trim'},{t:'AMZN',n:'Amazon',w:17.39,b:'add'},
      {t:'UBER',n:'Uber',w:15.71,b:'trim'},{t:'MSFT',n:'Microsoft',w:15.26,b:'new'},
      {t:'QSR',n:'Restaurant Brands',w:12.20,b:'hold'},{t:'HHH',n:'Howard Hughes',w:7.10,b:'add'},
      {t:'META',n:'Meta',w:5.90,b:'trim'},{t:'CP',n:'Canadian Pacific',w:3.10,b:'trim'},
      {t:'FMCC',n:'Freddie Mac',w:2.80,b:'hold'},{t:'FNMA',n:'Fannie Mae',w:2.40,b:'hold'},
    ],
    sectors: {Tech:38,'Consum Disc.':30,'Real Estate':18,Financiar:5,Comunicații:6,Altele:3},
  },
  tepper: {
    name: 'David Tepper', fund: 'Appaloosa Management', aum: '$5.93B', stocks: 31,
    style: 'Macro · AI Hardware', performance: '+25.33% în 2025', emoji: '⚡', color: '#00ff94',
    note: 'Adăugări masive Q1: AMZN +98%, UBER +242%, VST +114%.',
    holdings: [
      {t:'AMZN',n:'Amazon',w:15.16,b:'add'},{t:'MU',n:'Micron',w:9.48,b:'add'},
      {t:'GOOG',n:'Alphabet',w:8.38,b:'hold'},{t:'UBER',n:'Uber',w:7.68,b:'add'},
      {t:'TSM',n:'Taiwan Semi',w:7.56,b:'add'},{t:'BABA',n:'Alibaba',w:6.90,b:'hold'},
      {t:'VST',n:'Vistra',w:5.80,b:'add'},{t:'SNDK',n:'SanDisk',w:4.20,b:'new'},
      {t:'TMUS',n:'T-Mobile',w:3.90,b:'hold'},{t:'META',n:'Meta',w:3.50,b:'trim'},
    ],
    sectors: {Tech:52,Comunicații:16,'Consum Disc.':15,Utilități:6,Altele:11},
  },
}

const OVERLAPS = [
  {t:'AMZN',n:'Amazon',gurus:'Ackman + Tepper',conv:'Foarte Mare',note:'Ackman +19%, Tepper +98% Q1 2026'},
  {t:'UBER',n:'Uber',gurus:'Ackman + Tepper',conv:'Mare',note:'Ambii au crescut în Q1'},
  {t:'META',n:'Meta',gurus:'Ackman + Tepper',conv:'Medie',note:'Ambii au redus — atenție'},
  {t:'MSFT',n:'Microsoft',gurus:'Ackman (nou)',conv:'Mare',note:'Poziție nouă $2.09B Q1'},
  {t:'AAPL',n:'Apple',gurus:'Buffett',conv:'Mare',note:'#1 holding, dar redus în 2024'},
]

const badgeStyle = (b: string) => {
  if (b === 'new')  return { bg: 'rgba(0,212,255,0.1)', color: 'var(--accent)', label: '🆕 NOU' }
  if (b === 'add')  return { bg: 'rgba(0,255,148,0.1)', color: 'var(--green)', label: '↑ ADD' }
  if (b === 'trim') return { bg: 'rgba(255,204,0,0.1)', color: 'var(--yellow)', label: '↓ TRIM' }
  return { bg: 'rgba(61,84,104,0.3)', color: 'var(--muted2)', label: '→ HOLD' }
}

export default function GuruPanel() {
  const [active, setActive] = useState('buffett')
  const g = GURUS[active]

  return (
    <div>
      {/* Info bar */}
      <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '12px 16px', marginBottom: 16, fontSize: 11, color: 'var(--muted2)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--accent)' }}>📋 Sursa: SEC 13F Filings Q1 2026</strong> · Fonduri cu active &gt;$100M sunt obligate să raporteze la SEC la fiecare 3 luni.
        <span style={{ color: 'var(--yellow)' }}> ⚠️ Întârziere: 45 zile față de data efectivă.</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[...Object.keys(GURUS).map(k => ({ id: k, label: `${GURUS[k].emoji} ${GURUS[k].name}` })), { id: 'overlap', label: '🔀 Overlap' }].map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: '8px 16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
            cursor: 'pointer', borderRadius: 5, border: '1px solid',
            borderColor: active === t.id ? 'var(--accent)' : 'var(--border)',
            background: active === t.id ? 'var(--accent)' : 'var(--surface)',
            color: active === t.id ? 'var(--bg)' : 'var(--muted2)',
            fontWeight: active === t.id ? 700 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overlap view */}
      {active === 'overlap' && (
        <div className="card">
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>🔀 Poziții Comune între Guru — Q1 2026</div>
          <div style={{ padding: '10px 14px 4px', fontSize: 11, color: 'var(--muted2)', background: 'rgba(0,255,148,0.04)', borderBottom: '1px solid var(--border)' }}>
            💡 Când mai mulți investitori de top cumpără același stock independent, convicția este mai mare.
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>{['Ticker','Companie','Guru(ri)','Convicție','Notă'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {OVERLAPS.map(o => (
                <tr key={o.t}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', color: 'var(--accent)', fontWeight: 700 }}>{o.t}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)' }}>{o.n}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', fontSize: 11 }}>{o.gurus}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', color: o.conv === 'Foarte Mare' ? 'var(--green)' : o.conv === 'Mare' ? 'var(--accent)' : 'var(--yellow)', fontWeight: 700, fontSize: 11 }}>{o.conv}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', fontSize: 10, color: 'var(--muted2)' }}>{o.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guru view */}
      {active !== 'overlap' && g && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div className="card">
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>{g.emoji} {g.name} — Top Holdings</span>
              <span style={{ fontSize: 9, color: 'var(--muted2)' }}>Q1 2026 · {g.aum} AUM</span>
            </div>
            <div style={{ padding: '8px 10px', fontSize: 10, color: 'var(--yellow)', background: 'rgba(255,204,0,0.05)', borderBottom: '1px solid var(--border)' }}>⚠️ {g.note}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>{['Ticker','Companie','% Port.','Mișcare Q1','Sector'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {g.holdings.map((h: any) => {
                  const bs = badgeStyle(h.b)
                  return (
                    <tr key={h.t}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', color: g.color, fontWeight: 700 }}>{h.t}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', fontSize: 11 }}>{h.n}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', fontFamily: 'Unbounded, sans-serif', fontSize: 14, fontWeight: 700, color: g.color }}>{h.w}%</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)' }}>
                        <span style={{ background: bs.bg, color: bs.color, padding: '2px 7px', borderRadius: 2, fontSize: 9, fontWeight: 700 }}>{bs.label}</span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', fontSize: 10, color: 'var(--muted2)' }}>—</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Profil Fond</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[{l:'AUM',v:g.aum},{l:'Poziții',v:g.stocks}].map(i => (
                  <div key={i.l} style={{ background: 'var(--surface2)', borderRadius: 5, padding: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--muted2)', marginBottom: 4 }}>{i.l}</div>
                    <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 16, fontWeight: 700, color: g.color }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted2)', marginBottom: 4 }}>STIL</div>
              <div style={{ fontSize: 11, marginBottom: 10 }}>{g.style}</div>
              <div style={{ fontSize: 9, color: 'var(--muted2)', marginBottom: 4 }}>PERFORMANȚĂ</div>
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700 }}>{g.performance}</div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Sectoare</div>
              {Object.entries(g.sectors).map(([s, pct]: any) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ minWidth: 90, fontSize: 10, color: 'var(--muted2)' }}>{s}</div>
                  <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: g.color, opacity: 0.8 }} />
                  </div>
                  <div style={{ minWidth: 28, fontSize: 10, textAlign: 'right' }}>{pct}%</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>
                Chart — {g.holdings[0].t}
              </div>
              <TVChart symbol={`NASDAQ:${g.holdings[0].t}`} height={160} interval="3M" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
