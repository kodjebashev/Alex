import { useEffect, useRef, useState } from 'react'
import './App.css'
import Intro from './Intro.jsx'
import NavBar from './NavBar.jsx'
import Secret from './Secret.jsx'
import { ROUTES } from './routes.js'
import Awards from './pages/Awards.jsx'
import Balloons from './pages/Balloons.jsx'
import Cake from './pages/Cake.jsx'
import Months from './pages/Months.jsx'
import Twenty from './pages/Twenty.jsx'
import Video from './pages/Video.jsx'

// ====================================================
// МУЗИКА: сложи файла в папка public/ (напр. public/music.mp3)
// и напиши пътя тук. Остави '' за без музика.
// ====================================================
const MUSIC_URL = '/music.mp3'

// Тайната изненада: толкова натискания на короната, по-бавни от 2 сек. помежду им
const SECRET_TAPS = 5

// Тези страници остават монтирани, за да не се губи напредъкът в тях
const PAGES = {
  '#/20': Twenty,
  '#/months': Months,
  '#/awards': Awards,
  '#/balloons': Balloons,
  '#/cake': Cake,
}

// Началната страница е първата в списъка (Месеци)
const START = ROUTES[0].path

function getRoute() {
  const hash = window.location.hash
  return ROUTES.some((r) => r.path === hash) ? hash : START
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [introDone, setIntroDone] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasMusic, setHasMusic] = useState(false)
  const [secret, setSecret] = useState(false)
  const audioRef = useRef(null)
  const resumeRef = useRef(false)
  const tapsRef = useRef({ n: 0, t: 0 })

  useEffect(() => {
    const onChange = () => {
      const next = getRoute()
      setRoute(next)
      window.scrollTo(0, 0)

      // Музиката се спира във "Видео" и се връща при излизане от него
      const audio = audioRef.current
      if (!audio) return
      if (next === '#/video' && !audio.paused) {
        audio.pause()
        setPlaying(false)
        resumeRef.current = true
      } else if (next !== '#/video' && resumeRef.current) {
        resumeRef.current = false
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const startMusic = () => {
    if (!MUSIC_URL) return
    const audio = new Audio(MUSIC_URL)
    audio.loop = true
    audio.volume = 0.6
    audioRef.current = audio
    audio
      .play()
      .then(() => {
        setHasMusic(true)
        setPlaying(true)
      })
      .catch(() => {})
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    resumeRef.current = false
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const onCrown = () => {
    const now = Date.now()
    const t = tapsRef.current
    t.n = now - t.t > 2000 ? 1 : t.n + 1
    t.t = now
    if (t.n >= SECRET_TAPS) {
      t.n = 0
      setSecret(true)
    }
  }

  const showIntro = route === START && !introDone

  return (
    <>
      {showIntro && <Intro onOpen={startMusic} onDone={() => setIntroDone(true)} />}
      <NavBar current={route} onCrown={onCrown} />

      {Object.entries(PAGES).map(([path, Page]) => (
        <div key={path} style={{ display: route === path ? 'contents' : 'none' }}>
          <Page />
        </div>
      ))}
      {route === '#/video' && <Video />}

      {secret && <Secret onClose={() => setSecret(false)} />}

      {hasMusic && (
        <button
          type="button"
          className="music-btn"
          onClick={toggleMusic}
          aria-label={playing ? 'Спри музиката' : 'Пусни музиката'}
        >
          {playing ? '🔊' : '🔇'}
        </button>
      )}
    </>
  )
}

export default App
