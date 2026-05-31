'use client'
import { fmtChange, fmtPrice } from '../lib/api'
import TVChart from './TVChart'

const STAT_CARDS = [
  { key: '%5EGSPC', altKey: '^GSPC', label: 'S&P 500', decimals: 0, accent: true },
  { key: '%5EVIX',  altKey: '^VIX',  label: 'VIX',     decimals: 2, neutral: true },
  { key: '%5ETNX',  altKey: '^TNX',  label: 'US 10Y',  decimals: 3 },
  { key: 'DX-Y.NYB',altKey:'DX-Y.NYB',label:'DXY',   decimals: 2 },
]

export default function OverviewPanel({ market, sectors, loading }: any) {
  const sorted = [...(sectors || [])].sort((a, b) => (b.change || 0) - (a.change || 0))

  return (
    <div>
      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {STAT_CARDS.map(c => {
          const d = market?.[c.key] || market?.[c.altKey]
          const chg = d?.change
          return (
            <div key={c.key} className="card" style={{
              padding: '14px 16px',
              borderLeft: `2px solid ${chg == null ? 'var(--border)' : chg >= 0 ? 'var(--green)' : 'var(--red)'}`,
            }}>
              <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6 }}>{c.label}</div>
              {loading || !d ? (
                <div className="shimmer" style={{ height: 28, width: 100, marginBottom: 6 }} />
              ) : (
                <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                  {fmtPrice(d.price, c.decimals)}
                </div>
              )}
              {d && <div style={{ fontSize: 11, color: chg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {chg >= 0 ? '▲' : '▼'} {fmtChange(chg)}
              </div>}
            </div>
          )
        })}
      </div>

      {/* Chart + sectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>S&P 500 — Chart Live</span>
            <span style={{ fontSize: 9, color: 'var(--muted2)' }}>SPX · TradingView</span>
          </div>
          <TVChart symbol="FOREXCOM:SPXUSD" height={380} studies={['STD;RSI','STD;MACD']} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Top sectors */}
          <div className="card" style={{ padding: 14, flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Top Sectoare Azi</div>
            {loading ? <div className="shimmer" style={{ height: 180 }} /> :
              sorted.slice(0, 6).map((s: any, i: number) => {
                const c = s.change || 0
                return (
                  <div key={s.ticker} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 10, color: 'var(--muted2)', minWidth: 16 }}>{i + 1}.</span>
                    <span style={{ fontSize: 14 }}>{s.emoji}</span>
                    <span style={{ flex: 1, fontSize: 11 }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {c >= 0 ? '+' : ''}{c.toFixed(2)}%
                    </span>
                  </div>
                )
              })
            }
          </div>

          {/* Macro quick */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Macro Snapshot</div>
            {[
              { label: 'Fed Rate', value: '5.25%', color: 'var(--yellow)' },
              { label: 'CPI YoY',  value: '3.2%',  color: 'var(--green)' },
              { label: 'VIX',      value: '13.2',   color: 'var(--green)' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ color: 'var(--muted2)' }}>{m.label}</span>
                <span style={{ color: m.color, fontWeight: 700 }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 9, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 2 }}>Heatmap S&P 500 — Live</span>
        </div>
        <div className="tradingview-widget-container" style={{ width: '100%' }}>
          <div className="tradingview-widget-container__widget" />
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js" async
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              exchanges: [], dataSource: 'SPX500', grouping: 'sector',
              blockSize: 'market_cap_basic', blockColor: 'change',
              locale: 'en', colorTheme: 'dark', hasTopBar: false,
              isZoomEnabled: true, hasSymbolTooltip: true, isMonoSize: false,
              width: '100%', height: 480,
            })}} />
        </div>
      </div>
    </div>
  )
}
