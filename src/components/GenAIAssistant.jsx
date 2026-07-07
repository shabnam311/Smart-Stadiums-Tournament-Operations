import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, KeyRound } from 'lucide-react';

const GenAIAssistant = ({ mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const hfToken = import.meta.env.VITE_HF_TOKEN;
  const isHfEnabled = hfToken && hfToken !== 'your_hugging_face_token_here';

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: mode === 'fan' 
          ? 'Hi there! I am your W26 Smart Assistant powered by GenAI. Ask me about finding your seat, ordering food, translation, or accessible routes!'
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

  const fetchHuggingFaceResponse = async (userText) => {
    const systemContext = mode === 'fan' 
      ? "You are a helpful, enthusiastic AI assistant for fans at the 2026 World Cup. Help them with food, navigation, and translations. Keep answers concise."
      : "You are an analytical Operations AI for stadium staff. Provide concise, data-driven advice on crowd management, security, and stadium operations.";
    
    // Using Zephyr-7B as it's excellent for chat and usually available on the free Inference API
    const model = "HuggingFaceH4/zephyr-7b-beta";
    const prompt = `<|system|>\n${systemContext}</s>\n<|user|>\n${userText}</s>\n<|assistant|>\n`;

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ 
            inputs: prompt,
            parameters: { max_new_tokens: 150, temperature: 0.7 }
          }),
        }
      );

      const result = await response.json();
      
      if (result.error) {
        console.error("HF Error:", result.error);
        return `Error from Hugging Face: ${result.error}. (Make sure your token is valid and the model is loaded).`;
      }

      // Extract just the assistant's reply from the generated text
      let generatedText = result[0]?.generated_text || "I'm sorry, I couldn't generate a response.";
      const assistantSplit = generatedText.split("<|assistant|>\n");
      if (assistantSplit.length > 1) {
        return assistantSplit[1].trim();
      }
      return generatedText;

    } catch (error) {
      console.error("Fetch error:", error);
      return "Network error connecting to Hugging Face API.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    let botText = '';

    if (isHfEnabled) {
      // Call Real Hugging Face API
      botText = await fetchHuggingFaceResponse(userMessage.text);
    } else {
      // Fallback to Mock Logic if no key is provided
      setTimeout(() => {
        const lowerInput = userMessage.text.toLowerCase();
        if (mode === 'fan') {
          if (lowerInput.includes('food') || lowerInput.includes('vegan')) {
            botText = 'The nearest vegan food options are located at the "Green Kiosk" in Sector 4, level 2.';
          } else {
            botText = 'I am in Mock Mode! To get real AI answers, please add your Hugging Face API token to the .env file.';
          }
        } else {
          botText = 'Mock Mode active. Add your Hugging Face API token to the .env file to enable predictive operations intelligence.';
        }
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText }]);
        setIsTyping(false);
      }, 1000);
      return; // Exit early since we used timeout
    }

    setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText }]);
    setIsTyping(false);
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
              {isHfEnabled ? (
                <span style={{ fontSize: '0.7rem', background: '#4ade8020', color: '#4ade80', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Live AI</span>
              ) : (
                <span style={{ fontSize: '0.7rem', background: '#f59e0b20', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Mock Mode</span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {!isHfEnabled && (
              <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#fcd34d', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <KeyRound size={16} style={{ flexShrink: 0 }} />
                <span>To use the live Hugging Face AI, add your token to the `.env` file in your project folder!</span>
              </div>
            )}
            
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
            <button className="glass-button" style={{ padding: '0.75rem', borderRadius: '50%' }} onClick={handleSend} disabled={isTyping}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GenAIAssistant;
