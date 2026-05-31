'use client'
import { useState } from 'react'
import TVChart from './TVChart'

const GEMS = [
  { t:'NVDA', n:'NVIDIA Corp',        sector:'tech',   emoji:'💻', score:97, growth:122, margin:55, peg:1.2, smart:95, rev:'$44.1B (+122%)', catalyst:'Blackwell GPU + CUDA moat + AI datacenter', risk:'Valuare ridicată', color:'#00d4ff', inst:'+18%', gurus:'Tepper, hedge funds' },
  { t:'META', n:'Meta Platforms',     sector:'tech',   emoji:'📱', score:94, growth:27,  margin:38, peg:0.9, smart:88, rev:'$56.3B (+16%)',  catalyst:'AI Ads + Llama + WhatsApp', risk:'Reglementare EU', color:'#0088ff', inst:'+12%', gurus:'Ackman, Tepper' },
  { t:'LLY',  n:'Eli Lilly',          sector:'health', emoji:'⚕️', score:93, growth:56,  margin:29, peg:1.4, smart:91, rev:'$19.8B (+56%)',  catalyst:'GLP-1 Mounjaro/Zepbound = piață $100B+', risk:'Competiție Novo Nordisk', color:'#ff6b35', inst:'+22%', gurus:'Multiple funds' },
  { t:'AMZN', n:'Amazon.com',         sector:'tech',   emoji:'🛍️', score:92, growth:13,  margin:9,  peg:1.1, smart:96, rev:'$187B (+13%)',   catalyst:'AWS AI + advertising +28% YoY', risk:'Antitrust', color:'#ff9f0a', inst:'+31%', gurus:'Ackman (+19%), Tepper (+98%)' },
  { t:'AVGO', n:'Broadcom Inc',       sector:'tech',   emoji:'🔧', score:90, growth:44,  margin:51, peg:1.3, smart:87, rev:'$14.9B (+44%)',  catalyst:'Custom AI chips XPU + VMware', risk:'Concentrare clienți', color:'#bf5af2', inst:'+15%', gurus:'Multiple funds' },
  { t:'UBER', n:'Uber Technologies',  sector:'tech',   emoji:'🚗', score:89, growth:18,  margin:17, peg:1.0, smart:90, rev:'$43B (+18%)',    catalyst:'AV partnerships + delivery + intl', risk:'Reglementare', color:'#00ff94', inst:'+38%', gurus:'Ackman (15.7%), Tepper (+242%)' },
  { t:'MSFT', n:'Microsoft Corp',     sector:'tech',   emoji:'🪟', score:88, growth:17,  margin:43, peg:1.6, smart:85, rev:'$70B (+17%)',    catalyst:'Azure AI + Copilot + Office AI', risk:'Competiție AWS', color:'#00d4ff', inst:'+8%',  gurus:'Ackman (nou $2.09B)' },
  { t:'MU',   n:'Micron Technology',  sector:'tech',   emoji:'🧠', score:87, growth:38,  margin:22, peg:0.8, smart:82, rev:'$8.7B (+38%)',   catalyst:'HBM3E pentru NVDA + AI supercycle', risk:'Ciclu semicon.', color:'#ffd600', inst:'+25%', gurus:'Tepper (9.48%)' },
  { t:'TSM',  n:'Taiwan Semiconductor',sector:'tech',  emoji:'🏭', score:86, growth:35,  margin:42, peg:1.1, smart:79, rev:'$25.5B (+35%)',  catalyst:'2nm ramp + AI chip demand', risk:'Geopolitic Taiwan', color:'#ff4060', inst:'+11%', gurus:'Tepper (7.56%)' },
  { t:'GOOGL',n:'Alphabet Inc',       sector:'tech',   emoji:'🔍', score:85, growth:12,  margin:30, peg:0.8, smart:76, rev:'$90B (+12%)',    catalyst:'Gemini 2.0 + Waymo + GCloud', risk:'Antitrust DOJ', color:'#30d158', inst:'+5%',  gurus:'Tepper (8.38%)' },
  { t:'WELL', n:'Welltower Inc',      sector:'health', emoji:'🏥', score:82, growth:22,  margin:18, peg:1.3, smart:78, rev:'$2.9B (+22%)',   catalyst:'Senior housing + aging demographics', risk:'Rate environment', color:'#64d2ff', inst:'+19%', gurus:'Institutional funds' },
  { t:'ANET', n:'Arista Networks',    sector:'tech',   emoji:'🌐', score:81, growth:24,  margin:35, peg:1.4, smart:74, rev:'$1.9B (+24%)',   catalyst:'AI datacenter networking 800G', risk:'Concentrare clienți', color:'#ff7730', inst:'+14%', gurus:'Institutional' },
]

function scoreColor(s: number) {
  return s >= 90 ? 'var(--green)' : s >= 80 ? 'var(--accent)' : 'var(--yellow)'
}
function scoreLabel(s: number) {
  return s >= 90 ? '💎 GEM' : s >= 80 ? '⭐ STRONG' : '👀 WATCH'
}

export default function GemPanel() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('score')
  const [selected, setSelected] = useState<any>(null)

  const filtered = GEMS
    .filter(g => filter === 'all' || g.sector === filter)
    .sort((a, b) => sort === 'growth' ? b.growth - a.growth : sort === 'peg' ? a.peg - b.peg : sort === 'smart' ? b.smart - a.smart : b.score - a.score)

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {[{id:'all',l:'Toate'},{id:'tech',l:'💻 Tech'},{id:'health',l:'⚕️ Sănătate'},{id:'consumer',l:'🛍️ Consumer'}].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, cursor: 'pointer',
            borderRadius: 4, border: '1px solid', borderColor: filter === f.id ? 'var(--yellow)' : 'var(--border)',
            background: filter === f.id ? 'var(--yellow)' : 'var(--surface)',
            color: filter === f.id ? 'var(--bg)' : 'var(--muted2)', fontWeight: filter === f.id ? 700 : 400,
          }}>{f.l}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--muted2)' }}>Sortare:</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
            padding: '6px 10px', borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
          }}>
            <option value="score">Gem Score</option>
            <option value="growth">Revenue Growth</option>
            <option value="peg">PEG Ratio</option>
            <option value="smart">Smart Money</option>
          </select>
        </div>
      </div>

      {/* Gem list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {filtered.map((g, i) => (
          <div key={g.t} className="card" onClick={() => setSelected(selected?.t === g.t ? null : g)}
            style={{ cursor: 'pointer', borderColor: selected?.t === g.t ? g.color : 'var(--border)', transition: 'border-color 0.2s' }}>
            <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '50px 1fr 80px', gap: 14, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--muted2)' }}>#{i + 1}</div>
                <div style={{ fontSize: 24 }}>{g.emoji}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ color: g.color, fontWeight: 700, fontSize: 15 }}>{g.t}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted2)' }}>{g.n}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor(g.score) }}>{scoreLabel(g.score)}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted2)', lineHeight: 1.6, marginBottom: 6 }}>{g.catalyst}</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 10 }}>
                  <span><span style={{ color: 'var(--muted2)' }}>Rev:</span> <span style={{ color: 'var(--green)', fontWeight: 700 }}>{g.rev}</span></span>
                  <span><span style={{ color: 'var(--muted2)' }}>Marjă:</span> <span style={{ color: 'var(--accent)', fontWeight: 700 }}> {g.margin}%</span></span>
                  <span><span style={{ color: 'var(--muted2)' }}>PEG:</span> <span style={{ color: g.peg < 1 ? 'var(--green)' : g.peg < 1.5 ? 'var(--yellow)' : 'var(--red)', fontWeight: 700 }}> {g.peg}</span></span>
                  <span><span style={{ color: 'var(--muted2)' }}>Smart $:</span> <span style={{ color: 'var(--yellow)', fontWeight: 700 }}> {g.inst}</span></span>
                  <span style={{ color: 'var(--muted2)' }}>👥 {g.gurus}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 30, fontWeight: 900, color: scoreColor(g.score), lineHeight: 1 }}>{g.score}</div>
                <div style={{ fontSize: 9, color: 'var(--muted2)', letterSpacing: 1 }}>GEM SCORE</div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${g.score}%`, height: '100%', background: scoreColor(g.score) }} />
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {selected?.t === g.t && (
              <div style={{ borderTop: '1px solid var(--border)' }}>
                <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, borderBottom: '1px solid var(--border)' }}>
                  {[
                    { label: 'CATALYST', val: g.catalyst, color: 'var(--green)' },
                    { label: 'FINANCIARE', val: g.rev, color: 'var(--text)' },
                    { label: 'RISCURI', val: g.risk, color: 'var(--red)' },
                  ].map(c => (
                    <div key={c.label} style={{ background: 'var(--surface2)', borderRadius: 5, padding: 12 }}>
                      <div style={{ fontSize: 9, color: 'var(--muted2)', marginBottom: 6 }}>{c.label}</div>
                      <div style={{ fontSize: 11, lineHeight: 1.6, color: c.color }}>{c.val}</div>
                    </div>
                  ))}
                </div>
                <TVChart symbol={`NASDAQ:${g.t}`} height={350} interval="W" studies={['STD;RSI','STD;MACD']} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
