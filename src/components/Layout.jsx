import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import venues from '../data/venues.json';

const Layout = () => {
  const location = useLocation();
  const [weather, setWeather] = useState('29°');
  const [weatherIcon, setWeatherIcon] = useState('🌤️');
  const activeVenue = venues[0]; // Default to MetLife Stadium

  useEffect(() => {
    // Live Weather Integration using REAL venue coordinates
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${activeVenue.lat}&longitude=${activeVenue.lon}&current_weather=true`)
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          setWeather(`${Math.round(data.current_weather.temperature)}°);°`);
        }
      })
      .catch(err => console.error("Weather fetch failed, falling back to mock", err));
  }, [activeVenue]);

  return (
    <div className="wrap">
      <nav>
        <div className="logo">
          <div className="logo-mark"></div>
          <div className="logo-text">PITCHSIDE • <b>OPS</b></div>
        </div>
        <div className="nav-links">
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--accent)' : '' }}>AI PROXY</Link>
          <Link to="/overview" style={{ color: location.pathname === '/overview' ? 'var(--accent)' : '' }}>OVERVIEW</Link>
          <Link to="/transport" style={{ color: location.pathname === '/transport' ? 'var(--accent)' : '' }}>TRANSPORT</Link>
          <Link to="/accessibility" style={{ color: location.pathname === '/accessibility' ? 'var(--accent)' : '' }}>ACCESS</Link>
        </div>
      </nav>

      {/* Hero only shows on the main AI Ops page */}
      {location.pathname === '/' && (
        <section className="hero">
          <div className="eyebrow">
            <span className="rule"></span>
            <span className="label">OPERATIONS INTELLIGENCE · FIFA WORLD CUP 2026</span>
          </div>
          <h1>Ask the stadium<br/><em>what happens next.</em></h1>
          <p className="hero-sub">A GenAI layer over your venue's live signals. Query crowd flow, incidents, transit, and access in plain language - get a decision, not another dashboard.</p>

          <div className="legend">
            <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-crowd)"}}></span><span>CROWD FLOW</span></div>
            <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-incident)"}}></span><span>INCIDENT</span></div>
            <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-transit)"}}></span><span>TRANSIT</span></div>
            <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-access)"}}></span><span>ACCESSIBILITY</span></div>
          </div>
        </section>
      )}

      {/* Renders the specific page */}
      <div style={{ marginTop: location.pathname === '/' ? '0' : '40px', minHeight: '60vh' }}>
        <Outlet context={{ venue: activeVenue }} />
      </div>

      <section className="info-grid" style={{ marginTop: '40px' }}>
        <div className="info-block">
          <div className="label">MODEL & DATA</div>
          <p>AI runs on a <b>free-tier ungated model</b> (Qwen 1.5B) via Hugging Face. Weather data is pulled live via <b>Open-Meteo</b> ({weather} {weatherIcon} currently). Gracefully falls back to demo mode if limits are reached.</p>
        </div>
        <div className="info-block">
          <div className="label">DEPLOYMENT</div>
          <p>Static frontend with a <b>serverless proxy</b> for the model call, keeping tokens completely hidden from the browser bundle.</p>
        </div>
      </section>

      <footer>
        <span>PITCHSIDE · OPS · 2026 · DEMO</span>
        <div className="foot-links">
          <a href="#">GITHUB</a>
          <a href="#">MODEL CARD</a>
          <a href="#">ABOUT</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
