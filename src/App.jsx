import React, { useState, useEffect } from 'react';
import MainContent from './components/MainContent';
import RightRail from './components/RightRail';
import './index.css';

function App() {
  const [time, setTime] = useState('--:--:--');
  const [activeNav, setActiveNav] = useState('Overview');

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-GB'));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Overview', icon: <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/>, viewBox: "0 0 24 24" },
    { name: 'Crowd Zones', icon: <><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></>, viewBox: "0 0 24 24" },
    { name: 'Incidents', icon: <><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/></>, viewBox: "0 0 24 24" },
    { name: 'Transport', icon: <><rect x="4" y="6" width="16" height="10" rx="2"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></>, viewBox: "0 0 24 24" },
    { name: 'Accessibility', icon: <><circle cx="12" cy="5" r="2"/><path d="M6 9h12M12 9v6M9 21l3-6 3 6"/></>, viewBox: "0 0 24 24" }
  ];

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"></div>
          <div className="brand-name">PITCH<span>SIDE</span></div>
        </div>
        <div className="match-strip">
          <span className="live-dot pulse"></span>
          <span><b style={{ color: 'var(--text)' }}>LIVE</b></span>
          <span className="divider-dot"></span>
          <span>Match 38 — Group Stage · Gate Complex B</span>
          <span className="divider-dot"></span>
          <span>Kickoff <b className="mono" style={{ color: 'var(--text)' }}>18:00 IST</b></span>
        </div>
        <div className="topbar-right">
          <div className="weather-item" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Pitch-side</span>
            <span className="mono" style={{ fontSize: '12.5px' }}>29°C</span>
          </div>
          <div className="clock">Local time <b className="mono">{time}</b></div>
          <div className="avatar">SS</div>
        </div>
      </header>

      <nav className="sidebar">
        {navItems.map((item) => (
          <div 
            key={item.name}
            className={`nav-item ${activeNav === item.name ? 'active' : ''}`}
            title={item.name}
            onClick={() => setActiveNav(item.name)}
          >
            <svg viewBox={item.viewBox} fill="none" stroke="currentColor" strokeWidth="1.6">
              {item.icon}
            </svg>
          </div>
        ))}
        <div className="nav-spacer"></div>
        <div className="nav-item" title="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </div>
      </nav>

      <MainContent />
      
      <RightRail />

    </div>
  );
}

export default App;
