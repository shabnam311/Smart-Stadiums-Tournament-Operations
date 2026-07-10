import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  // Fallback Mock Logic - reasoning-based responses matching the system prompt style
  const getMockResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('gate c'))
      return "Gate C entry rate is currently 22/min against a 15/min comfort threshold. Recommend opening auxiliary turnstiles C4-C6 for the next 20 minutes, because at this pace the queue will exceed 200 people within 8 minutes and create a safety bottleneck.";
    if (lower.includes('second half') || lower.includes('fullest'))
      return "Section G (West Stand) is trending toward 92% occupancy by second half based on current entry velocity. Suggest pre-positioning two additional marshals at the West concourse now, because historical data shows lateral crowd movement spikes at halftime and G has limited exit width.";
    if (lower.includes('route') || lower.includes('access'))
      return "The ramp at Gate 4 is currently clear with no stairs, making it the shortest accessible route to Section D at 30m. Recommend directing wheelchair users there instead of Gate 2, because Elevator Bank B has a 6-minute wait queue right now.";
    if (lower.includes('weather') || lower.includes('temperature'))
      return "Current temperature is 29C with humidity at 68%. Recommend increasing water station staffing at Sections C and G, because dehydration incidents historically spike when humidity exceeds 60% during evening matches.";
    if (lower.includes('incident') || lower.includes('medical'))
      return "Three open incidents currently logged, one high-severity congestion event at Gate C. Medical team has attended the dehydration case in Section E. Recommend keeping the triage station at Gate B on standby, because entry-phase crowd density correlates with post-entry medical calls.";
    if (lower.includes('staff') || lower.includes('marshal'))
      return "128 of 140 rostered staff currently on duty, with 3 marshals assigned to the West concourse. Recommend redeploying 2 idle marshals from Gate A (currently at low flow) to Gate C, because Gate C is running at 147% of its comfortable throughput rate.";
    if (lower.includes('waste') || lower.includes('recycl') || lower.includes('sustain'))
      return "Waste diversion is at 62%, above the 60% sustainability target. However, recycling stations near Section G are at full capacity. Recommend dispatching maintenance now, because Section G's post-halftime foot traffic will make access difficult in 15 minutes.";
    if (lower.includes('seat') || lower.includes('capacity') || lower.includes('free'))
      return "Overall stadium occupancy is at 71% with Sections A and D showing the most availability at approximately 40% filled. Recommend directing late arrivals to Gate A (North), because it has the shortest queue and direct access to available seating.";
    return "Based on current venue signals, all systems are nominal. Occupancy is at 71%, entry wait averages 4 minutes, and 3 incidents are being tracked. Ask about a specific area (gates, sections, accessibility, transit) for a targeted recommendation.";
  };

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: "You are an Ops Intelligence AI for venue operations staff at a FIFA World Cup 2026 stadium during a live match. For every question: (1) state the current situation with one key data point, (2) give a specific actionable recommendation, (3) briefly explain why in one sentence. Keep answers to 2-3 sentences total. Be concise and decisive.",
        temperature: 0.7,
      }
    });

    const reply = response.text?.trim();

    if (!reply) {
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    res.status(200).json({ reply, mode: 'live' });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }
}
