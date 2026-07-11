import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const keyLine = envFile.split('\n').find(line => line.startsWith('VITE_GEMINI_KEY='));
const key = keyLine.split('=')[1].trim();

const sysPrompt = "You are PITCHSIDE, a friendly stadium operations manager. Answer the question naturally in 2-3 sentences based on the live data provided.";
const userPrompt = "Live Stadium Data: Food stalls are 90% full.\n\nQuestion: are the food stalls crowded";

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=' + key, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    systemInstruction: { parts: [{ text: sysPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
  })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(console.error);
