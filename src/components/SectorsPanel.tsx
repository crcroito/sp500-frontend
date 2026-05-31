'use client'
import { useState } from 'react'
import TVChart from './TVChart'

const LEADERS: Record<string, any[]> = {
  XLK:  [{t:'NVDA',n:'NVIDIA',w:21.5,b:'lead'},{t:'AAPL',n:'Apple',w:18.2,b:'lead'},{t:'MSFT',n:'Microsoft',w:16.8,b:'lead'},{t:'AVGO',n:'Broadcom',w:5.1,b:'watch'},{t:'ORCL',n:'Oracle',w:3.2,b:'watch'}],
  XLF:  [{t:'BRK.B',n:'Berkshire',w:14.2,b:'lead'},{t:'JPM',n:'JPMorgan',w:11.8,b:'lead'},{t:'V',n:'Visa',w:8.9,b:'lead'},{t:'MA',n:'Mastercard',w:7.1,b:'watch'},{t:'BAC',n:'BofA',w:4.2,b:'watch'}],
  XLV:  [{t:'LLY',n:'Eli Lilly',w:13.8,b:'lead'},{t:'UNH',n:'UnitedHealth',w:11.2,b:'lead'},{t:'JNJ',n:'J&J',w:8.1,b:'watch'},{t:'ABBV',n:'AbbVie',w:5.9,b:'watch'},{t:'MRK',n:'Merck',w:4.3,b:'watch'}],
  XLE:  [{t:'XOM',n:'Exxon',w:23.1,b:'lead'},{t:'CVX',n:'Chevron',w:15.4,b:'lead'},{t:'COP',n:'ConocoPhillips',w:7.2,b:'watch'},{t:'SLB',n:'SLB',w:4.1,b:'watch'},{t:'EOG',n:'EOG',w:3.8,b:'lag'}],
  XLY:  [{t:'AMZN',n:'Amazon',w:24.1,b:'lead'},{t:'TSLA',n:'Tesla',w:16.8,b:'lead'},{t:'HD',n:'Home Depot',w:8.9,b:'watch'},{t:'MCD',n:"McDonald's",w:4.2,b:'watch'},{t:'NKE',n:'Nike',w:2.1,b:'lag'}],
  XLP:  [{t:'COST',n:'Costco',w:14.2,b:'lead'},{t:'PG',n:'P&G',w:12.8,b:'lead'},{t:'KO',n:'Coca-Cola',w:9.1,b:'watch'},{t:'WMT',n:'Walmart',w:8.4,b:'watch'},{t:'PEP',n:'PepsiCo',w:6.3,b:'watch'}],
  XLI:  [{t:'GE',n:'GE Aerospace',w:5.8,b:'lead'},{t:'RTX',n:'RTX',w:5.2,b:'lead'},{t:'CAT',n:'Caterpillar',w:4.9,b:'watch'},{t:'HON',n:'Honeywell',w:4.1,b:'watch'},{t:'UPS',n:'UPS',w:3.2,b:'lag'}],
  XLRE: [{t:'PLD',n:'Prologis',w:12.1,b:'lead'},{t:'AMT',n:'Am. Tower',w:8.9,b:'lead'},{t:'EQIX',n:'Equinix',w:7.2,b:'watch'},{t:'SPG',n:'Simon Property',w:5.1,b:'watch'},{t:'O',n:'Realty Income',w:4.3,b:'watch'}],
  XLU:  [{t:'NEE',n:'NextEra',w:15.2,b:'lead'},{t:'SO',n:'Southern Co',w:7.8,b:'lead'},{t:'DUK',n:'Duke Energy',w:7.1,b:'watch'},{t:'AEP',n:'Am. Electric',w:4.9,b:'watch'},{t:'EXC',n:'Exelon',w:3.8,b:'lag'}],
  XLB:  [{t:'LIN',n:'Linde',w:18.4,b:'lead'},{t:'APD',n:'Air Products',w:6.1,b:'watch'},{t:'SHW',n:'Sherwin-Williams',w:5.8,b:'watch'},{t:'NEM',n:'Newmont',w:4.2,b:'watch'},{t:'FCX',n:'Freeport',w:4.0,b:'watch'}],
  XLC:  [{t:'META',n:'Meta',w:22.1,b:'lead'},{t:'GOOGL',n:'Alphabet',w:18.4,b:'lead'},{t:'GOOG',n:'Alphabet C',w:9.2,b:'lead'},{t:'NFLX',n:'Netflix',w:5.1,b:'watch'},{t:'DIS',n:'Disney',w:3.8,b:'lag'}],
}

export default function SectorsPanel({ sectors, loading }: any) {
  const [selected, setSelected] = useState<any>(null)

  const sorted = [...(sectors || [])].sort((a, b) => (b.change || 0) - (a.change || 0))

  return (
    <div>
      {/* Sector grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {loading ? <div className="shimmer" style={{ gridColumn: '1/-1', height: 200 }} /> :
          sorted.map((s: any, i: number) => {
            const c = s.change || 0
            const isSelected = selected?.ticker === s.ticker
            return (
              <div key={s.ticker} className="card" onClick={() => setSelected(s)}
                style={{ padding: '12px 14px', cursor: 'pointer', transition: 'all 0.2s',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted2)' }}>{s.ticker}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--muted2)' }}>#{i+1}</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${Math.min(100, Math.abs(c) * 10)}%`, height: '100%', background: c >= 0 ? 'var(--green)' : 'var(--red)', borderRadius: 2 }} />
                </div>
                <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 18, fontWeight: 700, color: c >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {c >= 0 ? '+' : ''}{c.toFixed(2)}%
                </div>
              </div>
            )
          })
        }
      </div>

      {/* Detail: chart + leaders */}
      {selected && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>
                {selected.emoji} {selected.name} — Chart
              </span>
            </div>
            <TVChart symbol={`AMEX:${selected.ticker}`} height={300} />
          </div>

          <div className="card">
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>
                Lideri — {selected.name}
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Ticker','Companie','Pondere','Semnal'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(LEADERS[selected.ticker] || []).map((l: any) => {
                  const bc = l.b === 'lead' ? { bg: 'rgba(0,255,148,0.1)', color: 'var(--green)', label: 'LIDER' }
                           : l.b === 'watch' ? { bg: 'rgba(255,204,0,0.1)', color: 'var(--yellow)', label: 'WATCH' }
                           : { bg: 'rgba(255,64,96,0.1)', color: 'var(--red)', label: 'LAGGARD' }
                  return (
                    <tr key={l.t}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', color: 'var(--accent)', fontWeight: 700 }}>{l.t}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', color: 'var(--muted2)', fontSize: 11 }}>{l.n}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)', fontSize: 11 }}>{l.w}%</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,37,53,0.5)' }}>
                        <span style={{ background: bc.bg, color: bc.color, padding: '2px 7px', borderRadius: 2, fontSize: 9, fontWeight: 700 }}>{bc.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
