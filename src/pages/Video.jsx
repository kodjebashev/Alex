import './Video.css'
import FloatingEmojis from '../FloatingEmojis.jsx'

// ====================================================
// ТУК ПОСТАВИ ЛИНКА КЪМ ВИДЕОТО (между кавичките)
// Пример: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
// ====================================================
const VIDEO_URL = ''

function parseVideo(raw) {
  const value = raw.trim()
  if (!value) return null

  let url
  try {
    url = new URL(value)
  } catch {
    return { error: 'Линкът не е валиден.' }
  }

  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1` }
  }

  if (host.endsWith('youtube.com')) {
    const parts = url.pathname.split('/').filter(Boolean)
    const id =
      url.searchParams.get('v') ||
      (['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null)
    if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1` }
  }

  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    if (id && /^\d+$/.test(id)) {
      return { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` }
    }
  }

  if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(url.pathname)) {
    return { type: 'video', src: value }
  }

  return { error: 'Поддържат се YouTube, Vimeo и директни линкове към .mp4/.webm.' }
}

const video = parseVideo(VIDEO_URL)

function Video() {
  const playing = video && !video.error

  return (
    <>
      <FloatingEmojis />
    <main className="stage">
      <div className="screen">
        {playing && video.type === 'iframe' && (
          <iframe
            src={video.src}
            title="Видео плейър"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        )}
        {playing && video.type === 'video' && <video src={video.src} controls autoPlay />}
        {!playing && (
          <div className="placeholder">
            <p className="placeholder-title">
              {video?.error ?? 'Няма зададено видео'}
            </p>
            <p className="placeholder-hint">Постави линк в App.jsx → VIDEO_URL</p>
          </div>
        )}
      </div>
    </main>
    </>
  )
}

export default Video
