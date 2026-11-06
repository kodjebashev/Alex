import { useState } from 'react'
import './Confetti.css'

const COLORS = ['#ff4f9a', '#fff', '#ffd1e6', '#ffc83d', '#c77dff', '#ff8fbd']

function makePieces(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.8 + Math.random() * 2.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 8 + Math.random() * 8,
    spin: 360 + Math.random() * 720,
    drift: Math.random() * 120 - 60,
    heart: Math.random() < 0.25,
  }))
}

// Показва се веднъж при монтиране
export default function Confetti() {
  const [pieces] = useState(() => makePieces(80))
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="piece"
          style={{
            left: `${p.left}%`,
            fontSize: p.size * 1.6,
            width: p.heart ? 'auto' : p.size,
            height: p.heart ? 'auto' : p.size * 0.6,
            background: p.heart ? 'none' : p.color,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
            '--spin': `${p.spin}deg`,
            '--drift': `${p.drift}px`,
          }}
        >
          {p.heart ? '💗' : ''}
        </span>
      ))}
    </div>
  )
}
