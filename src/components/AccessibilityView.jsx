import React from 'react';

const AccessibilityView = () => {
  return (
    <main className="main">
      <div className="main-head">
        <div>
          <div className="main-title">Accessibility Features</div>
          <div className="main-sub">Wheelchair routes, sensory rooms, and specialized assistance</div>
        </div>
      </div>
      <div className="panels">
        <div className="panel-ops">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>ACCESSIBILITY ROUTES</div>
          </div>
          <div className="resp-text" style={{ padding: '20px', border: '1px solid var(--line)', borderRadius: '6px', background: 'var(--surface-2)' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--turf)' }}>Ramp Access - Gate 4</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '16px' }}>Status: Clear and Operational. Nearest access to Section D.</p>
            <h3 style={{ marginBottom: '10px', color: 'var(--turf)' }}>Elevator Bank C</h3>
            <p style={{ color: 'var(--text-dim)' }}>Status: Operational. Servicing East Stand upper tiers.</p>
          </div>
        </div>

        <div className="panel-ops">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>SENSORY ROOMS & ASSISTANCE</div>
          </div>
          <div className="resp-text" style={{ padding: '20px', border: '1px solid var(--line)', borderRadius: '6px', background: 'var(--surface-2)' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--blue)' }}>Sensory Room A (West Concourse)</h3>
            <p style={{ color: 'var(--text-dim)' }}>Currently at 40% capacity. Quiet zone maintained.</p>
            <h3 style={{ marginBottom: '10px', marginTop: '16px', color: 'var(--blue)' }}>Multilingual Volunteers</h3>
            <p style={{ color: 'var(--text-dim)' }}>12 volunteers currently active. Highest demand in Spanish and Portuguese near Gate B.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccessibilityView;
