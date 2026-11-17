import { useState } from 'react'
import Confetti from '../Confetti.jsx'
import { AWARDS, SPECIAL, SPEECH } from '../content.js'
import './Awards.css'

function Award({ award, onReveal }) {
  const [phase, setPhase] = useState('closed') // closed → opening → revealed

  const open = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    setTimeout(() => {
      setPhase('revealed')
      onReveal()
    }, 2000)
  }

  return (
    <article className={`award ${phase}`}>
      {award.image && <img className="award-img" src={award.image} alt="" />}
      <h3 className="award-cat">{award.category}</h3>

      <p className="nominees-label">Номинирани</p>
      <ul className="nominees">
        {award.nominees.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      {phase === 'revealed' ? (
        <div className="award-win">
          <span className="sparkles" aria-hidden="true">
            {Array.from({ length: 8 }, (_, k) => (
              <i key={k} style={{ '--a': `${k * 45}deg` }}>✨</i>
            ))}
          </span>
          <p className="award-label">🏆 Победителят е</p>
          <p className="award-name">{award.winner ?? 'Александра'} 👑</p>
          <p className="award-note">{award.note}</p>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="gold-env"
            onClick={open}
            disabled={phase === 'opening'}
            aria-label="Отвори плика"
          >
            <span className="ge-card">🏆</span>
            <span className="ge-front" />
            <span className="ge-flap" />
          </button>
          <p className={phase === 'opening' ? 'drums' : 'award-hint'}>
            {phase === 'opening' ? '🥁 барабани… 🥁' : 'Натисни плика'}
          </p>
        </>
      )}
    </article>
  )
}

export default function Awards() {
  const [count, setCount] = useState(0)
  const all = count === AWARDS.length

  return (
    <main className="page">
      <div className="aw-stage">
        <span className="spot spot-l">
          <span className="spot-cone" />
          <span className="spot-lamp" />
        </span>
        <span className="spot spot-c">
          <span className="spot-cone" />
          <span className="spot-lamp" />
        </span>
        <span className="spot spot-r">
          <span className="spot-cone" />
          <span className="spot-lamp" />
        </span>
        <div className="aw-content">
          <header className="aw-head">
            <p className="aw-kicker">★ Наградите ★</p>
            <h2 className="aw-title">ОСКАРИ</h2>
            <p className="aw-by">на Александра · 20 години</p>
            <p className="aw-sub">Разкрити: {count}/{AWARDS.length}</p>
          </header>

          <div className="awards">
            {AWARDS.map((a, i) => (
              <Award key={i} award={a} onReveal={() => setCount((c) => c + 1)} />
            ))}
          </div>

          {all && <Confetti />}
          {all && (
            <section className="special">
              <div className="award-trophy">🏆</div>
              <h3 className="award-cat">{SPECIAL.category}</h3>
              <p className="award-name">Александра 👑</p>
              <p className="award-note">{SPECIAL.text}</p>
              <div className="speech">
                <p className="speech-title">🎤 Речта на победителката</p>
                <p>{SPEECH}</p>
              </div>
            </section>
          )}
        </div>
      </div>
      <a className="cta" href="#/cake">Нататък →</a>
    </main>
  )
}
