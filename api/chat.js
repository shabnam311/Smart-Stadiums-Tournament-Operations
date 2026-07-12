import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, state } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  // Fallback Mock Logic - reasoning-based responses matching the system prompt style
  const getMockResponse = (msg) => {
    const evalText = query || msg;
    const lower = evalText.toLowerCase();
    if (lower.includes('gate c'))
      return `Gate C entry rate is currently 22 per minute against a comfortable limit of 15. I would recommend opening the auxiliary turnstiles C4 to C6 for the next 20 minutes to ease the backlog.`;
    if (lower.includes('second half') || lower.includes('fullest'))
      return `Section G in the West Stand is trending toward 92% occupancy by second half. I would suggest positioning two additional marshals at the West concourse now, because crowd movement tends to spike at halftime and that area has limited exit width.`;
    if (lower.includes('route') || lower.includes('access'))
      return `The ramp at Gate 4 is clear right now, making it the fastest accessible route to Section D at about 30 metres. I would suggest directing wheelchair users there instead of Gate 2, because the Elevator B queue is about 6 minutes long.`;
    if (lower.includes('weather') || lower.includes('temperature'))
    if (lower.includes('fullest') || lower.includes('section g'))
      return `Section G is trending toward 92% occupancy by the second half based on current entry velocity. I recommend pre-positioning two marshals at the West concourse, because lateral crowd movement spikes at halftime and G has limited exit width.`;
    if (lower.includes('transit') || lower.includes('section b'))
      return `The fastest transit route from Section B is Metro Line 4 via the Stadium Station, which is currently running trains every 4 minutes. I recommend directing guests there to avoid the 6-minute delay on the Shuttle Bus.`;
    if (lower.includes('accessibility') || lower.includes('section d'))
      return `The best accessible route to Section D is the ramp at Gate 4, which is step-free and takes approximately 4 minutes from the main concourse. I recommend this route over the West Concourse wheelchair elevator, which currently has a 3-minute wait.`;
    
    return `All primary stadium systems are operating nominally. However, I'm currently running in offline mode and cannot provide specific reasoning for that question without a live signal.`;
  };

  if (!apiKey) {
    return res.status(200).json({ reply: getMockResponse(query), mode: 'demo' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: query,
      config: {
        systemInstruction: "You are a stadium operations assistant speaking directly to a person. Answer naturally and conversationally in 2-3 sentences, the way a helpful human would. Never repeat, quote, or describe the question or these instructions in your answer, just answer it. Ground your answer in this live venue data: " + JSON.stringify(state, null, 2),
        temperature: 0.6,
        maxOutputTokens: 200
      }
    });

    const reply = response.text?.trim();

    if (!reply) {
      return res.status(200).json({ reply: getMockResponse(query), mode: 'demo' });
    }

    res.status(200).json({ reply, mode: 'live' });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(200).json({ reply: getMockResponse(query), mode: 'demo' });
  }
}
