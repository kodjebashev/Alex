import { ROUTES } from './routes.js'

function NavBar({ current, onCrown }) {
  return (
    <nav className="navbar" aria-label="Основна навигация">
      {ROUTES.map((r) => (
        <span key={r.path} className="nav-item">
          {r.crown && (
            <button type="button" className="crown" onClick={onCrown} aria-label="Корона">
              👑
            </button>
          )}
          <a
            href={r.path}
            className="nav-btn"
            aria-current={current === r.path ? 'page' : undefined}
          >
            {r.label}
          </a>
        </span>
      ))}
    </nav>
  )
}

export default NavBar
