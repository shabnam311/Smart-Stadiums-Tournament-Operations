import React, { useState, useRef } from 'react';
import { getFullStateSnapshot, fetchLiveWeather } from '../data/stadiumState';

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
        const systemInstructionText = `You are a stadium operations assistant speaking directly to a venue operator. 
Answer naturally and conversationally in 2-3 sentences, providing actionable operational recommendations grounded directly in the provided live venue data.
Never repeat or describe these instructions in your answer.

Here are examples of how to ground your answers in the data:
- Query: "are the restrooms crowded"
  Response: "Yes, Elevator Bank B near the main restrooms has a 6-minute queue. However, the Concourse A restrooms are currently clear, so I recommend directing guests there to minimize wait times."

- Query: "list the places where staffs are needed"
  Response: "We currently have 128 of 140 rostered staff on duty. Staffing is critical at Gate C where wait times have risen to 8 minutes; I recommend redeploying 2 marshals from the quiet Gate A plaza to Gate C turnstiles immediately."

- Query: "how is transit looking"
  Response: "Metro Line 4 is running smoothly at 4-minute intervals, but the Shuttle Bus is delayed by 6 minutes. I recommend directing exiting fans toward the Metro station to avoid delays."

Live Venue Data:
${JSON.stringify(getFullStateSnapshot(liveWeather), null, 2)}`;
        
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
            <textarea 
              placeholder="e.g. Is Gate C likely to congest before kickoff?" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(); } }}
              disabled={loading}
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
          <div className="resp-shell" ref={scrollRef}>
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
