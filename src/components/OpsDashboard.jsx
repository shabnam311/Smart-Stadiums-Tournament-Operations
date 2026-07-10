import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;
const MODEL = 'gemma-4-26b-a4b-it';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const getSystemPrompt = (zones) => {
  const totalOcc = zones.reduce((sum, z) => sum + z.occ, 0);
  const totalCap = zones.reduce((sum, z) => sum + z.cap, 0);
  const pct = Math.round((totalOcc / totalCap) * 100);
  const zoneDetails = zones.map(z => `- ${z.name}: ${z.occ.toLocaleString()}/${z.cap.toLocaleString()} capacity (${Math.round((z.occ/z.cap)*100)}%) - ${z.level.toUpperCase()} RISK`).join('\n');

  return `You are PITCHSIDE, an Ops Intelligence AI for venue operations staff at a FIFA World Cup 2026 stadium during a live match.

Context you always know:
- Current stadium occupancy: ${pct}% (${totalOcc.toLocaleString()} of ${totalCap.toLocaleString()} seats filled)
- Stadium Zone Density:
${zoneDetails}
- Active incidents: 3 (1 high-severity congestion at Gate C, 1 medical in Section E, 1 minor spill in concourse B)
- Weather: 29C, 68% humidity, clear skies
- Staff on duty: 128 of 140 rostered
- Entry wait times: Gate A 2min, Gate B 3min, Gate C 8min (elevated), Gate D 4min
- Sustainability: Waste diversion at 62% (above 60% target)
- Transit: Metro Line 2 running 4-min intervals, parking lots 78% full
- Accessibility: Ramp at Gate 4 clear, Elevator Bank B has 6-min queue
- Food and beverage: Main food courts at Concourse A (North) and Concourse D (South), smaller kiosks at every gate entrance
- Restrooms: Available at all concourse levels, shortest queues currently at Concourse A
- Fan zones: Main fan zone at Gate A plaza, family zone near Section B

CRITICAL RULES:
- Output ONLY the final answer. Do NOT show your reasoning, thinking, bullet points, asterisks, or any internal process.
- Never output lines starting with * or - that describe your thought process.
- Just give the direct answer in plain sentences, 2-3 sentences max.
- Be concise and decisive. Never say you are an AI language model or that you cannot access real data.
- Always respond in character as if you have live sensor feeds.
- Format: (1) current situation with one data point, (2) actionable recommendation, (3) one-sentence reason why.`;
};

const initialZones = [
  { name: 'Section A \u2014 North', cap: 9725, occ: 3890, level: 'low' },
  { name: 'Section B \u2014 South', cap: 9725, occ: 6807, level: 'med' },
  { name: 'Section C \u2014 East', cap: 9725, occ: 8752, level: 'high' },
  { name: 'Section D \u2014 West', cap: 9725, occ: 3890, level: 'low' },
];

const initialFeed = [
  { type: 'recommendation', color: 'var(--c-crowd)', label: 'RECOMMENDATION', time: '18:05', text: 'Entry rate at Gate C is 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4\u2013C6 for the next 20 minutes.', actionable: true },
  { type: 'incident', color: 'var(--c-incident)', label: 'HIGH SEVERITY', time: '18:04', title: 'Congestion building at Gate C turnstiles', text: 'Est. 6 min delay \u2014 marshal dispatched.' },
  { type: 'incident', color: 'var(--c-transit)', label: 'MED SEVERITY', time: '17:52', title: 'Minor medical \u2014 dehydration, Section E', text: 'Attended \u2014 monitoring.' },
];

const OpsDashboard = () => {
  const ctx = useOutletContext() || {};
  const clock = ctx.clock || '--:--:--';
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
      const currentSystemPrompt = getSystemPrompt(zones);
      
      // Try the direct Google REST API first (client-side)
      if (GEMINI_API_KEY) {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: currentSystemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: query }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
          }),
        });
        const data = await res.json();
        if (!data.error) {
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            setResponse(reply);
            setMode('live');
            setIsLoading(false);
            return;
          }
        }
      }
      // Fallback to serverless proxy
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, systemPrompt: currentSystemPrompt }),
      });
      const data = await res.json();
      setResponse(data.reply);
      setMode(data.mode || 'demo');
    } catch (_err) {
      setResponse('Temporary signal loss from venue sensors. Please retry your query in a moment.');
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
            placeholder="Ask about crowd flow, incidents, transit, or access\u2026"
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
              {isLoading ? '\u25b8 Running\u2026' : '\u25b8 Run query'}
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
              <span className="label">Generating{'\u2026'}</span>
            </div>
          )}

          {response && !isLoading && (
            <div>
              {mode === 'demo' ? (
                <div className="resp-tag" style={{borderColor: 'var(--c-transit)', color: 'var(--c-transit)'}}>
                  <i style={{background: 'var(--c-transit)'}}></i>RECONNECTING
                </div>
              ) : (
                <div className="resp-tag"><i></i>Live AI response</div>
              )}
              <div className="resp-text">{response}</div>
              <div className="resp-meta">
                <span>SOURCE: Google GenAI</span>
                <span>MODEL: {MODEL}</span>
                <span>STATUS: {mode === 'demo' ? 'Retrying' : 'Secure'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Crowd Density + Ops Feed */}
      <section className="panels">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>Crowd Density {'\u2014'} Stadium Bowl</div>
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
