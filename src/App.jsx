import { useEffect, useState } from 'react'
import './App.css'
import NavBar from './NavBar.jsx'
import Twenty from './pages/Twenty.jsx'
import Video from './pages/Video.jsx'

function getRoute() {
  const hash = window.location.hash
  return hash === '#/video' ? '#/video' : '#/'
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <>
      <NavBar current={route} />
      {route === '#/video' ? <Video /> : <Twenty />}
    </>
  )
}

export default App
