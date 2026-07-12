import React, { useState } from 'react';
import { getFullStateSnapshot } from '../data/stadiumState';

const cleanResponse = (raw) => {
  if (!raw) return '';
  let text = raw
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .trim();
  // Simple heuristic: if it looks like JSON, skip it
  if (text.startsWith('{') || text.startsWith('[')) {
    return 'Signal interrupted. Please try again.';
  }
  return text;
};

function OpsDashboard() {
  const [query, setQuery] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('live');

  const sampleQueries = [
    "Is Gate C likely to congest before kickoff?",
    "Which section will be fullest by second half?",
    "Best accessible route to Section D right now?"
  ];

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResp(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, state: getFullStateSnapshot() }),
      });
      const data = await res.json();
      
      if (data.reply) {
        setResp(cleanResponse(data.reply));
        setMode(data.mode || 'live');
      } else {
        setResp('An error occurred. Please try again.');
        setMode('demo');
      }
    } catch (err) {
      console.error(err);
      setResp('Connection failed.');
      setMode('demo');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { 
    setQuery(""); 
    setResp(null); 
  };

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Ops Intelligence</div>
        <div className="page-sub">Ask the venue a question in plain language</div>
      </div>
      <div className="panel">
        <div className="ask-grid">
          <div>
            <textarea 
              placeholder="e.g. Is Gate C likely to congest before kickoff?" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(); } }}
            />
            <div className="chip-row">
              {sampleQueries.map(q => (
                <button className="chip" key={q} onClick={() => setQuery(q)}>{q}</button>
              ))}
            </div>
            <div className="btn-row">
              <button className="btn-primary" onClick={handleRunQuery} disabled={loading}>
                {loading ? "Running…" : "Run query"}
              </button>
              <button className="btn-secondary" onClick={handleClear}>Clear</button>
            </div>
          </div>
          <div className="resp-shell">
            {!resp && !loading && <div className="resp-empty">Response will appear here</div>}
            {loading && <div className="resp-empty">Generating response…</div>}
            {resp && !loading && (
              <div>
                <div className={"resp-mode " + (mode === 'live' ? 'live' : '')}>
                  {mode === 'demo' ? 'Fallback' : 'Live response'}
                </div>
                <div className="resp-text">{resp}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpsDashboard;
