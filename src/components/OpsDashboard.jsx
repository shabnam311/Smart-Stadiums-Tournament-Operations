import React, { useState, useEffect } from 'react';

const getContextByNER = (queryText, zones) => {
  const lower = queryText.toLowerCase();
  const totalOcc = zones.reduce((sum, z) => sum + z.occ, 0);
  const totalCap = zones.reduce((sum, z) => sum + z.cap, 0);
  const pct = Math.round((totalOcc / totalCap) * 100);
  const zoneDetails = zones.map(z => `${z.name} is ${Math.round((z.occ/z.cap)*100)}% full`).join(', ');

  let contextParts = [];

  // Restrooms
  if (lower.includes('restroom') || lower.includes('toilet') || lower.includes('washroom') || lower.includes('bathroom')) {
    contextParts.push('Restrooms: Available on all levels. Shortest queues are currently at Concourse A (North side).');
  }
  // Food
  if (lower.includes('food') || lower.includes('stall') || lower.includes('eat') || lower.includes('drink') || lower.includes('kiosk') || lower.includes('hungry') || lower.includes('beverage')) {
    contextParts.push(`Food & Beverage: Main food courts at Concourse A (North) and Concourse D (South). Smaller kiosks at every gate entrance. Section C is currently quite crowded at ${Math.round((zones[2].occ/zones[2].cap)*100)}% capacity, so nearby kiosks have longer lines.`);
  }
  // Gates & Congestion
  if (lower.includes('gate') || lower.includes('congest') || lower.includes('wait') || lower.includes('crowd') || lower.includes('busy') || lower.includes('queue')) {
    contextParts.push(`Gate Wait Times & Congestion: Gate A (2 min), Gate B (3 min), Gate C (8 min - elevated wait due to high-severity congestion building at turnstiles), Gate D (4 min). Elevator Bank B has a 6-minute wait.`);
  }
  // Transit
  if (lower.includes('transit') || lower.includes('metro') || lower.includes('bus') || lower.includes('park') || lower.includes('train')) {
    contextParts.push('Transit & Parking: Metro Line 2 is running at 4-minute intervals. Parking lots are 78% full.');
  }
  // Accessibility
  if (lower.includes('access') || lower.includes('wheelchair') || lower.includes('ramp') || lower.includes('elevator')) {
    contextParts.push('Accessibility: Ramp at Gate 4 is clear. Elevator Bank B has a 6-minute queue.');
  }
  // Weather
  if (lower.includes('weather') || lower.includes('temp') || lower.includes('hot') || lower.includes('rain')) {
    contextParts.push('Weather: 29C, clear skies, 68% humidity.');
  }
  // Incidents
  if (lower.includes('incident') || lower.includes('medical') || lower.includes('spill') || lower.includes('doctor') || lower.includes('emergency')) {
    contextParts.push('Active Incidents: 1 high-severity congestion at Gate C, 1 medical case in Section E (dehydration, attended), 1 minor spill in Concourse B.');
  }

  // Fallback to overall status if no specific entity matches
  if (contextParts.length === 0) {
    contextParts.push(`Overall Stadium Status: Occupancy is ${pct}% (${totalOcc.toLocaleString()} of ${totalCap.toLocaleString()} seats). Zone details: ${zoneDetails}. Incidents: 3 open.`);
  }

  return contextParts.join('\n');
};

const cleanResponse = (raw) => {
  if (!raw) return '';
  let text = raw
    .replace(/```[\s\S]*?```/g, '')        // remove code blocks
    .replace(/\{[\s\S]*?\}/g, '')          // remove JSON objects
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // unbold **text**
    .replace(/\*([^*]+)\*/g, '$1')         // unitalic *text*
    .replace(/^[\s*\-\u2022>#]+/gm, '')    // strip leading bullets, arrows, hashes
    .replace(/\n+/g, ' ')                  // join lines into one paragraph
    .replace(/\s{2,}/g, ' ')              // collapse multiple spaces
    .trim();
  // Deduplicate repeated sentences
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 5);
  const seen = new Set();
  const unique = sentences.filter(s => {
    const key = s.toLowerCase().replace(/[^a-z]/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.slice(0, 3).join(' ');
};

const initialZones = [
  { name: 'Section A, North', cap: 9725, occ: 3890, level: 'low' },
  { name: 'Section B, South', cap: 9725, occ: 6807, level: 'med' },
  { name: 'Section C, East', cap: 9725, occ: 8752, level: 'high' },
  { name: 'Section D, West', cap: 9725, occ: 3890, level: 'low' },
];

const initialFeed = [
  { type: 'recommendation', color: 'var(--c-crowd)', label: 'RECOMMENDATION', time: '18:05', text: 'Entry rate at Gate C is 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4-C6 for the next 20 minutes.', actionable: true },
  { type: 'incident', color: 'var(--c-incident)', label: 'HIGH SEVERITY', time: '18:04', title: 'Congestion building at Gate C turnstiles', text: 'Est. 6 min delay. Marshal dispatched.' },
  { type: 'incident', color: 'var(--c-transit)', label: 'MED SEVERITY', time: '17:52', title: 'Minor medical, dehydration, Section E', text: 'Attended. Monitoring.' },
];

const OpsDashboard = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [mode, setMode] = useState('live');
  const [zones, setZones] = useState(initialZones);

  // Live-simulate zone data every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setZones(prev => prev.map(z => {
        const delta = Math.floor(Math.random() * 41) - 20;
        const newOcc = Math.max(500, Math.min(z.cap, z.occ + delta));
        const pct = newOcc / z.cap;
        const newLevel = pct > 0.85 ? 'high' : pct > 0.6 ? 'med' : 'low';
        return { ...z, occ: newOcc, level: newLevel };
      }));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleChipClick = (q) => {
    setQuery(q);
  };

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, context: getContextByNER(query, zones) }),
      });
      const data = await res.json();
      if (data.reply) {
        setResponse(cleanResponse(data.reply));
        setMode(data.mode || 'live');
      } else {
        setResponse('An error occurred. Please try again.');
        setMode('demo');
      }
    } catch (err) {
      console.error(err);
      setResponse('Connection failed.');
      setMode('demo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse(null);
  };

  const getZoneColor = (level) => level === 'high' ? 'var(--c-incident)' : level === 'med' ? 'var(--c-transit)' : 'var(--c-access)';
  const getZoneLabel = (level) => level === 'high' ? 'HIGH RISK' : level === 'med' ? 'MODERATE' : 'COMFORTABLE';

  return (
    <>
      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi">
          <div className="label">Occupancy</div>
          <div className="kpi-val">71%<span className="kpi-delta up">{'\u2191'} 6%</span></div>
        </div>
        <div className="kpi">
          <div className="label">Avg. Entry Wait</div>
          <div className="kpi-val">4 min<span className="kpi-delta up">{'\u2193'} 1.5 min</span></div>
        </div>
        <div className="kpi">
          <div className="label">Open Incidents</div>
          <div className="kpi-val">3<span className="kpi-delta warn">1 high</span></div>
        </div>
        <div className="kpi">
          <div className="label">Waste Diverted</div>
          <div className="kpi-val">62%<span className="kpi-delta up">Target 60%</span></div>
        </div>
      </div>

      {/* AI Query + Response */}
      <section className="panels">
        <div className="panel query-panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>Ask Operations AI</div>
            <div className="status-inline"><span className="dot"></span>Connected</div>
          </div>
          <textarea
            id="queryInput"
            placeholder="Ask about crowd flow, incidents, transit, or access..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(); } }}
          />
          <div className="chips-row">
            <button className="chip" onClick={() => handleChipClick('Is Gate C likely to congest before kickoff?')}>Gate C congestion risk</button>
            <button className="chip" onClick={() => handleChipClick("What's the fastest transit route from Section B?")}>Transit from Section B</button>
            <button className="chip" onClick={() => handleChipClick('Any accessibility issues reported in the last hour?')}>Accessibility check</button>
          </div>
          <div className="action-row">
            <button className="btn-run" onClick={handleRunQuery} disabled={isLoading}>
              {isLoading ? '\u25b8 Running...' : '\u25b8 Run query'}
            </button>
            <button className="btn-ghost" onClick={handleClear}>Clear</button>
            <span className="char-count">{query.length} chars</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>Response</div>
          </div>

          {!response && !isLoading && (
            <div className="response-empty">
              <div className="pulse-grid"><span></span><span></span><span></span><span></span><span></span></div>
              <span className="label">Awaiting query</span>
            </div>
          )}

          {isLoading && (
            <div className="response-empty">
              <div className="pulse-grid"><span></span><span></span><span></span><span></span><span></span></div>
              <span className="label">Generating...</span>
            </div>
          )}

          {response && !isLoading && (
            <div>
              {mode === 'demo' ? (
                <div className="resp-tag" style={{borderColor: 'var(--c-transit)', color: 'var(--c-transit)'}}>
                  <i style={{background: 'var(--c-transit)'}}></i>Local Fallback
                </div>
              ) : (
                <div className="resp-tag"><i></i>Live AI response</div>
              )}
              <div className="resp-text">{response}</div>
              <div className="resp-meta">
                <span>SOURCE: {mode === 'demo' ? 'Local Engine' : 'Google GenAI'}</span>
                <span>MODEL: gemini-2.0-flash</span>
                <span>STATUS: {mode === 'demo' ? 'Secure (Local)' : 'Secure'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Crowd Density + Ops Feed */}
      <section className="panels">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>Crowd Density, Stadium Bowl</div>
          </div>
          {zones.map((z, i) => {
            const pct = Math.round((z.occ / z.cap) * 100);
            const color = getZoneColor(z.level);
            return (
              <div className="zone" key={i}>
                <div className="zone-top">
                  <span className="zone-name">{z.name}</span>
                  <span className="zone-tag" style={{borderColor: color, color: color}}><i style={{background: color}}></i>{getZoneLabel(z.level)}</span>
                </div>
                <div className="zone-meta">
                  <span>{z.occ.toLocaleString()} / {z.cap.toLocaleString()} capacity</span>
                  <span>{pct}%</span>
                </div>
                <div className="zone-bar"><div style={{width: `${pct}%`, background: color}}></div></div>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>Ops Intelligence Feed</div>
          </div>
          {initialFeed.map((item, i) => (
            <div className="row" key={i}>
              <div className="row-top">
                <span className="zone-tag" style={{borderColor: item.color, color: item.color}}><i style={{background: item.color}}></i>{item.label}</span>
                <span className="row-time">{item.time}</span>
              </div>
              {item.title && <div className="row-title">{item.title}</div>}
              <div className="row-meta">{item.text}</div>
              {item.actionable && (
                <div className="row-actions">
                  <button className="accept">Dispatch</button>
                  <button className="dismiss">Dismiss</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default OpsDashboard;
