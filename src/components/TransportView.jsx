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
      <section className="panels">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>TRANSIT NETWORK STATUS</div>
          </div>
          
          <div className="resp-tag" style={{borderColor: 'var(--c-transit)', color: 'var(--c-transit)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-transit)'}}></i>ACTIVE
          </div>
          <div className="resp-text" style={{marginBottom: '24px'}}>
            <strong style={{color: 'var(--text)'}}>Metro Line A</strong><br/>
            Trains arriving every 4 minutes. Normal crowd levels.
          </div>

          <div className="resp-tag" style={{borderColor: 'var(--c-incident)', color: 'var(--c-incident)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-incident)'}}></i>DELAY
          </div>
          <div className="resp-text">
            <strong style={{color: 'var(--text)'}}>Shuttle Bus North</strong><br/>
            Traffic near Gate B causing 10-minute delays for shuttles.
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>ECO-HUB & RECYCLING</div>
          </div>
          
          <div className="resp-tag" style={{borderColor: 'var(--c-access)', color: 'var(--c-access)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-access)'}}></i>ON TRACK
          </div>
          <div className="resp-text" style={{marginBottom: '24px'}}>
            <strong style={{color: 'var(--text)'}}>Sustainability Goals</strong><br/>
            Current waste diverted from landfill: 62%.
          </div>

          <div className="resp-tag" style={{borderColor: 'var(--c-transit)', color: 'var(--c-transit)', marginBottom: '16px'}}>
            <i style={{background: 'var(--c-transit)'}}></i>ACTION NEEDED
          </div>
          <div className="resp-text">
            <strong style={{color: 'var(--text)'}}>Recycling Stations</strong><br/>
            Stations near Section G are currently full. Dispatching maintenance.
          </div>
        </div>
      </section>
    </main>
  );
};

export default TransportView;
