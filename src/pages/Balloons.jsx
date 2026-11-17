import { useState } from 'react'
import Confetti from '../Confetti.jsx'
import { WISHES } from '../content.js'
import './Balloons.css'

const COLORS = ['#ff4f9a', '#ffb3d1', '#c77dff', '#ffc83d', '#6ec6ff', '#ff7a7a', '#7ee0b5']

const BALLOONS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  dur: 3 + ((i * 7) % 10) / 4,
  delay: -((i * 13) % 10) / 3,
  dx: ((i * 17) % 7) - 3,
}))

export default function Balloons() {
  const [popped, setPopped] = useState(() => new Set())
  const [active, setActive] = useState(null) // { id, n } – натискания подред
  const [wish, setWish] = useState(null) // id на балона с видимо пожелание
  const [locked, setLocked] = useState(false)
  const total = BALLOONS.length

  const press = (id) => {
    if (locked || popped.has(id)) return
    const n = active?.id === id ? active.n + 1 : 1
    if (n < 3) {
      setActive({ id, n })
      return
    }
    // 3-то подред натискане: пукане, после пожелание
    setActive(null)
    setLocked(true)
    setPopped((prev) => new Set(prev).add(id))
    setTimeout(() => setWish(id), 700)
  }

  const closeWish = () => {
    setWish(null)
    setLocked(false)
    if (popped.size === total) window.location.hash = '#/awards'
  }

  const last = popped.size === total

  return (
    <main className="page">
      <h2 className="section-title">20 балона, 20 пожелания</h2>
      <p className="section-sub">
        Натисни един и същ балон 3 пъти подред, за да го спукаш ({popped.size}/{total})
      </p>

      <div className="balloons">
        {BALLOONS.map((b) => {
          const isPopped = popped.has(b.id)
          const n = active?.id === b.id ? active.n : 0
          return (
            <button
              key={b.id}
              type="button"
              className="balloon"
              disabled={isPopped}
              onClick={() => press(b.id)}
              aria-label={`Балон ${b.id + 1}`}
              style={{ '--c': b.color, '--dur': `${b.dur}s`, '--delay': `${b.delay}s`, '--dx': b.dx, '--n': n }}
            >
              {isPopped ? (
                <span className="burst" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, k) => (
                    <i key={k} style={{ '--a': `${k * 45}deg` }} />
                  ))}
                </span>
              ) : (
                <span className="b-scale">
                  <span key={n} className={`b-body ${n ? 'squish' : ''}`} />
                  <span className="b-string" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {wish !== null && (
        <div className="overlay">
          {last && <Confetti />}
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-emoji">🎈</div>
            <p className="modal-text">{WISHES[wish]}</p>
            <button type="button" className="cta" autoFocus onClick={closeWish}>
              {last ? 'Нататък →' : 'Продължи'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
