import { useState } from 'react'
import Confetti from './Confetti.jsx'
import './Intro.css'

function Intro({ onOpen, onDone }) {
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const handleClick = () => {
    if (open) return
    setOpen(true)
    onOpen() // стартира музиката (нужен е клик от потребителя)
    setTimeout(() => setLeaving(true), 2600)
    setTimeout(onDone, 3600)
  }

  return (
    <div className={`intro ${leaving ? 'leaving' : ''}`}>
      {open && <Confetti />}
      <div className="intro-inner">
        <button
          type="button"
          className={`envelope ${open ? 'open' : ''}`}
          onClick={handleClick}
          aria-label="Отвори плика"
        >
          <span className="env-back" />
          <span className="env-letter">💌</span>
          <span className="env-pocket" />
          <span className="env-flap">
            <span className="env-seal">💗</span>
          </span>
        </button>
              <h1 className="intro-title">Честит рожден ден, Алекс! 🎀</h1>
        <p className="intro-hint">Натисни плика, за да го отвориш</p>
      </div>
    </div>
  )
}

export default Intro
