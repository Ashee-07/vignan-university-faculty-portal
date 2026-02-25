import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Splash.css'

export default function Splash() {
  const nav = useNavigate()
  React.useEffect(() => {
    const t = setTimeout(() => nav('/home'), 2500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="splash-screen">
      <div className="splash-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="splash-content">
        <div className="logo-container">
          <div className="logo-ring"></div>
          <img src="/logo.png" alt="Vignan Logo" className="splash-logo" />
        </div>

        <div className="text-container">
          <h1 className="university-name">
            <span className="slide-char" style={{ animationDelay: '0.1s' }}>V</span>
            <span className="slide-char" style={{ animationDelay: '0.15s' }}>I</span>
            <span className="slide-char" style={{ animationDelay: '0.2s' }}>G</span>
            <span className="slide-char" style={{ animationDelay: '0.25s' }}>N</span>
            <span className="slide-char" style={{ animationDelay: '0.3s' }}>A</span>
            <span className="slide-char" style={{ animationDelay: '0.35s' }}>N</span>
          </h1>
          <h2 className="university-sub">UNIVERSITY</h2>
          <div className="tagline">Faculty Portal & Administration System</div>
        </div>

        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  )
}
