export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const hfToken = process.env.VITE_HF_TOKEN;
  
  if (!hfToken || hfToken === 'your_hugging_face_token_here') {
    // Fallback Mock Logic if token is missing (ensures the demo always works)
    const lowerMessage = message.toLowerCase();
    let mockResponse = "Mock Mode: No live signal configured for this query yet.";
    if (lowerMessage.includes('gate c')) mockResponse = "Yes — entry rate at Gate C is running 22/min against a 15/min comfortable threshold. Recommend opening auxiliary turnstiles C4–C6 now.";
    if (lowerMessage.includes('second half')) mockResponse = "Section G (West Stand) is trending toward 92% occupancy by second half. Consider pre-positioning two additional marshals at the West concourse.";
    if (lowerMessage.includes('route')) mockResponse = "The ramp at Gate 4 is clear with no stairs. It's currently the shortest accessible route to Section D.";
    
    return res.status(200).json({ reply: mockResponse });
  }

  const model = "HuggingFaceH4/zephyr-7b-beta";
  const prompt = `<|system|>\nYou are an Ops Intelligence AI for stadium staff. Keep answers to 1-2 concise sentences, focusing on actionable data.</s>\n<|user|>\n${message}</s>\n<|assistant|>\n`;

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 100, temperature: 0.7 } }),
    });

    const result = await hfRes.json();
    
    if (result.error) {
      return res.status(500).json({ reply: `Hugging Face Error: ${result.error}. (Model might be waking up).` });
    }

    let generatedText = result[0]?.generated_text || "Error generating response.";
    const assistantSplit = generatedText.split("<|assistant|>\n");
    const reply = assistantSplit.length > 1 ? assistantSplit[1].trim() : generatedText;

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Network error connecting to Hugging Face." });
  }
}
