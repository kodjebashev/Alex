import { useState } from 'react'
import { REASONS } from '../reasons.js'
import './Twenty.css'

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
    <main className="twenty page">
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

      <a className="cta" href="#/balloons">Нататък →</a>
    </main>
  )
}

export default Twenty
