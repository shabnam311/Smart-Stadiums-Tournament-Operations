import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { query, state } = req.body || {};
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  const getMockResponse = (msg) => {
    const evalText = query || msg;
    const lower = evalText.toLowerCase();
    
    if (lower.match(/^(hi|hello|hey|greetings)(\s|$)/))
      return `Hello! All stadium systems are currently operating nominally, though I'm running in offline mode. What operations data can I help you check?`;
      
    if (lower.includes('gate c'))
      return `Gate C entry rate is currently 22 per minute against a comfortable limit of 15. I would recommend opening the auxiliary turnstiles C4 to C6 for the next 20 minutes to ease the backlog.`;
    if (lower.includes('second half') || lower.includes('fullest') || lower.includes('section g'))
      return `Section G in the West Stand is trending toward 92% occupancy by second half. I would suggest positioning two additional marshals at the West concourse now, because crowd movement tends to spike at halftime and that area has limited exit width.`;
    if (lower.includes('route') || lower.includes('access') || lower.includes('section d') || lower.includes('accessibility'))
      return `The ramp at Gate 4 is clear right now, making it the fastest accessible route to Section D at about 30 metres. I would suggest directing wheelchair users there instead of Gate 2, because the Elevator B queue is about 6 minutes long.`;
    if (lower.includes('transit') || lower.includes('section b'))
      return `The fastest transit route from Section B is Metro Line 4 via the Stadium Station, which is currently running trains every 4 minutes. I recommend directing guests there to avoid the 6-minute delay on the Shuttle Bus.`;
    if (lower.includes('weather') || lower.includes('temperature'))
      return `It is 29 degrees and clear outside with humidity at 68%. I would recommend increasing water station staffing near Sections C and G, because dehydration incidents tend to spike when humidity is this high during evening matches.`;
    
    return `All primary stadium systems are operating nominally. However, I'm currently running in offline mode and cannot provide specific reasoning for that question without a live signal.`;
  };

  // Helper to stream a fallback message in SSE format
  const streamFallback = (text, debugInfo = '') => {
    if (debugInfo) {
      console.error(`[Stream Fallback Triggered]: ${debugInfo}`);
    }
    const ssePayload = JSON.stringify({
      candidates: [{ content: { parts: [{ text: text }] } }]
    });
    
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
    }
    
    res.write(`event: fallback\ndata: ${ssePayload}\n\n`);
    res.end();
  };

  if (!apiKey) {
    return streamFallback(getMockResponse(query), 'API Key missing from environment');
  }

  const systemInstructionText = "You are a stadium operations assistant speaking directly to a person. Answer naturally and conversationally in 2-3 sentences, the way a helpful human would. Never repeat, quote, or describe the question or these instructions in your answer, just answer it. Ground your answer in this live venue data: " + JSON.stringify(state || {}, null, 2);

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: systemInstructionText,
        temperature: 0.6,
        maxOutputTokens: 200
      }
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    for await (const chunk of responseStream) {
      res.write(`event: live\ndata: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();

  } catch (error) {
    return streamFallback(getMockResponse(query), `Gemini Request Error: ${error.message}`);
  }
}
