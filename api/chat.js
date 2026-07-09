export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const hfToken = process.env.HF_TOKEN;
  
  // Fallback Mock Logic
  const getMockResponse = (msg) => {
    const lowerMessage = msg.toLowerCase();
    if (lowerMessage.includes('gate c')) return "Yes, entry rate at Gate C is running 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4-C6 now.";
    if (lowerMessage.includes('second half')) return "Section G (West Stand) is trending toward 92% occupancy by second half. Consider pre-positioning two additional marshals at the West concourse.";
    if (lowerMessage.includes('route')) return "The ramp at Gate 4 is clear with no stairs. It's currently the shortest accessible route to Section D.";
    return "Mock Mode: No live signal configured for this query yet.";
  };

  if (!hfToken || hfToken === 'your_hugging_face_token_here') {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }

  // Ungated, fast instruct model
  const model = "Qwen/Qwen2.5-1.5B-Instruct";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are an Ops Intelligence AI for stadium staff. Keep answers to 1-2 concise sentences, focusing on actionable data." },
          { role: "user", content: message }
        ],
        max_tokens: 100,
        temperature: 0.7
      }),
    });
    clearTimeout(timeoutId);

    if (!hfRes.ok) {
      // Typically 401 Unauthorized or 429 Too Many Requests
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    const result = await hfRes.json();
    if (result.error) {
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    const reply = result.choices[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    res.status(200).json({ reply, mode: 'live' });
  } catch (error) {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }
}
