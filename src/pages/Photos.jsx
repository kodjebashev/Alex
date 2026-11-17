import { useEffect, useRef, useState } from 'react'
import { COVER_PHOTO, PHOTOS } from '../content.js'
import './Photos.css'

const CAPTIONS = [
  'Усмихни се! 📸',
  'Щрак! ✨',
  'Снимката излиза…',
  '…и пада на земята…',
  '',
]

/* ---------- Instax mini 13, Dreamy Purple – изглед отпред (SVG) ----------
   Построен по техническата спецификация: пропорции 1 : 1.182, цветове #C7BBD8 / #D6CCE5 / #9E90B5,
   вертикални ребра отляво и отдясно, визьор, самоснимачка с оранжев LED пръстен, светкавица,
   светлинни сензори, вертикален надпис „instax / mini 13“ и петстепенен обектив
   с огледалце за селфи. Единица = 3 × мм; центърът на панела е (158.25, 187.05). */
const LX = 193.1 // обектив: X +11 %
const LY = 239.4 // обектив: Y −14 %
const KNURL = [-30, -24, -18, -12, -6, 0, 6, 12, 18, 24, 30, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210]

function Camera() {
  return (
    <svg className="cam" viewBox="0 0 316.5 388" aria-hidden="true">
      <defs>
        <radialGradient id="body" cx="0.35" cy="0.28" r="0.9">
          <stop offset="0" stopColor="#D6CCE5" />
          <stop offset="0.55" stopColor="#C7BBD8" />
          <stop offset="1" stopColor="#9E90B5" />
        </radialGradient>
        <linearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.55" stopColor="#9E90B5" stopOpacity="0" />
          <stop offset="1" stopColor="#9E90B5" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="sheen" cx="0.3" cy="0.2" r="0.65">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mound" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#D6CCE5" />
          <stop offset="1" stopColor="#B2A5C7" />
        </radialGradient>
        <linearGradient id="modeRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DDD3EA" />
          <stop offset="0.5" stopColor="#C7BBD8" />
          <stop offset="1" stopColor="#9E90B5" />
        </linearGradient>
        <radialGradient id="tube" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#D6CCE5" />
          <stop offset="0.6" stopColor="#C7BBD8" />
          <stop offset="1" stopColor="#A99BC0" />
        </radialGradient>
        <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#EAECEF" />
          <stop offset="1" stopColor="#9aa0aa" />
        </linearGradient>
        <radialGradient id="glass" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#4a4f95" />
          <stop offset="0.35" stopColor="#1a1d3d" />
          <stop offset="1" stopColor="#0B0D14" />
        </radialGradient>
        <linearGradient id="coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b6bff" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#3d7bff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#3de0c8" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="led" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFA057" />
          <stop offset="1" stopColor="#FF7B2E" />
        </linearGradient>
        <radialGradient id="btn" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ddd3ea" />
          <stop offset="1" stopColor="#bdb0d0" />
        </radialGradient>
        <linearGradient id="lamp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b919c" />
          <stop offset="0.5" stopColor="#e3e6ec" />
          <stop offset="1" stopColor="#8b919c" />
        </linearGradient>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3b2a66" floodOpacity="0.35" />
        </filter>
        <clipPath id="bodyClip">
          <rect x="4" y="4" width="308.5" height="366.1" rx="66" />
        </clipPath>
        <path id="ringArc" d="M107.4 224.3A87 87 0 0 1 170.6 155.4" />
        <path id="microArc" d="M158.1 239.4A35 35 0 1 1 228.1 239.4A35 35 0 1 1 158.1 239.4" />
      </defs>

      <ellipse cx="158" cy="379" rx="118" ry="8" fill="rgba(60,30,110,0.28)" />

      {/* корпус: ръб + леко изпъкнала предна част */}
      <rect x="0" y="0" width="316.5" height="374.1" rx="69.6" fill="#B3A5C8" />
      <rect x="4" y="4" width="308.5" height="366.1" rx="66" fill="url(#body)" />
      <g clipPath="url(#bodyClip)">
        {/* вертикални ребра: 3 отляво, 4 отдясно */}
        {[14, 25, 36, 268, 280, 292, 304].map((c) => (
          <rect key={c} x={c - 4.5} y="20" width="9" height="334" rx="4.5" fill="url(#rib)" />
        ))}
        <rect x="4" y="4" width="308.5" height="366.1" fill="url(#sheen)" />
      </g>
      <rect x="4" y="4" width="308.5" height="366.1" rx="66" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* отвор за снимката отгоре (66 × 3 мм) */}
      <rect x="59.25" y="6" width="198" height="9" rx="4.5" fill="#5f5372" />
      <rect x="62" y="13" width="192" height="1.5" rx="0.75" fill="#fff" opacity="0.25" />

      {/* ---------- обектив (5 нива) ---------- */}
      <circle cx={LX} cy={LY} r="114" fill="url(#mound)" filter="url(#drop)" />
      <circle cx={LX} cy={LY} r="96" fill="url(#modeRing)" stroke="#9E90B5" strokeWidth="1.5" />
      {KNURL.map((a) => (
        <line
          key={a}
          x1={LX + 90}
          y1={LY}
          x2={LX + 96}
          y2={LY}
          stroke="#8b7ea6"
          strokeWidth="1.6"
          strokeOpacity="0.8"
          transform={`rotate(${a} ${LX} ${LY})`}
        />
      ))}
      <text fontSize="5.8" fontWeight="700" letterSpacing="0.6" fill="#7d6f96">
        <textPath href="#ringArc" startOffset="4%">OFF · ON · CLOSE-UP</textPath>
      </text>
      <circle cx={LX} cy={LY} r="75" fill="url(#tube)" stroke="#A99BC0" strokeWidth="1.5" />
      <circle cx={LX} cy={LY} r="69" fill="none" stroke="#000" strokeOpacity="0.07" strokeWidth="2" />
      {/* огледалце за селфи – на 9 часа */}
      <rect x="123.6" y="224.4" width="21" height="30" rx="6" fill="url(#chrome)" stroke="#9aa0aa" strokeWidth="1" />
      <rect x="127" y="228" width="5" height="14" rx="2.5" fill="#fff" opacity="0.7" />
      {/* оптично ядро */}
      <circle cx={LX} cy={LY} r="42" fill="#121316" />
      <circle cx={LX} cy={LY} r="39" fill="none" stroke="#24262d" strokeWidth="1.5" />
      <text fontSize="3.4" fill="#c9cad2" opacity="0.75">
        <textPath href="#microArc" textLength="212" lengthAdjust="spacing">
          INSTAX LENS 60mm 1:12.7 FOCUS RANGE 0.3m - ∞
        </textPath>
      </text>
      <circle cx={LX} cy={LY} r="29" fill="none" stroke="#2a2c34" strokeWidth="1.5" />
      <circle cx={LX} cy={LY} r="26" fill="url(#glass)" />
      <circle cx={LX} cy={LY} r="26" fill="url(#coat)" />
      <circle cx={LX} cy={LY} r="26" fill="none" stroke="#6a55c8" strokeOpacity="0.6" strokeWidth="1.2" />
      <ellipse cx={LX - 9} cy={LY - 10} rx="8" ry="4.5" fill="#fff" opacity="0.65" transform={`rotate(-35 ${LX - 9} ${LY - 10})`} />
      <circle cx={LX + 10} cy={LY + 11} r="2.6" fill="#fff" opacity="0.3" />

      {/* ---------- самоснимачка + спусък (отляво, по средата) ---------- */}
      <circle cx="69.6" cy="164.6" r="36" fill="url(#modeRing)" stroke="#9E90B5" strokeWidth="1.5" />
      <rect x="64.6" y="193" width="10" height="9" rx="3" fill="#C7BBD8" stroke="#9E90B5" strokeWidth="1.2" />
      <circle cx="69.6" cy="164.6" r="25" fill="none" stroke="#FF7B2E" strokeWidth="7.5" opacity="0.8" filter="url(#glow)" className="led" />
      <circle cx="69.6" cy="164.6" r="25" fill="none" stroke="url(#led)" strokeWidth="7.5" className="led" />
      <g className="shutter">
        <circle cx="69.6" cy="164.6" r="21" fill="url(#btn)" stroke="#9E90B5" strokeWidth="1" />
        <ellipse cx="63" cy="157" rx="8" ry="4.5" fill="#fff" opacity="0.5" />
      </g>

      {/* ---------- визьор (горе вляво) ---------- */}
      <rect x="47.1" y="53.1" width="45" height="51" rx="14" fill="#9E90B5" />
      <rect x="51" y="57" width="37" height="43" rx="11" fill="#0b0b10" />
      <rect x="57" y="66" width="25" height="26" rx="6" fill="#7788b8" opacity="0.45" />
      <rect x="60" y="69" width="5" height="18" rx="2.5" fill="#fff" opacity="0.45" />

      {/* ---------- светкавица (вертикална капсула) ---------- */}
      <rect x="99.3" y="30.6" width="42" height="96" rx="21" fill="#fff" opacity="0.18" />
      <rect className="flash-win" x="102" y="33.3" width="36.6" height="90.6" rx="18.3" fill="#F4F6FA" stroke="#cfd2da" strokeWidth="2.2" />
      {Array.from({ length: 9 }, (_, k) => (
        <line key={k} x1={106.6 + k * 3.6} y1="44" x2={106.6 + k * 3.6} y2="113" stroke="#d3d8e2" strokeWidth="1" />
      ))}
      <rect x="106" y="75" width="28.6" height="6" rx="3" fill="url(#lamp)" />

      {/* ---------- светлинни сензори ---------- */}
      <rect x="168.2" y="50" width="18" height="42" rx="9" fill="#B0A3C5" stroke="#9E90B5" strokeWidth="1" />
      <circle cx="177.2" cy="62" r="5.2" fill="#0b0b0f" />
      <circle cx="177.2" cy="80" r="5.2" fill="#0b0b0f" />
      <circle cx="175.4" cy="60.2" r="1.3" fill="#fff" opacity="0.5" />
      <circle cx="175.4" cy="78.2" r="1.3" fill="#fff" opacity="0.5" />

      {/* ---------- вертикален надпис (чете се отгоре надолу) ---------- */}
      <text
        transform="translate(226 60) rotate(90)"
        fontSize="15"
        fontWeight="700"
        letterSpacing="1.2"
        fill="#F8F8FA"
        fontFamily="'Century Gothic', Futura, 'Avenir Next', Montserrat, 'Trebuchet MS', sans-serif"
      >
        mini 13
      </text>
      <text
        transform="translate(246 52) rotate(90)"
        fontSize="20"
        fontWeight="700"
        letterSpacing="1.5"
        fill="#F8F8FA"
        fontFamily="'Century Gothic', Futura, 'Avenir Next', Montserrat, 'Trebuchet MS', sans-serif"
      >
        instax
      </text>
    </svg>
  )
}

/* ---------- снимка във формат Instax mini ---------- */
function Card({ n, src, date, developed, onClick, style }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`card ${developed ? 'developed' : ''}`}
      onClick={onClick}
      style={style}
      aria-label={onClick ? `Снимка ${n}${developed ? '' : ' – докосни, за да се проявят цветовете'}` : undefined}
    >
      <span className="card-img">
        <span className="ph">
          💗<small>{n}</small>
        </span>
        {src && (
          <img
            src={src}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <span className="tap">докосни</span>
      </span>
      <span className="card-date">{date}</span>
    </Tag>
  )
}

export default function Photos({ active }) {
  const [phase, setPhase] = useState(0) // 0 чака, 1 щрак, 2 излиза, 3 пада, 4 в албума
  const [dev, setDev] = useState(() => new Set()) // проявени снимки
  const startedRef = useRef(false)
  const albumRef = useRef(null)

  // анимацията тръгва при първото отваряне на страницата
  useEffect(() => {
    if (!active || startedRef.current) return
    startedRef.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const steps = reduce
      ? [[0, 4]]
      : [[900, 1], [1700, 2], [3600, 3], [4900, 4]]
    steps.forEach(([ms, p]) =>
      setTimeout(() => {
        setPhase(p)
        if (p === 4) albumRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, ms),
    )
  }, [active])

  const develop = (key) => setDev((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  const total = PHOTOS.length + 1
  const all = dev.size === total

  return (
    <main className="page photos-page">
      <section className="cam-scene">
        <div className="cam-wrap" data-phase={phase}>
          <Camera />
          <div className="cam-photo">
            <Card n="★" src={COVER_PHOTO.src} date={COVER_PHOTO.date} developed={false} />
          </div>
        </div>
        <p className="cam-cap">{CAPTIONS[phase]}</p>
      </section>

      {phase === 1 && <div className="flash-screen" />}

      <section className="album" ref={albumRef}>
        <div className="album-page">
          <h2 className="section-title">Нашият албум</h2>
          <p className="section-sub">
            Докосни всяка снимка, за да се проявят цветовете ({dev.size}/{total})
          </p>

          <div className={`featured ${phase >= 4 ? 'in' : ''}`}>
            <Card
              n="★"
              src={COVER_PHOTO.src}
              date={COVER_PHOTO.date}
              developed={dev.has('cover')}
              onClick={() => develop('cover')}
            />
          </div>

          <div className="grid">
            {PHOTOS.map((p, i) => (
              <Card
                key={i}
                n={i + 1}
                src={p.src}
                date={p.date}
                developed={dev.has(i)}
                onClick={() => develop(i)}
                style={{ '--r': `${(((i * 37) % 7) - 3) * 0.7}deg` }}
              />
            ))}
          </div>

          {all && <p className="all-done">Всички спомени са проявени 💗</p>}
        </div>
      </section>

      <a className="cta" href="#/20">Нататък →</a>
    </main>
  )
}
