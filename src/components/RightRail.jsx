import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const RightRail = () => {
  const [input, setInput] = useState('');
  const [responseMsg, setResponseMsg] = useState('Nearest accessible restroom to Section D is 60m past Gate 4, on your left.');
  const [isTyping, setIsTyping] = useState(false);

  // We are now fetching securely via the proxy!
  const fetchResponse = async (userText) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      return data.reply || "Error fetching response.";
    } catch (error) {
      console.error(error);
      return "Network error. Make sure the proxy is running.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsTyping(true);
    setResponseMsg("...");

    const reply = await fetchResponse(input);
    setResponseMsg(reply);
    
    setInput('');
    setIsTyping(false);
  };

  return (
    <aside className="rail">
      <div>
        <div className="rail-block-title">Fan Assistant Preview</div>
        <div className="assist-widget">
          <div className="assist-head">
            <span className="assist-dot" style={{ background: 'var(--turf)' }}></span>
            <span className="assist-title">Multilingual Assist</span>
            <span className="assist-lang">EN ▾</span>
          </div>
          <div className="assist-msg">
            {isTyping ? <Loader2 size={14} className="animate-spin" /> : responseMsg}
          </div>
          <div className="assist-input">
            <input 
              type="text" 
              placeholder="Ask about routes, food, seating…" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            <button onClick={handleSend} disabled={isTyping}>Ask</button>
          </div>
        </div>
      </div>

      <div>
        <div className="rail-block-title">On-Duty Staff</div>
        <div className="staff-row">
          <div className="staff-avatar">RK</div>
          <div><div className="staff-name">R. Kapoor</div><div class="staff-role">Gate B Supervisor</div></div>
          <span className="status-chip on"></span>
        </div>
        <div className="staff-row">
          <div className="staff-avatar">MT</div>
          <div><div className="staff-name">M. Tan</div><div class="staff-role">Medical Lead</div></div>
          <span className="status-chip busy"></span>
        </div>
        <div className="staff-row">
          <div className="staff-avatar">AV</div>
          <div><div className="staff-name">A. Verma</div><div class="staff-role">Crowd Marshal</div></div>
          <span className="status-chip on"></span>
        </div>
      </div>

      <div>
        <div className="rail-block-title">Conditions</div>
        <div className="weather-block">
          <div className="weather-item"><div className="wl">Now</div><div className="wv">29°</div></div>
          <div class="weather-item"><div class="wl">19:00</div><div class="wv">27°</div></div>
          <div class="weather-item"><div class="wl">20:00</div><div class="wv">26°</div></div>
          <div class="weather-item"><div class="wl">21:00</div><div class="wv">25°</div></div>
        </div>
      </div>
    </aside>
  );
};

export default RightRail;
