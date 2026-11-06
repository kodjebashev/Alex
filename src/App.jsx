import { useEffect, useRef, useState } from 'react'
import './App.css'
import Intro from './Intro.jsx'
import NavBar from './NavBar.jsx'
import Twenty from './pages/Twenty.jsx'
import Video from './pages/Video.jsx'

// ====================================================
// МУЗИКА: сложи файла в папка public/ (напр. public/music.mp3)
// и напиши пътя тук. Остави '' за без музика.
// ====================================================
const MUSIC_URL = '/music.mp3'

function getRoute() {
  return window.location.hash === '#/video' ? '#/video' : '#/'
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [introDone, setIntroDone] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasMusic, setHasMusic] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const onChange = () => setRoute(getRoute())
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
    if (audio.paused) {
      audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const showIntro = route === '#/' && !introDone

  return (
    <>
      {showIntro && <Intro onOpen={startMusic} onDone={() => setIntroDone(true)} />}
      <NavBar current={route} />
      {route === '#/video' ? <Video /> : <Twenty />}
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
