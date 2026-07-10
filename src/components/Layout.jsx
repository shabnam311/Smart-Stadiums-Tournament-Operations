import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import venues from '../data/venues.json';

const Layout = () => {
  const location = useLocation();
  const [weather, setWeather] = useState('29°');
  const [clock, setClock] = useState('--:--:--');
  const activeVenue = venues[0];

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${activeVenue.lat}&longitude=${activeVenue.lon}&current_weather=true`)
      .then(res => res.json())
      .then(data => {
        if (data?.current_weather) {
          setWeather(`${Math.round(data.current_weather.temperature)}°`);
        }
      })
      .catch(() => {});
  }, [activeVenue]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB'));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="wrap">
      <nav>
        <div className="logo">
          <div className="logo-mark"></div>
          <div className="logo-text"><b>STADIUM</b>OPS</div>
        </div>
        <div className="nav-pills">
          <div className="pill live"><span className="dot"></span>LIVE MATCH</div>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Overview</Link>
          <Link to="/transport" className={location.pathname === '/transport' ? 'active' : ''}>Transit</Link>
          <Link to="/accessibility" className={location.pathname === '/accessibility' ? 'active' : ''}>Accessibility</Link>
          <span className="clock">{clock}</span>
        </div>
      </nav>

      {/* Hero only shows on the main page */}
      {location.pathname === '/' && (
        <section className="hero">
          <div className="eyebrow">
            <span className="rule"></span>
            <span className="label">OPERATIONS INTELLIGENCE · FIFA WORLD CUP 2026</span>
          </div>
          <h1>Ask the stadium<br/><em>what happens next.</em></h1>
          <p className="hero-sub">Built for venue operations staff during live matches. Query crowd flow, incidents, transit, and accessibility in plain language - get a decision with reasoning, not another dashboard.</p>

          <div className="legend">
            <div className="legend-item"><span className="legend-dot" style={{background:'var(--c-crowd)'}}></span><span>CROWD FLOW</span></div>
            <div className="legend-item"><span className="legend-dot" style={{background:'var(--c-incident)'}}></span><span>INCIDENT</span></div>
            <div className="legend-item"><span className="legend-dot" style={{background:'var(--c-transit)'}}></span><span>TRANSIT</span></div>
            <div className="legend-item"><span className="legend-dot" style={{background:'var(--c-access)'}}></span><span>ACCESSIBILITY</span></div>
          </div>
        </section>
      )}

      <div style={{ marginTop: location.pathname === '/' ? '0' : '40px', minHeight: '60vh' }}>
        <Outlet context={{ venue: activeVenue, weather, clock }} />
      </div>

      <section className="info-grid" style={{ marginTop: '40px' }}>
        <div className="info-block">
          <div className="label">MODEL & DATA</div>
          <p>AI runs on <b>Google Gemma 4</b> via the Gemini API for rapid, context-aware reasoning. Weather data is pulled live via <b>Open-Meteo</b> ({weather} currently). Gracefully falls back to demo mode if limits are reached.</p>
        </div>
        <div className="info-block">
          <div className="label">DEPLOYMENT</div>
          <p>Static frontend deployed on <b>Vercel</b> with a <b>serverless proxy</b> for the model call, keeping API tokens completely hidden from the browser bundle.</p>
        </div>
      </section>

      <footer>
        <span>STADIUMOPS · 2026 · FIFA WORLD CUP</span>
        <div className="foot-links">
          <a href="https://github.com/shabnam311/Smart-Stadiums-Tournament-Operations" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href="#">MODEL CARD</a>
          <a href="#">ABOUT</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
