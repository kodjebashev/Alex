import { useState } from 'react'
import './FloatingEmojis.css'

// Списък с емоджита – добави или махни по желание
const EMOJIS = ['💗', '💖', '💕', '💓', '💞', '💘', '💝', '🩷', '❤️', '🎀', '🎀']
const COUNT = 9 // колко емоджита се виждат едновременно

// Приблизителната зона, която заема екранът с видеото (за да не се застъпват)
function screenRect() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const nav = 64 // височина на навигацията
  const pad = vw <= 640 ? 16 : 24
  const w = Math.min(1100, vw - pad * 2)
  const h = Math.min((w * 9) / 16, vh - nav - 48)
  const m = 10
  const centerY = nav + (vh - nav) / 2
  return {
    left: (vw - w) / 2 - m,
    right: (vw + w) / 2 + m,
    top: centerY - h / 2 - m,
    bottom: centerY + h / 2 + m,
  }
}

function pickSpot(size) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const r = screenRect()
  let x = 0
  let y = 0
  for (let i = 0; i < 40; i++) {
    x = Math.random() * Math.max(vw - size, 1)
    y = Math.random() * Math.max(vh - size, 1)
    const overlaps =
      x + size > r.left && x < r.right && y + size > r.top && y < r.bottom
    if (!overlaps) break
  }
  return { x, y }
}

let nextId = 0

function roll(firstTime) {
  const size = 28 + Math.random() * 40
  const { x, y } = pickSpot(size)
  return {
    id: nextId++,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x,
    y,
    size,
    dur: 8 + Math.random() * 5, // 8–13 секунди – бавно
    delay: firstTime ? Math.random() * 7 : 0.5 + Math.random() * 3,
    rot: Math.random() * 40 - 20,
  }
}

export default function FloatingEmojis() {
  const [items, setItems] = useState(() =>
    Array.from({ length: COUNT }, () => roll(true)),
  )

  const respawn = (index) =>
    setItems((prev) => prev.map((it, i) => (i === index ? roll(false) : it)))

  return (
    <div className="floaters" aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={it.id}
          className="floater"
          style={{
            left: it.x,
            top: it.y,
            fontSize: it.size,
            '--dur': `${it.dur}s`,
            '--delay': `${it.delay}s`,
            '--rot': `${it.rot}deg`,
          }}
          onAnimationEnd={() => respawn(i)}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  )
}
