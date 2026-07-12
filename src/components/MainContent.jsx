import React from 'react';
import { zones, incidents } from '../data/stadiumState';

function MainContent() {
  const colors = { ok: "var(--turf)", warn: "var(--amber)", high: "var(--red)" };
  
  const getLevel = (pct) => {
    if (pct >= 90) return "high";
    if (pct >= 75) return "warn";
    return "ok";
  };

  const density = zones.map(z => {
    const pct = Math.round((z.occ / z.cap) * 100);
    return { name: z.name, pct, level: getLevel(pct) };
  });

  const totalOcc = zones.reduce((s, z) => s + z.occ, 0);
  const totalCap = zones.reduce((s, z) => s + z.cap, 0);
  const overallPct = Math.round((totalOcc / totalCap) * 100);

  const highIncidents = incidents.filter(i => i.sev === 'high').length;

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Operations Overview</div>
        <div className="page-sub">Live status across all monitored sections</div>
      </div>
      
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Occupancy</div>
          <div className="kpi-value">{overallPct}%</div>
          <div className="kpi-delta up">+6% vs last hour</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg entry wait</div>
          <div className="kpi-value">4 min</div>
          <div className="kpi-delta up">-1.5 min</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Open incidents</div>
          <div className="kpi-value">{incidents.length}</div>
          <div className={"kpi-delta " + (highIncidents > 0 ? "warn" : "")}>{highIncidents} high severity</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Staff on duty</div>
          <div className="kpi-value">128</div>
          <div className="kpi-delta">of 140 rostered</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Section density</div>
          <span className="tag">{zones.length} sections</span>
        </div>
        {density.map(d => (
          <div className="density-row" key={d.name}>
            <span className="density-name">{d.name}</span>
            <div className="density-track">
              <div className="density-fill" style={{ width: d.pct + "%", background: colors[d.level] }}></div>
            </div>
            <span className="density-val">{d.pct}%</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Incident log</div>
          <span className="tag">{incidents.length} open</span>
        </div>
        {incidents.map((inc, i) => (
          <div className="incident-row" key={i}>
            <div className={"sev-bar " + inc.sev}></div>
            <div>
              <div className="incident-title">{inc.title}</div>
              <div className="incident-meta">{inc.time} · {inc.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainContent;
