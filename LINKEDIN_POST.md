# LinkedIn Post Draft

Excited to present **PITCHSIDE**, my submission for the FIFA World Cup 2026 Hackathon (Challenge 4 - Smart Stadiums & Tournament Operations)! 🏟️⚽

PITCHSIDE is a high-performance, real-time command center UI designed to replace scattered dashboards with a single "Operations Intelligence" pane of glass, built specifically for **venue operations staff** managing live matches.

**How I Built It (Tools & Why):**
- **Vite + React**: Chosen for fast HMR during the hackathon and snappy client-side rendering.
- **Vercel Serverless Functions**: I used `/api/chat.js` as a secure proxy. This ensures the Hugging Face API tokens stay strictly server-side and are never exposed in the client bundle.
- **Qwen/Qwen2.5-1.5B-Instruct**: After experimenting with heavier gated models, I switched to Qwen 1.5B via Hugging Face. It's ungated, incredibly fast for a free-tier model, and perfect for a snappy, real-time live demo without cold-start timeouts.

**Prompt Evolution (Reasoning over Data):**
Initially, my system prompt just asked the model to "answer questions about the stadium." The result was dry data dumps. 
I refined the prompt iteratively to enforce a strict reasoning format: *(1) State the situation, (2) Give a specific recommendation, (3) Briefly explain why.* 
Now, instead of just saying "Gate C is at 85%", the AI says: "Recommend opening auxiliary turnstiles C4-C6, because at this pace the queue will exceed 200 people within 8 minutes and create a safety bottleneck."

**Human vs. AI Split:**
I designed the UI, dynamic React routing, and the live data pipeline (including real weather data via Open-Meteo based on actual FIFA venue coordinates). The GenAI is specifically scoped to handle natural-language query interpretation and generate contextual, reasoning-based recommendations on top of that data.

A huge thanks to the organizers for this prompt. You can try the live demo and ask the stadium "what happens next" here! 

👉 Live Demo: https://smart-stadiums-tournament-operations.vercel.app/
👉 GitHub Repo: https://github.com/shabnam311/Smart-Stadiums-Tournament-Operations

#FIFA2026 #WorldCup #Hackathon #GenAI #ReactJS #Vercel #OperationsIntelligence
