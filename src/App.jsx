import React, { useState } from 'react';
import FanDashboard from './components/FanDashboard';
import StaffDashboard from './components/StaffDashboard';
import GenAIAssistant from './components/GenAIAssistant';
import { Settings, Users } from 'lucide-react';
import './index.css';

function App() {
  const [mode, setMode] = useState('fan'); // 'fan' or 'staff'

  return (
    <div className="app-layout">
      <nav className="navbar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', marginBottom: '2rem' }}>
        <div className="container flex-between" style={{ padding: '0.5rem 2rem' }}>
          <div className="flex-center" style={{ gap: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              W26
            </div>
            <h1 className="title" style={{ fontSize: '1.5rem', margin: 0 }}>Smart Stadium Hub</h1>
          </div>
          
          <div className="flex-center" style={{ gap: '1rem' }}>
            <button 
              className={`glass-button ${mode === 'fan' ? 'active' : ''}`}
              onClick={() => setMode('fan')}
            >
              <Users size={18} />
              Fan View
            </button>
            <button 
              className={`glass-button ${mode === 'staff' ? 'active' : ''}`}
              onClick={() => setMode('staff')}
            >
              <Settings size={18} />
              Operations
            </button>
          </div>
        </div>
      </nav>

      <main className="container animate-slide-up">
        {mode === 'fan' ? <FanDashboard /> : <StaffDashboard />}
      </main>

      <GenAIAssistant mode={mode} />
    </div>
  );
}

export default App;
