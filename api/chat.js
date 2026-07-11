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
      return `Gate C entry rate is currently 22 per minute against a comfortable limit of 15. I would recommend opening the auxiliary turnstiles C4 to C6 for the next 20 minutes to ease the backlog.`;
    if (lower.includes('second half') || lower.includes('fullest'))
      return `Section G in the West Stand is trending toward 92% occupancy by second half. I would suggest positioning two additional marshals at the West concourse now, because crowd movement tends to spike at halftime and that area has limited exit width.`;
    if (lower.includes('route') || lower.includes('access'))
      return `The ramp at Gate 4 is clear right now, making it the fastest accessible route to Section D at about 30 metres. I would suggest directing wheelchair users there instead of Gate 2, because the Elevator B queue is about 6 minutes long.`;
    if (lower.includes('weather') || lower.includes('temperature'))
      return `It is 29 degrees and clear outside with humidity at 68%. I would recommend increasing water station staffing near Sections C and G, because dehydration incidents tend to spike when humidity is this high during evening matches.`;
    if (lower.includes('incident') || lower.includes('medical'))
      return `There are three open incidents right now. The most serious one is congestion at Gate C. The medical team has already attended to a dehydration case in Section E, and a minor spill in Concourse B is being cleaned up.`;
    if (lower.includes('staff') || lower.includes('marshal'))
      return `We have 128 out of 140 rostered staff on duty right now. I would recommend moving 2 idle marshals from Gate A over to Gate C, because Gate C is handling way more people than it comfortably should.`;
    if (lower.includes('waste') || lower.includes('recycl') || lower.includes('sustain'))
      return `Waste diversion is at 62% which is above our 60% target, so that is looking good. However, the recycling stations near Section G are full and need emptying before halftime foot traffic makes access difficult.`;
    if (lower.includes('seat') || lower.includes('capacity') || lower.includes('free'))
      return `The stadium is about 71% full overall. Sections A and D have the most available seats at around 40% filled. I would direct late arrivals to Gate A on the North side since it has the shortest queue.`;
    if (lower.includes('food') || lower.includes('stall') || lower.includes('eat'))
      return `The food area near Section C is pretty busy since that zone is at about 90% capacity. I would recommend heading to the Concourse A food court on the North side instead, it is much quieter over there.`;
    if (lower.includes('restroom') || lower.includes('toilet') || lower.includes('bathroom'))
      return `Restrooms are available on all concourse levels. The ones near Concourse A have the shortest lines right now, so I would suggest heading there if you want to avoid a wait.`;
    return `Everything looks good across the stadium right now. If you have a question about a specific area like the gates, food courts, restrooms, or accessibility, just ask and I can give you the latest update.`;
  };

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: message,
      config: {
        temperature: 0.6,
        maxOutputTokens: 250
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
