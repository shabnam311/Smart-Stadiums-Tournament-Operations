import React, { useState, useEffect } from 'react';

const zonesData = [
  { name:"Section A — North Stand", occ:2140, cap:2600, rate:18, med:"Gate B2 · 90m", acc:"3 of 3", level:"med" },
  { name:"Section B — North-East", occ:1980, cap:2400, rate:14, med:"Gate B2 · 140m", acc:"2 of 2", level:"low" },
  { name:"Section C — East Stand", occ:2510, cap:2600, rate:22, med:"Gate C1 · 60m", acc:"2 of 3", level:"high" },
  { name:"Section D — South-East", occ:1870, cap:2400, rate:11, med:"Gate C3 · 110m", acc:"2 of 2", level:"low" },
  { name:"Section E — South Stand", occ:2020, cap:2600, rate:16, med:"Gate D1 · 80m", acc:"3 of 3", level:"med" },
  { name:"Section F — South-West", occ:1690, cap:2400, rate:9,  med:"Gate D3 · 130m", acc:"2 of 2", level:"low" },
  { name:"Section G — West Stand", occ:2380, cap:2600, rate:20, med:"Gate A1 · 70m", acc:"3 of 3", level:"high" },
  { name:"Section H — North-West", occ:1750, cap:2400, rate:12, med:"Gate A3 · 100m", acc:"2 of 2", level:"low" },
];

const colors = { low:"#2c7a4c", med:"#d99a3d", high:"#c85c4a" };

const polarToXY = (cx, cy, r, angleDeg) => {
  const a = (angleDeg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

const arcPath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
  const [x1,y1] = polarToXY(cx, cy, rOuter, startAngle);
  const [x2,y2] = polarToXY(cx, cy, rOuter, endAngle);
  const [x3,y3] = polarToXY(cx, cy, rInner, endAngle);
  const [x4,y4] = polarToXY(cx, cy, rInner, startAngle);
  const large = (endAngle - startAngle) > 180 ? 1 : 0;
  return `M${x1},${y1} A${rOuter},${rOuter} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${rInner},${rInner} 0 ${large} 0 ${x4},${y4} Z`;
};

const incidents = [
  { sev:"high", title:"Congestion building at Gate C turnstiles", time:"18:04", meta:"Est. 6 min delay · Marshal dispatched", tag:"Access" },
  { sev:"med",  title:"Minor medical — dehydration, Section E", time:"17:52", meta:"Attended · monitoring", tag:"Medical" },
  { sev:"low",  title:"Signage misaligned near Gate A3", time:"17:31", meta:"Logged for post-match maintenance", tag:"Facilities" },
];

const insights = [
  { time:"18:05", text:"Entry rate at Gate C is 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4–C6 for the next 20 minutes." , actionable:true},
  { time:"17:58", text:"Section G density trending toward 92% by second half. Suggest pre-positioning two additional marshals at the West Stand concourse." , actionable:true},
  { time:"17:40", text:"Multilingual assist requests up 3x in Spanish and Portuguese over the last 30 minutes, concentrated near Gate B. Consider routing a bilingual volunteer there." , actionable:false},
];

const MainContent = () => {
  const [time, setTime] = useState('--:--:--');
  const [activeZone, setActiveZone] = useState(2);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-GB'));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const z = zonesData[activeZone];
  const pct = Math.round((z.occ / z.cap) * 100);

  return (
    <main className="main">
      <div className="main-head">
        <div>
          <div className="main-title">Operations Overview</div>
          <div className="main-sub">FIFA World Cup 2026 · Challenge 4 — Smart Stadiums &amp; Tournament Operations</div>
        </div>
        <div className="updated">Last synced <b className="mono">{time}</b></div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Occupancy</div>
          <div className="kpi-value">71<small>%</small></div>
          <div className="kpi-delta up">↑ 6% vs. last hour</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg. Entry Wait</div>
          <div className="kpi-value">4<small>min</small></div>
          <div className="kpi-delta up">↓ 1.5 min</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Open Incidents</div>
          <div className="kpi-value">3</div>
          <div className="kpi-delta warn">1 flagged high</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Staff on Duty</div>
          <div className="kpi-value">128</div>
          <div className="kpi-delta">of 140 rostered</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Waste Diverted</div>
          <div className="kpi-value">62<small>%</small></div>
          <div className="kpi-delta up">Target 60%</div>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Crowd Density — <b>Stadium Bowl</b></div>
            <div className="legend">
              <span><i style={{background:"#2c7a4c"}}></i>Low</span>
              <span><i style={{background:"#d99a3d"}}></i>Moderate</span>
              <span><i style={{background:"#c85c4a"}}></i>High</span>
            </div>
          </div>
          <div className="bowl-wrap">
            <svg className="bowl-map" width="260" height="260" viewBox="0 0 260 260">
              <circle className="pitch" cx="130" cy="130" r="58"/>
              {zonesData.map((zone, i) => {
                const segAngle = 360 / zonesData.length;
                const start = i * segAngle;
                const end = start + segAngle - 3;
                return (
                  <path 
                    key={i}
                    d={arcPath(130, 130, 118, 68, start, end)}
                    className={`zone ${i === activeZone ? 'selected' : ''}`}
                    fill={colors[zone.level]}
                    onClick={() => setActiveZone(i)}
                  />
                )
              })}
            </svg>
            <div className="zone-detail">
              <div className="zd-name">{z.name}</div>
              <div className="zd-row"><span className="zd-label">Current occupancy</span><span className="zd-val">{z.occ.toLocaleString()} / {z.cap.toLocaleString()}</span></div>
              <div className="zd-row"><span className="zd-label">Entry rate</span><span className="zd-val">{z.rate} / min</span></div>
              <div className="zd-row"><span className="zd-label">Nearest medical post</span><span className="zd-val">{z.med}</span></div>
              <div className="zd-row"><span className="zd-label">Accessible routes open</span><span className="zd-val">{z.acc}</span></div>
              <div>
                <div className="zd-bar-track"><div className="zd-bar-fill" style={{ width: `${pct}%`, background: colors[z.level] }}></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Incident Log</div>
            <span className="tag">3 open</span>
          </div>
          <div>
            {incidents.map((inc, i) => (
              <div key={i} className="incident">
                <div className={`sev ${inc.sev}`}></div>
                <div className="incident-body">
                  <div className="incident-top">
                    <div className="incident-title">{inc.title}</div>
                    <div className="incident-time mono">{inc.time}</div>
                  </div>
                  <div className="incident-meta">{inc.meta}</div>
                  <span className="tag">{inc.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', marginTop: '16px' }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Ops Intelligence Feed <b>— GenAI</b></div>
            <span className="tag">Auto-generated</span>
          </div>
          <div>
            {insights.map((ins, i) => (
              <div key={i} className="insight">
                <div className="insight-head">
                  <span className="insight-src">Recommendation</span>
                  <span className="insight-time mono">{ins.time}</span>
                </div>
                <div className="insight-text">{ins.text}</div>
                {ins.actionable && (
                  <div className="insight-actions">
                    <button className="btn-mini primary">Dispatch</button>
                    <button className="btn-mini">Dismiss</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
