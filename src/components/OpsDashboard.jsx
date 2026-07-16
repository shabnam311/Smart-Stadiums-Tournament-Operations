import React, { useState, useRef } from 'react';
import { getFullStateSnapshot, fetchLiveWeather } from '../data/stadiumState';
import { buildSystemInstruction } from '../data/prompt';

const cleanResponse = (raw) => {
  if (!raw) return '';
  let text = raw
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .trim();
  // Check if it's a JSON leak rather than simple prose starting with { or [
  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && (parsed.query !== undefined || parsed.state !== undefined || parsed.systemInstruction !== undefined)) {
        return 'Signal interrupted. Please try again.';
      }
    } catch {
      // Not valid JSON, keep it
    }
  }
  return text;
};

function OpsDashboard() {
  const [query, setQuery] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('live');
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);

  const sampleQueries = [
    "Is Gate C likely to congest before kickoff?",
    "Which section will be fullest by second half?",
    "Best accessible route to Section D right now?"
  ];

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setIsTyping(false);
      return;
    }

    setLoading(true);
    setIsTyping(true);
    setResp("");
    
    abortControllerRef.current = new AbortController();

    const isDev = import.meta.env.DEV;
    const localApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_KEY;

    try {
      const liveWeather = await fetchLiveWeather();
      let res;
      // Dual-path: If running locally in development mode with a key, direct-call Gemini to bypass Vite's lack of serverless proxy
      if (isDev && localApiKey) {
        setMode('live');
        const systemInstructionText = buildSystemInstruction(getFullStateSnapshot(liveWeather));
        
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse&key=${localApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstructionText }] },
            contents: [{ role: 'user', parts: [{ text: query }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 2048
            }
          }),
          signal: abortControllerRef.current.signal
        });
      } else {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, state: getFullStateSnapshot(liveWeather) }),
          signal: abortControllerRef.current.signal
        });
      }

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let isFirstChunk = true;
      let currentEventType = 'live';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (isFirstChunk) {
          setIsTyping(false);
          isFirstChunk = false;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line for next chunk

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEventType = line.slice(6).trim();
            if (currentEventType === 'fallback') setMode('demo');
            if (currentEventType === 'live') setMode('live');
          }
          if (!line.startsWith('data:')) continue;
          
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (delta) {
              setResp(prev => prev + delta);
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }
          } catch {
            // ignore JSON parse errors for incomplete chunks
          }
        }
      }
      
      setResp(prev => cleanResponse(prev));

    } catch (err) {
      if (err.name === 'AbortError') {
        setResp(prev => prev + " [Cancelled]");
      } else {
        console.error(err);
        setResp('Connection failed.');
        setMode('demo');
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleClear = () => { 
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setQuery(""); 
    setResp(null); 
    setLoading(false);
    setIsTyping(false);
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
            <label htmlFor="queryInput" className="visually-hidden">Enter operations query</label>
            <textarea 
              id="queryInput"
              placeholder="e.g. Is Gate C likely to congest before kickoff?" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(); } }}
              disabled={loading}
              maxLength={2000}
            />
            <div className="chip-row">
              {sampleQueries.map(q => (
                <button className="chip" key={q} onClick={() => setQuery(q)} disabled={loading}>{q}</button>
              ))}
            </div>
            <div className="btn-row">
              <button 
                className={loading ? "btn-secondary" : "btn-primary"} 
                onClick={handleRunQuery}
                style={{ backgroundColor: loading ? 'var(--c-incident)' : undefined }}
              >
                {loading ? "Stop Generation" : "Run query"}
              </button>
              <button className="btn-secondary" onClick={handleClear}>Clear</button>
            </div>
          </div>
          <div className="resp-shell" ref={scrollRef} aria-live="polite" aria-atomic="false">
            {!resp && !isTyping && <div className="resp-empty">Response will appear here</div>}
            {(resp || isTyping || loading) && (
              <div>
                <div className={"resp-mode " + (mode === 'live' ? 'live' : '')}>
                  {loading 
                    ? (mode === 'live' ? 'Connecting to Live AI…' : 'Generating Fallback…') 
                    : (mode === 'demo' ? 'Fallback' : 'Live response')
                  }
                </div>
                {isTyping && <div className="resp-empty typing-indicator">· ·· ···</div>}
                {resp && <div className="resp-text" style={{ whiteSpace: 'pre-wrap' }}>{resp}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpsDashboard;
