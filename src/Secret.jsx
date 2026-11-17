import { useEffect } from 'react'
import Confetti from './Confetti.jsx'
import { SECRET } from './content.js'

export default function Secret({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <Confetti />
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{SECRET.title}</h2>
        {SECRET.image && <img className="modal-img" src={SECRET.image} alt="" />}
        <p className="modal-text">{SECRET.text}</p>
        <button type="button" className="cta" onClick={onClose}>Затвори 💗</button>
      </div>
    </div>
  )
}
