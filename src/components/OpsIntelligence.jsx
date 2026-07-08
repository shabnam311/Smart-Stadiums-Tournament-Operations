import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const OpsIntelligence = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState(null);

  // We will call the Vercel Serverless Function proxy here instead of HF directly
  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      
      const data = await res.json();
      setResponse(data.reply || "Error fetching response");
    } catch (error) {
      console.error(error);
      setResponse("Network error: Could not reach the AI proxy. Make sure the serverless function is deployed.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="main">
      <div className="main-head">
        <div>
          <div className="main-title">Ops Intelligence</div>
          <div className="main-sub">Query live stadium signals using GenAI</div>
        </div>
      </div>

      <div className="legend-ops">
        <div className="legend-item"><span className="legend-dot" style={{background: 'var(--blue)'}}></span><span>CROWD FLOW</span></div>
        <div className="legend-item"><span className="legend-dot" style={{background: 'var(--red)'}}></span><span>INCIDENT</span></div>
        <div className="legend-item"><span className="legend-dot" style={{background: 'var(--amber)'}}></span><span>TRANSIT</span></div>
        <div className="legend-item"><span className="legend-dot" style={{background: 'var(--green)'}}></span><span>ACCESSIBILITY</span></div>
      </div>

      <section className="panels">
        <div className="panel-ops">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>ASK OPERATIONS AI</div>
          </div>
          <textarea 
            className="query-textarea"
            placeholder="Ask about crowd flow, incidents, transit, or access...&#10;&#10;Try: Is Gate C likely to congest before kickoff?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
          
          <div className="chips-row">
            <span className="try-label">TRY →</span>
            <button className="chip" onClick={() => setQuery('Is Gate C likely to congest before kickoff?')}>GATE C RISK</button>
            <button className="chip" onClick={() => setQuery('Which section will be fullest by second half?')}>2ND-HALF FORECAST</button>
            <button className="chip" onClick={() => setQuery('Best accessible route to Section D right now?')}>ACCESS ROUTE</button>
          </div>
          
          <div className="action-row">
            <button className="btn-run" onClick={handleRunQuery} disabled={isSearching}>
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : '▸ RUN QUERY'}
            </button>
            <button className="btn-ghost" onClick={() => { setQuery(''); setResponse(null); }}>CLEAR</button>
            <span className="char-count">{query.length} chars</span>
          </div>
        </div>

        <div className="panel-ops">
          <div className="panel-head">
            <div className="panel-title"><span className="bar"></span>RESPONSE</div>
          </div>
          
          {!response && !isSearching && (
            <div className="response-empty">
              <span className="label">AWAITING QUERY</span>
            </div>
          )}

          {isSearching && (
            <div className="response-empty">
               <Loader2 size={24} className="animate-spin" style={{ color: 'var(--turf)' }} />
               <span className="label">ANALYZING SIGNALS...</span>
            </div>
          )}

          {response && !isSearching && (
            <div className="response-filled show">
              <div className="resp-tag"><i></i>LIVE GENAI RESPONSE</div>
              <div className="resp-text">{response}</div>
              <div className="resp-meta">
                <span>SOURCE: /API/CHAT PROXY</span>
                <span>CONFIDENCE: HIGH</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default OpsIntelligence;
