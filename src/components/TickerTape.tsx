'use client'
import { useEffect } from 'react'

export default function TickerTape() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'NASDAQ:NDX',      title: 'NASDAQ 100' },
        { proName: 'CBOE:VIX',        title: 'VIX' },
        { proName: 'TVC:US10Y',       title: 'US 10Y' },
        { proName: 'TVC:DXY',         title: 'DXY' },
        { proName: 'TVC:GOLD',        title: 'Gold' },
        { proName: 'NASDAQ:AAPL',     title: 'Apple' },
        { proName: 'NASDAQ:NVDA',     title: 'NVIDIA' },
        { proName: 'NASDAQ:MSFT',     title: 'Microsoft' },
        { proName: 'NASDAQ:META',     title: 'Meta' },
        { proName: 'NASDAQ:AMZN',     title: 'Amazon' },
        { proName: 'NASDAQ:TSLA',     title: 'Tesla' },
      ],
      showSymbolLogo: true,
      colorTheme: 'dark',
      isTransparent: true,
      displayMode: 'adaptive',
      locale: 'en',
    })
    const container = document.getElementById('ticker-tape-widget')
    if (container && !container.hasChildNodes()) container.appendChild(script)
  }, [])

  return (
    <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', height: 46, overflow: 'hidden' }}>
      <div className="tradingview-widget-container" style={{ height: 46 }}>
        <div id="ticker-tape-widget" className="tradingview-widget-container__widget" style={{ height: 46 }} />
      </div>
    </div>
  )
}
