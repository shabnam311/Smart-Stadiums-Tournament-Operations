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
      <section className="panels">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>ACCESSIBILITY ROUTES</div>
          </div>
          
          <div className="resp-tag" style={{borderColor: 'var(--c-access)', color: 'var(--c-access)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-access)'}}></i>OPERATIONAL
          </div>
          <div className="resp-text" style={{marginBottom: '24px'}}>
            <strong style={{color: 'var(--text)'}}>Ramp Access - Gate 4</strong><br/>
            Status: Clear and Operational. Nearest access to Section D.
          </div>

          <div className="resp-tag" style={{borderColor: 'var(--c-access)', color: 'var(--c-access)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-access)'}}></i>OPERATIONAL
          </div>
          <div className="resp-text">
            <strong style={{color: 'var(--text)'}}>Elevator Bank C</strong><br/>
            Status: Operational. Servicing East Stand upper tiers.
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>SENSORY ROOMS & ASSISTANCE</div>
          </div>
          
          <div className="resp-tag" style={{borderColor: 'var(--c-crowd)', color: 'var(--c-crowd)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-crowd)'}}></i>CAPACITY 40%
          </div>
          <div className="resp-text" style={{marginBottom: '24px'}}>
            <strong style={{color: 'var(--text)'}}>Sensory Room A (West Concourse)</strong><br/>
            Quiet zone maintained.
          </div>

          <div className="resp-tag" style={{borderColor: 'var(--c-crowd)', color: 'var(--c-crowd)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-crowd)'}}></i>12 ACTIVE
          </div>
          <div className="resp-text">
            <strong style={{color: 'var(--text)'}}>Multilingual Volunteers</strong><br/>
            Highest demand in Spanish and Portuguese near Gate B.
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccessibilityView;
