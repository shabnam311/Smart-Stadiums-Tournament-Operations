import React from 'react';
import { Map, Coffee, Compass, Accessibility, Leaf, Ticket } from 'lucide-react';

const FanDashboard = () => {
  return (
    <div>
      <h2 className="title text-gradient">Welcome to Stadium W26</h2>
      <p className="subtitle">Your ultimate guide for the match day experience.</p>
      
      <div className="grid-cols-3">
        <div className="glass-panel stat-card" style={{ cursor: 'pointer' }}>
          <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', marginBottom: '1rem' }}>
            <Map size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Interactive Map</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Navigate to your seat, find amenities, and explore the venue.</p>
        </div>

        <div className="glass-panel stat-card" style={{ cursor: 'pointer' }}>
          <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
            <Coffee size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Food & Beverage</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order ahead and skip the lines. Find vegan and halal options.</p>
        </div>

        <div className="glass-panel stat-card" style={{ cursor: 'pointer' }}>
          <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', marginBottom: '1rem' }}>
            <Accessibility size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Accessibility</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Wheelchair routes, sensory rooms, and specialized assistance.</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sustainability Goals</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Join us in our mission to make this the most eco-friendly World Cup. Find recycling stations and use our smart routing for public transit to earn eco-points!
            </p>
            <button className="glass-button">
              <Leaf size={18} color="#4ade80" />
              View Eco-Hub
            </button>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '1rem', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--glass-border)' }}>
             <p style={{ color: 'var(--text-muted)' }}>[Eco-Transit Map Placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanDashboard;
