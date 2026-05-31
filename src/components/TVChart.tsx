'use client'
import { useEffect, useRef } from 'react'

interface TVChartProps {
  symbol: string
  height?: number
  interval?: string
  studies?: string[]
}

export default function TVChart({ symbol, height = 400, interval = 'D', studies = ['STD;RSI'] }: TVChartProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const container = document.createElement('div')
    container.className = 'tradingview-widget-container__widget'
    ref.current.appendChild(container)

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true, height,
      symbol, interval,
      timezone: 'Europe/Bucharest',
      theme: 'dark', style: '1', locale: 'ro',
      backgroundColor: 'rgba(11,15,20,1)',
      gridColor: 'rgba(26,37,53,0.4)',
      hide_top_toolbar: false,
      save_image: false,
      studies,
      support_host: 'https://www.tradingview.com',
    })
    ref.current.appendChild(script)
  }, [symbol, height, interval])

  return <div ref={ref} className="tradingview-widget-container" style={{ width: '100%' }} />
}
