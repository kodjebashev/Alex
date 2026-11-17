import { useEffect, useRef, useState } from 'react'
import Confetti from '../Confetti.jsx'
import { SLICE_MESSAGE } from '../content.js'
import './Cake.css'

const CANDLES = 20

const TEXT = {
  light: ['Запали свещите', 'Затвори очи, пожелай си нещо хубаво и запали свещите – една по една или наведнъж'],
  blow: ['Време е да духнеш!', 'Духни силно в телефона или натисни бутона'],
  done: ['Желанието е прието! ✨', 'Честито!'],
}

/* ---------- чертеж на тортата (SVG, viewBox 420×340) ---------- */
const ellY = (cy, rx, ry, x) => cy + ry * Math.sqrt(Math.max(0, 1 - ((x - 210) / rx) ** 2))
const range = (a, b, s) => Array.from({ length: Math.floor((b - a) / s) + 1 }, (_, i) => a + i * s)

// свещите стоят в овал върху горния ярус; най-задните първи, за да се застъпват правилно
const CANDLE_POS = Array.from({ length: CANDLES }, (_, i) => {
  const t = ((i + 0.5) / CANDLES) * 2 * Math.PI
  return { i, x: 210 + 96 * Math.cos(t), y: 150 + 20 * Math.sin(t) }
}).sort((a, b) => a.y - b.y)

function CakeArt() {
  return (
    <svg className="cake-art" viewBox="0 0 420 340" aria-hidden="true">
      <defs>
        <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc9df" />
          <stop offset="1" stopColor="#ff9fc6" />
        </linearGradient>
        <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8fbf" />
          <stop offset="1" stopColor="#ff5fa2" />
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a1a4d" stopOpacity="0.25" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#7a1a4d" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* чиния */}
      <ellipse cx="210" cy="296" rx="205" ry="34" fill="rgba(120,20,70,0.25)" />
      <ellipse cx="210" cy="288" rx="205" ry="34" fill="#fff" />
      <ellipse cx="210" cy="288" rx="186" ry="28" fill="#fff0f6" />

      {/* долен ярус */}
      <path d="M50 236V282A160 36 0 0 0 370 282V236Z" fill="url(#gA)" />
      <path d="M50 236V282A160 36 0 0 0 370 282V236Z" fill="url(#shade)" />
      <ellipse cx="210" cy="236" rx="160" ry="36" fill="#fff" />
      <path d="M50 236A160 36 0 0 0 370 236" fill="none" stroke="#fff" strokeWidth="14" />
      {range(62, 358, 16).map((x) => (
        <circle key={x} cx={x} cy={ellY(236, 160, 36, x) + 7} r="7" fill="#fff" />
      ))}

      {/* горен ярус */}
      <path d="M92 150V236A118 28 0 0 0 328 236V150Z" fill="url(#gB)" />
      <path d="M92 150V236A118 28 0 0 0 328 236V150Z" fill="url(#shade)" />
      <ellipse cx="210" cy="150" rx="118" ry="28" fill="#fff" />
      <ellipse cx="210" cy="150" rx="102" ry="22" fill="#ffe6f0" />
      <path d="M92 150A118 28 0 0 0 328 150" fill="none" stroke="#fff" strokeWidth="16" />
      {range(102, 318, 16).map((x) => (
        <circle key={x} cx={x} cy={ellY(150, 118, 28, x) + 8} r="8" fill="#fff" />
      ))}

      <text
        x="210"
        y="234"
        textAnchor="middle"
        fontSize="42"
        fontWeight="800"
        fill="#ffe9a8"
        stroke="#c2347a"
        strokeWidth="1.5"
        paintOrder="stroke"
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,233,168,0.8))' }}
      >
        20
      </text>

      {/* декорации по долния ярус */}
      {range(70, 350, 35).map((x, k) => (
        <text
          key={x}
          x={x}
          y={259 + ellY(0, 160, 36, x) + 5}
          textAnchor="middle"
          fontSize="15"
        >
          {k % 2 ? '🎀' : '💗'}
        </text>
      ))}
      {range(82, 340, 43).map((x) => (
        <text key={x} x={x} y={ellY(236, 160, 36, x) + 4} textAnchor="middle" fontSize="17">
          🍓
        </text>
      ))}
    </svg>
  )
}

export default function CakePage() {
  const [states, setStates] = useState(() => Array(CANDLES).fill('unlit')) // unlit | lit | out
  const [mic, setMic] = useState('idle') // idle | on | denied
  const [slice, setSlice] = useState(false)
  const stopRef = useRef(null)

  const stage = states.includes('unlit')
    ? 'light'
    : states.every((s) => s === 'out')
      ? 'done'
      : 'blow'

  const change = (i, from, to) =>
    setStates((prev) => (prev[i] === from ? prev.map((s, k) => (k === i ? to : s)) : prev))

  const lightAll = () =>
    states.forEach((s, i) => s === 'unlit' && setTimeout(() => change(i, 'unlit', 'lit'), i * 90))

  const stopMic = () => {
    stopRef.current?.()
    stopRef.current = null
    setMic('idle')
  }

  const blowAll = () => {
    stopMic() // микрофонът не остава включен след духането
    for (let i = 0; i < CANDLES; i++) setTimeout(() => change(i, 'lit', 'out'), i * 110)
  }

  const press = (i) => {
    if (stage === 'light' && states[i] === 'unlit') change(i, 'unlit', 'lit')
    else if (stage === 'blow' && states[i] === 'lit') change(i, 'lit', 'out')
  }

  // Духане през микрофона (резервен вариант: бутонът)
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.fftSize)
      let loud = 0
      let raf = 0
      const stop = () => {
        cancelAnimationFrame(raf)
        stream.getTracks().forEach((t) => t.stop())
        ctx.close()
      }
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const v of data) sum += ((v - 128) / 128) ** 2
        const rms = Math.sqrt(sum / data.length)
        loud = rms > 0.25 ? loud + 1 : 0 // праг на силата – увеличи, ако се задейства от говор
        if (loud > 6) {
          blowAll()
          return
        }
        raf = requestAnimationFrame(tick)
      }
      stopRef.current = stop
      setMic('on')
      tick()
    } catch {
      setMic('denied')
    }
  }

  useEffect(() => () => stopRef.current?.(), [])

  const [title, sub] = TEXT[stage]
  // стаята притъмнява, щом се запали първата свещ
  const dark = stage === 'blow' || (stage === 'light' && states.includes('lit'))
  const canMic = typeof navigator !== 'undefined' && !!navigator.mediaDevices

  return (
    <main className={`page cake-page ${dark ? 'dark' : ''}`}>
      <div className={`dim ${dark ? 'on' : ''}`} />

      <div className="cake-content">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{sub}</p>

        <div className="cake">
          <CakeArt />
          {CANDLE_POS.map(({ i, x, y }) => (
            <button
              key={i}
              type="button"
              className={`candle ${states[i] === 'lit' ? 'lit' : ''}`}
              style={{ left: `${x / 4.2}%`, top: `${y / 3.4}%` }}
              onClick={() => press(i)}
              aria-label={`Свещ ${i + 1}`}
            >
              <span className="flame" />
              <span className="wax" />
              {states[i] === 'out' && <span className="smoke" />}
            </button>
          ))}
        </div>

        {stage === 'light' && (
          <button type="button" className="cta" onClick={lightAll}>Запали всички 🔥</button>
        )}

        {stage === 'blow' && (
          <div className="cake-actions">
            {canMic && mic !== 'denied' && (
              mic === 'on' ? (
                <button type="button" className="cta alt" onClick={stopMic}>Слушам… духни силно 🌬️ (откажи)</button>
              ) : (
                <button type="button" className="cta alt" onClick={startMic}>🎤 Духни в микрофона</button>
              )
            )}
            <button type="button" className="cta" onClick={blowAll}>Духни с бутон 💨</button>
            {mic === 'denied' && <p className="mic-note">Микрофонът не е разрешен – ползвай бутона.</p>}
          </div>
        )}

        {stage === 'done' && (
          <>
            <Confetti />
            <p className="finale">Честит 20-и рожден ден, Александра! 👑</p>
            <div className="cake-actions">
              <button type="button" className="cta alt" onClick={() => setSlice(true)}>Отрежи парче 🍰</button>
              <a className="cta" href="#/video">Нататък →</a>
            </div>
          </>
        )}
      </div>

      {slice && (
        <div className="overlay" onClick={() => setSlice(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-emoji">🍰</div>
            <p className="modal-text">{SLICE_MESSAGE}</p>
            <button type="button" className="cta" autoFocus onClick={() => setSlice(false)}>Затвори 💗</button>
          </div>
        </div>
      )}
    </main>
  )
}
