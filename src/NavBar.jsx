const LINKS = [
    { href: '#/', label: '20', crown: true },
    { href: '#/video', label: 'Видео' },
]

function NavBar({ current }) {
    return (
        <nav className="navbar" aria-label="Основна навигация">
            {LINKS.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="nav-btn"
                    aria-current={current === link.href ? 'page' : undefined}
                >
                    {link.crown && (
                        <span className="crown" aria-hidden="true">👑</span>
                    )}
                    {link.label}
                </a>
            ))}
        </nav>
    )
}

export default NavBar