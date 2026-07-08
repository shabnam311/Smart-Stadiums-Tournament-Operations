import React, { useState } from 'react';

const OpsDashboard = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [mode, setMode] = useState('live');

  const handleChipClick = (q) => {
    setQuery(q);
    document.getElementById('queryInput')?.focus();
  };

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      setResponse(data.reply);
      setMode(data.mode || 'demo');
    } catch (err) {
      setResponse("Network error connecting to Hugging Face.");
      setMode('demo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse(null);
  };

  return (
    <section className="panels">
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><span className="bar"></span>ASK OPERATIONS AI</div>
          <div className="mode-tabs"><span className="on">PLAIN QUERY</span></div>
        </div>
        <textarea 
          id="queryInput" 
          placeholder="Ask about crowd flow, incidents, transit, or access…&#10;&#10;Try: Is Gate C likely to congest before kickoff?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></textarea>
        <div className="action-row">
          <button className="btn-run" onClick={handleRunQuery} disabled={isLoading}>
            {isLoading ? "▸ RUNNING..." : "▸ RUN QUERY"}
          </button>
          <button className="btn-ghost" onClick={handleClear}>CLEAR</button>
          <span className="char-count">{query.length} chars</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><span className="bar"></span>RESPONSE</div>
        </div>
        
        {!response && !isLoading && (
          <div className="response-empty">
            <div className="radar">
              <svg viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="12"/>
                <circle cx="15" cy="15" r="7"/>
                <line className="sweep" x1="15" y1="15" x2="15" y2="3"/>
              </svg>
            </div>
            <span className="label">AWAITING QUERY</span>
          </div>
        )}

        {isLoading && (
          <div className="response-empty">
            <div className="radar">
              <svg viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="12"/>
                <circle cx="15" cy="15" r="7"/>
                <line className="sweep" x1="15" y1="15" x2="15" y2="3"/>
              </svg>
            </div>
            <span className="label">GENERATING...</span>
          </div>
        )}

        {response && !isLoading && (
          <div className="response-filled show">
            {mode === 'demo' ? (
              <div className="resp-tag" style={{borderColor: 'var(--c-transit)', color: 'var(--c-transit)'}}>
                <i style={{background: 'var(--c-transit)'}}></i>DEMO MODE · API UNREACHABLE
              </div>
            ) : (
              <div className="resp-tag"><i></i>LIVE AI RESPONSE</div>
            )}
            
            <div className="resp-text">{response}</div>
            <div className="resp-meta">
              <span>SOURCE: GENAI PROXY</span>
              <span>STATUS: {mode === 'demo' ? 'MOCK FALLBACK' : 'SECURE'}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OpsDashboard;
