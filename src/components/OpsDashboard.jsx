import React, { useState } from 'react';

const OpsDashboard = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

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
    } catch (err) {
      setResponse("Network error connecting to Hugging Face.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse(null);
  };

  return (
    <div className="wrap">
      <nav>
        <div className="logo">
          <div className="logo-mark"></div>
          <div className="logo-text">PITCHSIDE · <b>OPS</b></div>
        </div>
        <div className="nav-pills">
          <span className="pill live">V1 · DEMO</span>
          <span className="pill">FREE-TIER GENAI</span>
        </div>
        <div className="nav-links">
          <a href="#">GITHUB</a>
          <a href="#">ABOUT</a>
          <a href="#">MODEL</a>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow">
          <span className="rule"></span>
          <span className="label">OPERATIONS INTELLIGENCE · FIFA WORLD CUP 2026</span>
        </div>
        <h1>Ask the stadium<br/><em>what happens next.</em></h1>
        <p className="hero-sub">A GenAI layer over your venue's live signals. Query crowd flow, incidents, transit, and access in plain language — get a decision, not another dashboard.</p>

        <div className="legend">
          <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-crowd)"}}></span><span>CROWD FLOW</span></div>
          <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-incident)"}}></span><span>INCIDENT</span></div>
          <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-transit)"}}></span><span>TRANSIT</span></div>
          <div className="legend-item"><span className="legend-dot" style={{background:"var(--c-access)"}}></span><span>ACCESSIBILITY</span></div>
        </div>
      </section>

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
          <div className="chips-row">
            <span className="try-label">TRY →</span>
            <button className="chip" onClick={() => handleChipClick("Is Gate C likely to congest before kickoff?")}>GATE C RISK</button>
            <button className="chip" onClick={() => handleChipClick("Which section will be fullest by second half?")}>2ND-HALF FORECAST</button>
            <button className="chip" onClick={() => handleChipClick("Best accessible route to Section D right now?")}>ACCESS ROUTE</button>
          </div>
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
              <div className="resp-tag"><i></i>LIVE AI RESPONSE</div>
              <div className="resp-text">{response}</div>
              <div className="resp-meta">
                <span>SOURCE: GENAI PROXY</span>
                <span>STATUS: SECURE</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="info-grid">
        <div className="info-block">
          <div className="label">MODEL</div>
          <p>Runs on a <b>free-tier open-weight model</b> via Hugging Face Inference — no paid API keys required. Falls back to local mock responses when no token is configured, so the demo always works.</p>
        </div>
        <div className="info-block">
          <div className="label">DEPLOYMENT</div>
          <p>Static frontend with a <b>serverless proxy</b> for the model call, so credentials never reach the browser. Deploys free on Vercel or Netlify, linked directly to GitHub.</p>
        </div>
      </section>

      <footer>
        <span>PITCHSIDE OPS · 2026 · DEMO</span>
        <div className="foot-links">
          <a href="#">GITHUB</a>
          <a href="#">MODEL CARD</a>
          <a href="#">ABOUT</a>
        </div>
      </footer>
    </div>
  );
};

export default OpsDashboard;
