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
    if (lowerMessage.includes('gate c')) return "Yes — entry rate at Gate C is running 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4–C6 now.";
    if (lowerMessage.includes('second half')) return "Section G (West Stand) is trending toward 92% occupancy by second half. Consider pre-positioning two additional marshals at the West concourse.";
    if (lowerMessage.includes('route')) return "The ramp at Gate 4 is clear with no stairs. It's currently the shortest accessible route to Section D.";
    return "Mock Mode: No live signal configured for this query yet.";
  };

  if (!hfToken || hfToken === 'your_hugging_face_token_here') {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }

  // Ungated, fast instruct model
  const model = "Qwen/Qwen2.5-1.5B-Instruct";
  const prompt = `<|im_start|>system\nYou are an Ops Intelligence AI for stadium staff. Keep answers to 1-2 concise sentences, focusing on actionable data.<|im_end|>\n<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`;

  try {
    const hfRes = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 100, temperature: 0.7 } }),
    });

    if (!hfRes.ok) {
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    const result = await hfRes.json();
    if (result.error) {
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    let generatedText = result[0]?.generated_text || "";
    // Clean up specific instruct markers
    const assistantSplit = generatedText.split("<|im_start|>assistant\n");
    let reply = assistantSplit.length > 1 ? assistantSplit[1].trim() : generatedText.trim();
    
    // Remove trailing tokens if any
    reply = reply.replace("<|im_end|>", "").trim();

    if (!reply) {
      return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
    }

    res.status(200).json({ reply, mode: 'live' });
  } catch (error) {
    return res.status(200).json({ reply: getMockResponse(message), mode: 'demo' });
  }
}
