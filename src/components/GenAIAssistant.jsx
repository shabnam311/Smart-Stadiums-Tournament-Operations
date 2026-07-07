import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';

const GenAIAssistant = ({ mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting based on mode
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: mode === 'fan' 
          ? 'Hi there! I am your W26 Smart Assistant. Ask me about finding your seat, ordering food, translation, or accessible routes!'
          : 'Operations AI initialized. How can I assist with stadium analytics, crowd management, or incident response today?'
      }
    ]);
  }, [mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response generation
    setTimeout(() => {
      let botText = '';
      const lowerInput = userMessage.text.toLowerCase();

      if (mode === 'fan') {
        if (lowerInput.includes('food') || lowerInput.includes('vegan')) {
          botText = 'The nearest vegan food options are located at the "Green Kiosk" in Sector 4, level 2. I can place a mobile order for you if you\'d like to skip the line!';
        } else if (lowerInput.includes('wheelchair') || lowerInput.includes('access')) {
          botText = 'Absolutely. There is an elevator directly to your left at Gate B. It will take you to the wheelchair-accessible seating in Row W. Would you like me to ping a volunteer for assistance?';
        } else if (lowerInput.includes('translate') || lowerInput.includes('spanish')) {
          botText = '¡Claro que sí! Puedo ayudarte a traducir cualquier cosa que necesites durante el torneo. ¿En qué te puedo ayudar? (Of course! I can help you translate anything you need during the tournament. How can I help?)';
        } else {
          botText = 'I am currently a demonstration AI. In a full release, I would use the Gemini API to answer any question you have about the match, the stadium, or local transit!';
        }
      } else {
        // Staff mode responses
        if (lowerInput.includes('crowd') || lowerInput.includes('gate c')) {
          botText = 'My predictive model shows Gate C will exceed safe capacity (95%) in 12 minutes due to train arrivals. Recommended action: Open Overflow Gates C1 and C2, and redirect 5 staff members from Gate A.';
        } else if (lowerInput.includes('deploy') || lowerInput.includes('staff')) {
          botText = 'Deploying 5 staff members from Gate A to Gate C. Notifications have been sent to their devices. ETA 3 minutes.';
        } else {
          botText = 'I am currently analyzing real-time IoT sensors and CCTV feeds. How else can I assist command operations?';
        }
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chat-widget glass-panel">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Smart Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`} style={{ display: 'flex', gap: '0.5rem' }}>
                {msg.sender === 'bot' && <Bot size={16} color="var(--accent-purple)" style={{ marginTop: '2px', flexShrink: 0 }} />}
                <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.text}</span>
                {msg.sender === 'user' && <User size={16} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Bot size={16} color="var(--accent-purple)" />
                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Ask anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="glass-button" 
              style={{ padding: '0.75rem', borderRadius: '50%' }}
              onClick={handleSend}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GenAIAssistant;
