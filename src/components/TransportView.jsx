import React from 'react';

const TransportView = () => {
  return (
    <main className="main">
      <div className="main-head">
        <div>
          <div className="main-title">Transport & Sustainability</div>
          <div className="main-sub">Live transit statuses and Eco-Hub points</div>
        </div>
      </div>
      <div className="panels">
        <div className="panel-ops">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>TRANSIT NETWORK STATUS</div>
          </div>
          <div className="resp-text" style={{ padding: '20px', border: '1px solid var(--line)', borderRadius: '6px', background: 'var(--surface-2)' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--text)' }}>Metro Line A - Active</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>Trains arriving every 4 minutes. Normal crowd levels.</p>
            <h3 style={{ marginBottom: '10px', marginTop: '20px', color: 'var(--amber)' }}>Shuttle Bus North - Delay</h3>
            <p style={{ color: 'var(--text-dim)' }}>Traffic near Gate B causing 10-minute delays for shuttles.</p>
          </div>
        </div>

        <div className="panel-ops">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>ECO-HUB & RECYCLING</div>
          </div>
          <div className="resp-text" style={{ padding: '20px', border: '1px solid var(--line)', borderRadius: '6px', background: 'var(--surface-2)' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--green)' }}>Sustainability Goals - On Track</h3>
            <p style={{ color: 'var(--text-dim)' }}>Current waste diverted from landfill: 62%.</p>
            <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Recycling stations near Section G are currently full. Dispatching maintenance.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransportView;
