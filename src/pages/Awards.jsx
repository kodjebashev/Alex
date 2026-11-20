import { useState } from 'react'
import Confetti from '../Confetti.jsx'
import { AWARDS, SPECIAL, SPEECH } from '../content.js'
import './Awards.css'

function GoldenLetter({ award, index, onReveal }) {
    const [phase, setPhase] = useState('closed') // closed → opening → revealed

    const open = () => {
        if (phase !== 'closed') return
        setPhase('opening')
        setTimeout(() => {
            setPhase('revealed')
            onReveal()
        }, 1800)
    }

    return (
        <article className={`award ${phase}`}>
            {phase === 'revealed' ? (
                <div className="letter-opened">
                    <span className="sparkles" aria-hidden="true">
                        {Array.from({ length: 8 }, (_, k) => (
                            <i key={k} style={{ '--a': `${k * 45}deg` }}>✨</i>
                        ))}
                    </span>

                    {award.image && <img className="award-img" src={award.image} alt="" />}

                    <p className="award-label">🏆 Спечелена категория</p>
                    <h3 className="award-cat">{award.category}</h3>
                    <p className="award-name">{award.winner ?? 'Александра'} 👑</p>
                    <p className="award-note">{award.note}</p>
                </div>
            ) : (
                <div className="letter-closed">
                    <span className="envelope-num">Златен плик №{index + 1}</span>

                    <button
                        type="button"
                        className="gold-env"
                        onClick={open}
                        disabled={phase === 'opening'}
                        aria-label={`Отвори златен плик №${index + 1}`}
                    >
                        <span className="ge-card">📜</span>
                        <span className="ge-front" />
                        <span className="ge-flap" />
                        <span className="ge-seal" aria-hidden="true">🏆</span>
                    </button>

                    <p className={phase === 'opening' ? 'drums' : 'award-hint'}>
                        {phase === 'opening' ? '🥁 барабани… 🥁' : 'Натисни, за да отвориш писмото'}
                    </p>
                </div>
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
                        <p className="aw-kicker">★ Церемонията ★</p>
                        <h2 className="aw-title">ОСКАРИ</h2>

                        <div className="aw-banner" role="status">
                            <p className="aw-announcement">
                                Александра бе номинирана за шест категории и спечели всичките!
                            </p>
                        </div>

                        <p className="aw-sub">
                            Отворени златни писма: {count}/{AWARDS.length}
                        </p>
                    </header>

                    <div className="awards">
                        {AWARDS.map((a, i) => (
                            <GoldenLetter
                                key={i}
                                award={a}
                                index={i}
                                onReveal={() => setCount((c) => c + 1)}
                            />
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