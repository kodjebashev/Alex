import { useEffect, useRef, useState } from 'react'
import { MONTHS } from '../content.js'
import './Months.css'

function Item({ item, index }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <li ref={ref} className={`tl-item ${index % 2 ? 'right' : 'left'} ${seen ? 'seen' : ''}`}>
      <span className="tl-dot">💗</span>
      <div className="tl-card">
        <span className="tl-when">{item.when}</span>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        {item.image && <img src={item.image} alt="" loading="lazy" />}
      </div>
    </li>
  )
}

export default function Months() {
  return (
    <main className="page">
      <h2 className="section-title">Месец по месец</h2>
      <p className="section-sub">Нашата история до днес</p>
      <ol className="timeline">
        {MONTHS.map((m, i) => (
          <Item key={i} item={m} index={i} />
        ))}
      </ol>
      <a className="cta" href="#/photos">Нататък →</a>
    </main>
  )
}
