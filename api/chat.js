import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, systemPrompt } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  // Fallback Mock Logic - reasoning-based responses matching the system prompt style
  const getMockResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('gate c'))
      return '{"status":"Gate C entry rate is currently 22/min against a 15/min comfort threshold.","action":"Recommend opening auxiliary turnstiles C4-C6 for the next 20 minutes.","reason":"At this pace the queue will exceed 200 people within 8 minutes and create a safety bottleneck."}';
    if (lower.includes('second half') || lower.includes('fullest'))
      return '{"status":"Section G (West Stand) is trending toward 92% occupancy by second half based on current entry velocity.","action":"Suggest pre-positioning two additional marshals at the West concourse now.","reason":"Historical data shows lateral crowd movement spikes at halftime and G has limited exit width."}';
    if (lower.includes('route') || lower.includes('access'))
      return '{"status":"The ramp at Gate 4 is currently clear with no stairs, making it the shortest accessible route to Section D at 30m.","action":"Recommend directing wheelchair users there instead of Gate 2.","reason":"Elevator Bank B has a 6-minute wait queue right now."}';
    if (lower.includes('weather') || lower.includes('temperature'))
      return '{"status":"Current temperature is 29C with humidity at 68%.","action":"Recommend increasing water station staffing at Sections C and G.","reason":"Dehydration incidents historically spike when humidity exceeds 60% during evening matches."}';
    if (lower.includes('incident') || lower.includes('medical'))
      return '{"status":"Three open incidents currently logged, one high-severity congestion event at Gate C. Medical team has attended the dehydration case in Section E.","action":"Recommend keeping the triage station at Gate B on standby.","reason":"Entry-phase crowd density correlates with post-entry medical calls."}';
    if (lower.includes('staff') || lower.includes('marshal'))
      return '{"status":"128 of 140 rostered staff currently on duty, with 3 marshals assigned to the West concourse.","action":"Recommend redeploying 2 idle marshals from Gate A (currently at low flow) to Gate C.","reason":"Gate C is running at 147% of its comfortable throughput rate."}';
    if (lower.includes('waste') || lower.includes('recycl') || lower.includes('sustain'))
      return '{"status":"Waste diversion is at 62%, above the 60% sustainability target. However, recycling stations near Section G are at full capacity.","action":"Recommend dispatching maintenance now.","reason":"Section G\\'s post-halftime foot traffic will make access difficult in 15 minutes."}';
    if (lower.includes('seat') || lower.includes('capacity') || lower.includes('free'))
      return '{"status":"Overall stadium occupancy is at 71% with Sections A and D showing the most availability at approximately 40% filled.","action":"Recommend directing late arrivals to Gate A (North).","reason":"It has the shortest queue and direct access to available seating."}';
    return '{"status":"Based on current venue signals, all systems are nominal.","action":"Ask about a specific area (gates, sections, accessibility, transit) for a targeted recommendation.","reason":""}';
  };

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const robustPrompt = systemPrompt ? systemPrompt : `You are PITCHSIDE, an Ops Intelligence AI. Keep answers very brief.`;
    
    // Using system_instruction since it's the standard way for Gemini
    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: message,
      config: {
        systemInstruction: robustPrompt,
        temperature: 0.5,
        maxOutputTokens: 200,
        responseMimeType: 'application/json'
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
