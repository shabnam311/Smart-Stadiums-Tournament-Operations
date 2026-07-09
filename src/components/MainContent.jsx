import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const templateZones = [
  { name: 'Section A - North', rate: 15, med: 'Gate A1 - 40m', acc: '3 of 4', level: 'low' },
  { name: 'Section B - South', rate: 18, med: 'Gate B2 - 80m', acc: '4 of 4', level: 'med' },
  { name: 'Section C - East', rate: 22, med: 'Gate C1 - 60m', acc: '2 of 3', level: 'high' },
  { name: 'Section D - West', rate: 12, med: 'Gate D4 - 30m', acc: '4 of 4', level: 'low' },
];

const initialIncidents = [
  { sev:"high", title:"Congestion building at Gate C turnstiles", time:"18:04", meta:"Est. 6 min delay - Marshal dispatched", tag:"Access" },
  { sev:"med",  title:"Minor medical - dehydration, Section E", time:"17:52", meta:"Attended - monitoring", tag:"Medical" },
  { sev:"low",  title:"Signage misaligned near Gate A3", time:"17:31", meta:"Logged for post-match maintenance", tag:"Facilities" },
];

const initialInsights = [
  { time:"18:05", text:"Entry rate at Gate C is 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4-C6 for the next 20 minutes." , actionable:true},
  { time:"17:58", text:"Section G density trending toward 92% by second half. Suggest pre-positioning two additional marshals at the West Stand concourse." , actionable:true},
  { time:"17:40", text:"Multilingual assist requests up 3x in Spanish and Portuguese over the last 30 minutes, concentrated near Gate B. Consider routing a bilingual volunteer there." , actionable:false},
];

const MainContent = () => {
  const { venue } = useOutletContext();
  const [time, setTime] = useState('--:--:--');
  
  const [zonesData, setZonesData] = useState(() => {
    const baseCap = Math.floor(venue.capacity / templateZones.length);
    return templateZones.map((z) => {
      const pct = z.level === 'high' ? 0.9 : z.level === 'med' ? 0.7 : 0.4;
      return { ...z, cap: baseCap, occ: Math.floor(baseCap * pct) };
    });
  });

  const [incidents] = useState(initialIncidents);
  const [insights] = useState(initialInsights);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB'));
    tick();
    const clockInterval = setInterval(tick, 1000);

    const dataInterval = setInterval(() => {
      setZonesData(prevZones => prevZones.map(zone => {
        const occChange = Math.floor(Math.random() * 21) - 10;
        let newOcc = Math.max(0, Math.min(zone.cap, zone.occ + occChange));
        let pct = newOcc / zone.cap;
        let newLevel = pct > 0.85 ? 'high' : pct > 0.6 ? 'med' : 'low';
        return { ...zone, occ: newOcc, level: newLevel };
      }));
    }, 3000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <main className="main">
      <div className="main-head">
        <div>
          <div className="main-title">Operations Overview</div>
          <div className="main-sub">FIFA World Cup 2026 - Challenge 4 - Smart Stadiums &amp; Tournament Operations</div>
        </div>
        <div className="updated" style={{fontFamily:'IBM Plex Mono', fontSize:'11px', color:'var(--text-faint)'}}>
          Last synced <b style={{color:'var(--text-dim)'}}>{time}</b>
        </div>
      </div>

      <section className="panels" style={{marginBottom: '20px'}}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>KEY PERFORMANCE INDICATORS</div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div>
              <div className="label">Occupancy</div>
              <div style={{fontSize: '24px', fontWeight: '500', color: 'var(--text)'}}>71% <span style={{fontSize: '12px', color: 'var(--c-access)'}}>↑ 6% vs. last hour</span></div>
            </div>
            <div>
              <div className="label">Avg. Entry Wait</div>
              <div style={{fontSize: '24px', fontWeight: '500', color: 'var(--text)'}}>4 min <span style={{fontSize: '12px', color: 'var(--c-access)'}}>↓ 1.5 min</span></div>
            </div>
            <div>
              <div className="label">Open Incidents</div>
              <div style={{fontSize: '24px', fontWeight: '500', color: 'var(--text)'}}>{incidents.length} <span style={{fontSize: '12px', color: 'var(--c-incident)'}}>1 flagged high</span></div>
            </div>
            <div>
              <div className="label">Waste Diverted</div>
              <div style={{fontSize: '24px', fontWeight: '500', color: 'var(--text)'}}>62% <span style={{fontSize: '12px', color: 'var(--c-access)'}}>Target 60%</span></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>CROWD DENSITY (STADIUM BOWL)</div>
          </div>
          {zonesData.map((z, i) => {
            const pct = Math.round((z.occ / z.cap) * 100);
            const color = z.level === 'high' ? 'var(--c-incident)' : z.level === 'med' ? 'var(--c-transit)' : 'var(--c-access)';
            const label = z.level === 'high' ? 'HIGH RISK' : z.level === 'med' ? 'MODERATE' : 'COMFORTABLE';
            return (
              <div key={i} style={{marginBottom: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <strong style={{color: 'var(--text)', fontSize: '14px'}}>{z.name}</strong>
                  <div className="resp-tag" style={{borderColor: color, color: color, margin: 0}}>
                    <i style={{background: color}}></i>{label}
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px'}}>
                  <span>{z.occ.toLocaleString()} / {z.cap.toLocaleString()} capacity</span>
                  <span>{pct}%</span>
                </div>
                <div style={{width: '100%', height: '4px', background: 'var(--line)', borderRadius: '2px', overflow: 'hidden'}}>
                  <div style={{width: `${pct}%`, height: '100%', background: color, transition: 'width 0.5s ease'}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panels">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>INCIDENT LOG</div>
          </div>
          {incidents.map((inc, i) => {
             const color = inc.sev === 'high' ? 'var(--c-incident)' : inc.sev === 'med' ? 'var(--c-transit)' : 'var(--c-access)';
             return (
               <div key={i} style={{marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--line-soft)'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                   <div className="resp-tag" style={{borderColor: color, color: color, margin: 0}}>
                     <i style={{background: color}}></i>{inc.sev.toUpperCase()} SEVERITY
                   </div>
                   <div style={{fontFamily: 'IBM Plex Mono', fontSize: '11px', color: 'var(--text-faint)'}}>{inc.time}</div>
                 </div>
                 <div className="resp-text" style={{minHeight: 'auto'}}>
                   <strong style={{color: 'var(--text)'}}>{inc.title}</strong><br/>
                   {inc.meta}
                 </div>
               </div>
             );
          })}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>OPS INTELLIGENCE FEED (GENAI)</div>
          </div>
          {insights.map((ins, i) => (
             <div key={i} style={{marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--line-soft)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                 <div className="resp-tag" style={{borderColor: 'var(--c-crowd)', color: 'var(--c-crowd)', margin: 0}}>
                   <i style={{background: 'var(--c-crowd)'}}></i>RECOMMENDATION
                 </div>
                 <div style={{fontFamily: 'IBM Plex Mono', fontSize: '11px', color: 'var(--text-faint)'}}>{ins.time}</div>
               </div>
               <div className="resp-text" style={{minHeight: 'auto', marginBottom: '12px'}}>
                 {ins.text}
               </div>
               {ins.actionable && (
                 <div className="action-row" style={{marginTop: 0}}>
                   <button className="btn-run" style={{padding: '6px 12px', fontSize: '10px'}}>DISPATCH</button>
                   <button className="btn-ghost" style={{padding: '6px 12px', fontSize: '10px'}}>DISMISS</button>
                 </div>
               )}
             </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default MainContent;
