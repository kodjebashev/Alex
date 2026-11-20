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

/* ---------- Fujifilm Instax Mini 13 (Dreamy Purple) – без надпис ----------
   Мащаб: 1 мм = 3 SVG единици (тяло 105.5 × 124.7 мм → 316.5 × 374.1, съотношение 1 : 1.182).
   Център на предния панел: (158.25, 187.05). Център на обектива: (192, 238). */
const LX = 192
const LY = 238

function Camera({ onSnap }) {
    return (
        <svg
            className="cam"
            viewBox="0 0 316.5 388"
            onClick={onSnap}
            style={{ cursor: onSnap ? 'pointer' : 'default' }}
            aria-hidden="true"
        >
            <defs>
                {/* Кремаво-пастелен лавандулов корпус (Dreamy Purple) */}
                <radialGradient id="dpBody" cx="0.36" cy="0.24" r="0.88">
                    <stop offset="0%" stopColor="#E6DFF2" />
                    <stop offset="48%" stopColor="#D3C8E2" />
                    <stop offset="84%" stopColor="#C0B3D4" />
                    <stop offset="100%" stopColor="#AA9BC2" />
                </radialGradient>

                {/* Мек 3D обем на заобления периферен кант */}
                <linearGradient id="dpRim" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#EDE7F7" />
                    <stop offset="50%" stopColor="#C8BBD9" />
                    <stop offset="100%" stopColor="#A192B8" />
                </linearGradient>

                {/* Хоризонтален светлосенъчен градиент за всяка от 4-те широки вертикални вълни */}
                <linearGradient id="wavePanel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9E8FB5" stopOpacity="0.34" />
                    <stop offset="18%" stopColor="#F4EFFB" stopOpacity="0.46" />
                    <stop offset="55%" stopColor="#D3C8E2" stopOpacity="0" />
                    <stop offset="88%" stopColor="#9E8FB5" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#9687AE" stopOpacity="0.38" />
                </linearGradient>

                {/* Плавно преливане на вертикалните вълни към горния и долния ръб */}
                <linearGradient id="waveFadeY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="14%" stopColor="#fff" stopOpacity="1" />
                    <stop offset="86%" stopColor="#fff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask id="waveMaskY">
                    <rect x="0" y="0" width="316.5" height="374.1" fill="url(#waveFadeY)" />
                </mask>

                {/* Фин матов микро-релеф на ABS пластмасата */}
                <filter id="absMatte" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>

                {/* Меко студийно осветление отгоре-вляво */}
                <radialGradient id="studioTop" cx="0.3" cy="0.16" r="0.72">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.36" />
                    <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>

                {/* Ниво 1: Плавно повдигната основа на обектива */}
                <radialGradient id="lensMound" cx="0.35" cy="0.28" r="0.82">
                    <stop offset="0%" stopColor="#E4DCF1" />
                    <stop offset="58%" stopColor="#D0C4E1" />
                    <stop offset="100%" stopColor="#B2A3C7" />
                </radialGradient>

                {/* Ниво 2: Външен гладък пръстен за режими */}
                <linearGradient id="outerRing" x1="0.18" y1="0.12" x2="0.82" y2="0.88">
                    <stop offset="0%" stopColor="#EAE3F5" />
                    <stop offset="48%" stopColor="#D1C6E1" />
                    <stop offset="100%" stopColor="#AEA0C4" />
                </linearGradient>

                {/* Ниво 3: Преден телескопичен тубус */}
                <radialGradient id="innerBarrel" cx="0.36" cy="0.28" r="0.82">
                    <stop offset="0%" stopColor="#E7E0F4" />
                    <stop offset="56%" stopColor="#D0C4E1" />
                    <stop offset="100%" stopColor="#B0A1C6" />
                </radialGradient>

                {/* Огледалце за селфи (сребрист хром) */}
                <linearGradient id="mirrorSurf" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#DCE3F0" />
                    <stop offset="32%" stopColor="#FFFFFF" />
                    <stop offset="54%" stopColor="#B9C3D6" />
                    <stop offset="78%" stopColor="#F7F9FD" />
                    <stop offset="100%" stopColor="#9DA7BA" />
                </linearGradient>

                {/* Оптично стъкло и антирефлексно покритие */}
                <radialGradient id="glassCore" cx="0.38" cy="0.32" r="0.76">
                    <stop offset="0%" stopColor="#313D75" />
                    <stop offset="42%" stopColor="#141932" />
                    <stop offset="82%" stopColor="#090C16" />
                    <stop offset="100%" stopColor="#04060B" />
                </radialGradient>
                <linearGradient id="lensCoating" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#9366F9" stopOpacity="0.48" />
                    <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.26" />
                </linearGradient>

                {/* Дифузен кехлибарено-оранжев LED пръстен на самоснимачката */}
                <linearGradient id="amberRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC178" />
                    <stop offset="50%" stopColor="#FA8231" />
                    <stop offset="100%" stopColor="#E66414" />
                </linearGradient>

                {/* Вдлъбнат матов спусък */}
                <linearGradient id="shutterConcave" x1="0.25" y1="0.15" x2="0.75" y2="0.85">
                    <stop offset="0%" stopColor="#B7A9CC" />
                    <stop offset="52%" stopColor="#D1C6E1" />
                    <stop offset="100%" stopColor="#E6DFF2" />
                </linearGradient>

                {/* Светкавица: фини вертикални френелови призми с дифузен рефлектор */}
                <linearGradient id="flashDiffuser" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#DEE4EF" />
                    <stop offset="28%" stopColor="#F9FBFD" />
                    <stop offset="52%" stopColor="#E7ECF4" />
                    <stop offset="76%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#D5DCE8" />
                </linearGradient>
                <filter id="flashInnerBlur" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="1.6" />
                </filter>

                {/* Меки студийни 3D сенки и дифузия */}
                <filter id="ledSoftGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="2.2" />
                </filter>
                <filter id="moundShadow" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="2" dy="6" stdDeviation="6.5" floodColor="#5B487A" floodOpacity="0.26" />
                </filter>
                <filter id="ringShadow" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="1.5" dy="4" stdDeviation="3.5" floodColor="#5B487A" floodOpacity="0.22" />
                </filter>

                <clipPath id="bodyClip">
                    <rect x="1.5" y="1.5" width="313.5" height="371.1" rx="68.5" />
                </clipPath>
                <clipPath id="flashClip">
                    <rect x="106" y="27" width="35" height="94" rx="17.5" />
                </clipPath>

                {/* Дъги за гравираните микро-надписи */}
                <path id="modeArc" d="M 107.5 226 A 85.5 85.5 0 0 1 169.5 154.5" />
                <path id="topSpecArc" d="M 150 238 A 42 42 0 0 1 234 238" />
                <path id="botSpecArc" d="M 150 238 A 42 42 0 0 0 234 238" />
            </defs>

            {/* Контактна сянка под апарата */}
            <ellipse cx="158.25" cy="380.5" rx="112" ry="6.5" fill="rgba(75, 48, 120, 0.22)" />

            {/* Странични уши за каишката в горната третина */}
            <rect x="-1.5" y="102" width="3.5" height="21" rx="1.75" fill="#BCB0CE" />
            <rect x="314.5" y="102" width="3.5" height="21" rx="1.75" fill="#BCB0CE" />

            {/* ---------- 1. ОСНОВЕН КОРПУС ---------- */}
            <rect x="0" y="0" width="316.5" height="374.1" rx="70" fill="url(#dpRim)" />
            <rect x="1.5" y="1.5" width="313.5" height="371.1" rx="68.5" fill="url(#dpBody)" />

            {/* 4 широки вертикални вълни */}
            <g clipPath="url(#bodyClip)">
                <g mask="url(#waveMaskY)">
                    <rect x="0" y="0" width="96" height="374.1" fill="url(#wavePanel)" />
                    <rect x="96" y="0" width="59" height="374.1" fill="url(#wavePanel)" />
                    <rect x="155" y="0" width="60" height="374.1" fill="url(#wavePanel)" />
                    <rect x="215" y="0" width="101.5" height="374.1" fill="url(#wavePanel)" />
                </g>

                <rect x="1.5" y="1.5" width="313.5" height="371.1" fill="url(#studioTop)" />
                <rect
                    x="1.5"
                    y="1.5"
                    width="313.5"
                    height="371.1"
                    filter="url(#absMatte)"
                    opacity="0.03"
                    style={{ mixBlendMode: 'overlay' }}
                />
            </g>

            {/* ---------- 2. МНОГОСТЕПЕНЕН ОБЕКТИВ ---------- */}
            <circle cx={LX} cy={LY} r="109" fill="url(#lensMound)" filter="url(#moundShadow)" />

            <circle
                cx={LX}
                cy={LY}
                r="94"
                fill="url(#outerRing)"
                stroke="#B3A5C7"
                strokeWidth="0.8"
                filter="url(#ringShadow)"
            />
            <circle
                cx={LX}
                cy={LY}
                r="93"
                fill="none"
                stroke="#F6F2FC"
                strokeOpacity="0.6"
                strokeWidth="0.9"
            />

            {/* Деликатен надпис OFF · ON · CLOSE-UP */}
            <text fontSize="4.6" fontWeight="600" letterSpacing="0.75" fill="#F4EFFB" opacity="0.85" dy="0.4">
                <textPath href="#modeArc" startOffset="6%">OFF · ON · CLOSE-UP</textPath>
            </text>
            <text fontSize="4.6" fontWeight="600" letterSpacing="0.75" fill="#9A8BB0">
                <textPath href="#modeArc" startOffset="6%">OFF · ON · CLOSE-UP</textPath>
            </text>

            {/* Преден телескопичен тубус */}
            <circle
                cx={LX}
                cy={LY}
                r="72.5"
                fill="url(#innerBarrel)"
                stroke="#B2A4C6"
                strokeWidth="0.8"
                filter="url(#ringShadow)"
            />
            <circle cx={LX} cy={LY} r="71.4" fill="none" stroke="#F6F2FC" strokeOpacity="0.6" strokeWidth="0.9" />
            <circle cx={LX} cy={LY} r="62.5" fill="none" stroke="#AA9BC0" strokeOpacity="0.32" strokeWidth="1.1" />

            {/* Огледалце за селфи */}
            <rect x="126.5" y="224" width="17.5" height="28" rx="4.8" fill="#AC9DC3" />
            <rect
                x="127.2"
                y="224.7"
                width="16.1"
                height="26.6"
                rx="4.2"
                fill="url(#mirrorSurf)"
                stroke="#C8CFD9"
                strokeWidth="0.6"
            />
            <path d="M 129.2 246 L 136.5 227.5 L 139.8 227.5 L 132.5 246 Z" fill="#FFFFFF" opacity="0.8" />

            {/* Гравирани тон-в-тон надписи около оптичното ядро */}
            <text fontSize="3.6" fontWeight="600" letterSpacing="0.65" fill="#EFE9F8" opacity="0.85" dy="0.4">
                <textPath href="#topSpecArc" startOffset="50%" textAnchor="middle">
                    INSTAX LENS 60mm
                </textPath>
            </text>
            <text fontSize="3.6" fontWeight="600" letterSpacing="0.65" fill="#9889AE">
                <textPath href="#topSpecArc" startOffset="50%" textAnchor="middle">
                    INSTAX LENS 60mm
                </textPath>
            </text>

            <text fontSize="3.5" fontWeight="600" letterSpacing="0.55" fill="#EFE9F8" opacity="0.85" dy="0.4">
                <textPath href="#botSpecArc" startOffset="50%" textAnchor="middle">
                    FOCUS RANGE 0.3m - ∞
                </textPath>
            </text>
            <text fontSize="3.5" fontWeight="600" letterSpacing="0.55" fill="#9889AE">
                <textPath href="#botSpecArc" startOffset="50%" textAnchor="middle">
                    FOCUS RANGE 0.3m - ∞
                </textPath>
            </text>

            {/* Вдлъбнато черно оптично ядро и леща */}
            <circle cx={LX} cy={LY} r="36.5" fill="#181A22" stroke="#A394B9" strokeWidth="1" />
            <circle cx={LX} cy={LY} r="32.5" fill="none" stroke="#2B2E3A" strokeWidth="1.2" />
            <circle cx={LX} cy={LY} r="27" fill="#0D0F16" stroke="#252834" strokeWidth="1.1" />
            <circle cx={LX} cy={LY} r="21.5" fill="url(#glassCore)" />
            <circle cx={LX} cy={LY} r="21.5" fill="url(#lensCoating)" />
            <circle cx={LX} cy={LY} r="8.5" fill="#05070E" opacity="0.8" />
            <circle cx={LX} cy={LY} r="21.5" fill="none" stroke="#6355B8" strokeOpacity="0.45" strokeWidth="0.8" />
            <ellipse
                cx={LX - 7.2}
                cy={LY - 8}
                rx="6"
                ry="3.2"
                fill="#FFFFFF"
                opacity="0.72"
                transform={`rotate(-35 ${LX - 7.2} ${LY - 8})`}
            />
            <circle cx={LX + 7.8} cy={LY + 8.5} r="1.9" fill="#BAE6FD" opacity="0.5" />

            {/* ---------- 3. САМОСНИМАЧКА И ВДЛЪБНАТ СПУСЪК ---------- */}
            <circle
                cx="70"
                cy="163"
                r="32.5"
                fill="url(#outerRing)"
                stroke="#B3A5C7"
                strokeWidth="0.8"
                filter="url(#ringShadow)"
            />
            <circle cx="70" cy="163" r="31.5" fill="none" stroke="#F6F2FC" strokeOpacity="0.6" strokeWidth="0.9" />

            <path
                d="M 65.5 194.2 L 74.5 194.2 L 73.5 199.4 Q 70 201 66.5 199.4 Z"
                fill="#D1C6E1"
                stroke="#AC9DC3"
                strokeWidth="0.8"
            />

            <circle
                cx="70"
                cy="163"
                r="22.2"
                fill="none"
                stroke="#FF8A3D"
                strokeWidth="3.8"
                opacity="0.65"
                filter="url(#ledSoftGlow)"
                className="led"
            />
            <circle
                cx="70"
                cy="163"
                r="22.2"
                fill="none"
                stroke="url(#amberRing)"
                strokeWidth="2.6"
                opacity="0.9"
                className="led"
            />

            <g className="shutter">
                <circle
                    cx="70"
                    cy="163"
                    r="20.4"
                    fill="url(#shutterConcave)"
                    stroke="#B5A7C9"
                    strokeWidth="0.7"
                />
            </g>

            {/* ---------- 4. ОПТИЧЕН ВИЗЬОР ---------- */}
            <rect x="51" y="53" width="38" height="44" rx="12.5" fill="#B7A9CB" />
            <rect x="52" y="54" width="36" height="42" rx="11.5" fill="#D2C7E2" stroke="#F2ECFA" strokeWidth="0.7" />
            <rect x="59.5" y="61.5" width="21" height="27" rx="5.5" fill="#232632" stroke="#9F90B5" strokeWidth="0.8" />
            <rect x="61.5" y="63.5" width="17" height="23" rx="4" fill="#141824" />
            <path d="M 63 83 L 69 65 L 73 65 L 67 83 Z" fill="#FFFFFF" opacity="0.14" />

            {/* ---------- 5. КСЕНОНОВА СВЕТКАВИЦА ---------- */}
            <rect x="104" y="25" width="39" height="98" rx="19.5" fill="#B9ABCC" />
            <rect
                className="flash-win"
                x="105"
                y="26"
                width="37"
                height="96"
                rx="18.5"
                fill="#ECF0F7"
                stroke="#F8FAFD"
                strokeWidth="0.8"
            />
            <g clipPath="url(#flashClip)">
                <rect x="106" y="27" width="35" height="94" fill="url(#flashDiffuser)" />
                <g filter="url(#flashInnerBlur)" opacity="0.45">
                    <rect x="108" y="69" width="31" height="10" rx="4" fill="#C7CFDE" />
                    <rect x="110" y="71.5" width="27" height="5" rx="2.5" fill="#FFFFFF" />
                </g>
                {Array.from({ length: 16 }, (_, k) => (
                    <line
                        key={k}
                        x1={107.2 + k * 2.15}
                        y1="27"
                        x2={107.2 + k * 2.15}
                        y2="121"
                        stroke={k % 2 === 0 ? '#FFFFFF' : '#CBD3E2'}
                        strokeOpacity="0.62"
                        strokeWidth="0.8"
                    />
                ))}
                <path d="M 105 62 L 142 40 L 142 52 L 105 74 Z" fill="#FFFFFF" opacity="0.42" />
            </g>

            {/* ---------- 6. СВЕТЛИННИ СЕНЗОРИ ---------- */}
            <rect x="170" y="48" width="15.5" height="39" rx="7.75" fill="#B7A9CB" />
            <rect x="170.9" y="48.9" width="13.7" height="37.2" rx="6.85" fill="#D2C7E2" stroke="#F2ECFA" strokeWidth="0.6" />
            <circle cx="177.75" cy="59" r="4.3" fill="#151822" stroke="#A293B8" strokeWidth="0.7" />
            <circle cx="177.75" cy="76" r="3.6" fill="#151822" stroke="#A293B8" strokeWidth="0.7" />
            <circle cx="176.4" cy="57.7" r="1.1" fill="#BAE6FD" opacity="0.72" />
            <circle cx="176.6" cy="74.9" r="0.9" fill="#FFFFFF" opacity="0.6" />
        </svg>
    )
}

/* ---------- снимка във формат Instax mini ---------- */
function Card({ n, src, date, developed, onClick, style }) {
    const Tag = onClick ? 'button' : 'div'
    return (
        <Tag
            type={onClick ? 'button' : undefined}
            className={`instax-card ${developed ? 'developed' : ''}`}
            onClick={onClick}
            style={style}
            aria-label={onClick ? `Снимка ${n}${developed ? '' : ' – докосни, за да се появи снимката'}` : undefined}
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
    const [extraFlash, setExtraFlash] = useState(false)
    const [dev, setDev] = useState(() => new Set()) // проявени снимки
    const startedRef = useRef(false)
    const albumRef = useRef(null)

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

    const handleSnap = () => {
        if (phase < 4 || extraFlash) return
        setExtraFlash(true)
        setTimeout(() => setExtraFlash(false), 700)
    }

    const develop = (key) => setDev((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
    const total = PHOTOS.length + 1
    const all = dev.size === total

    return (
        <main className="page photos-page">
            <section className="cam-scene">
                <div className="cam-wrap" data-phase={extraFlash ? 1 : phase}>
                    <Camera onSnap={phase >= 4 ? handleSnap : undefined} />
                    <div className="cam-photo">
                        <Card n="★" src={COVER_PHOTO.src} date={COVER_PHOTO.date} developed={false} />
                    </div>
                </div>
                <p className="cam-cap">{CAPTIONS[phase]}</p>
            </section>

            {(phase === 1 || extraFlash) && <div className="flash-screen" />}

            <section className="album" ref={albumRef}>
                <div className="album-page">
                    <h2 className="section-title">Нашият албум</h2>
                    <p className="section-sub">
                        Докосни всяка снимка, за да се появи ({dev.size}/{total})
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