import { useState } from 'react'
import Confetti from '../Confetti.jsx'
import { REASONS } from '../reasons.js'
import './Twenty.css'

const CANDLES = 20

function Cake() {
  const [lit, setLit] = useState(() => Array(CANDLES).fill(true))
  const litCount = lit.filter(Boolean).length
  const allOut = litCount === 0

  const extinguish = (i) =>
    setLit((prev) => prev.map((v, idx) => (idx === i ? false : v)))

  const blowAll = () => {
    lit.forEach((isLit, i) => {
      if (isLit) setTimeout(() => extinguish(i), i * 110)
    })
  }

  return (
    <section className="cake-section">
      <h2 className="section-title">Пожелай си нещо и духни свещите</h2>
      <p className="section-sub">
        {allOut ? 'Сега е въпрос на време, желанието ти да се сбъдне! 🎉' : `Натисни свещите една по една или всички наведнъж (${litCount} горящи)`}
      </p>

      <div className="cake">
        <div className="candles">
          {lit.map((isLit, i) => (
            <button
              key={i}
              type="button"
              className={`candle ${isLit ? 'lit' : ''}`}
              onClick={() => isLit && extinguish(i)}
              aria-label={`Свещ ${i + 1}${isLit ? '' : ' (угасена)'}`}
            >
              <span className="flame" />
              <span className="wax" />
            </button>
          ))}
        </div>
        <div className="cake-top" />
        <div className="cake-mid" />
        <div className="cake-plate" />
      </div>

      {!allOut && (
        <button type="button" className="cta" onClick={blowAll}>
          Духни свещите 💨
        </button>
      )}

      {allOut && (
        <>
          <Confetti />
          <p className="finale">Честит 20-и рожден ден, Александра! 👑</p>
          <a className="cta" href="#/video">
           Към видеото 🎬
          </a>
        </>
      )}
    </section>
  )
}

function Twenty() {
  const [opened, setOpened] = useState(() => new Set())

  const toggle = (i) =>
    setOpened((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <main className="twenty">
      <header className="twenty-head">
        <h1 className="twenty-number">20</h1>
        <p className="twenty-sub">Честит рожден ден, Александра!</p>
      </header>

      <section>
        <h2 className="section-title">20 неща, които обичам в теб</h2>
        <p className="section-sub">Докосни сърцата ({opened.size}/{REASONS.length})</p>

        <div className="cards">
          {REASONS.map((text, i) => {
            const isOpen = opened.has(i)
            return (
              <button
                key={i}
                type="button"
                className={`card ${isOpen ? 'open' : ''}`}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <span className="card-text">{text}</span>
                ) : (
                  <>
                    <span className="card-heart">💗</span>
                    <span className="card-num">{i + 1}</span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <Cake />
    </main>
  )
}

export default Twenty
