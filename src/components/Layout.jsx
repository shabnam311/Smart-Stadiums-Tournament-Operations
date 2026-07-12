import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const ICONS = {
  overview: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  ops: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
  transport: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="6" width="16" height="10" rx="2"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>,
  accessibility: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="2"/><path d="M6 9h12M12 9v6M9 21l3-6 3 6"/></svg>,
};

function TopBar({ mode }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"></div>
        <div className="brand-name">PITCHSIDE</div>
      </div>
      <div className="status-chip">
        <span className={"status-dot" + (mode === "demo" ? " demo" : "")}></span>
        <span>{mode === "demo" ? "Demo mode" : "Live"}</span>
      </div>
      <div className="topbar-right">
        <span className="mono">Gate Complex B</span>
        <span>·</span>
        <span>FIFA World Cup 2026</span>
      </div>
    </header>
  );
}

function Sidebar({ pathname, navigate }) {
  const items = [
    { id: "/", label: "Overview", icon: "overview" },
    { id: "/ops", label: "Ops Intelligence", icon: "ops" },
    { id: "/transport", label: "Transport", icon: "transport" },
    { id: "/accessibility", label: "Accessibility", icon: "accessibility" },
  ];
  return (
    <nav className="sidebar">
      <div className="nav-section-label">Operations</div>
      {items.map(item => (
        <button key={item.id} className={"nav-btn" + (pathname === item.id ? " active" : "")} onClick={() => navigate(item.id)}>
          {ICONS[item.icon]}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="shell">
      <TopBar mode="live" />
      <Sidebar pathname={location.pathname} navigate={navigate} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
