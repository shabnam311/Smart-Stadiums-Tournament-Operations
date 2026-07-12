# PITCHSIDE - Stadium Operations Control

PITCHSIDE is a high-performance, real-time command center UI built specifically for **venue operations staff** managing live matches during the FIFA World Cup 2026 (Challenge 4 - Smart Stadiums & Tournament Operations).

It aggregates crowd density, incident tracking, staff deployment, and an AI-powered Ops Intelligence preview into a single pane of glass, allowing staff to ask the stadium "what happens next" and get reasoning-based decisions.

## How This Solves PromptWars Challenge 4
This project was built specifically for **Hack2Skill PromptWars Challenge 4: Smart Stadiums & Tournament Operations**. The challenge requires a GenAI-enabled solution that enhances the tournament experience for venue staff during the FIFA World Cup 2026. 

Here is how PITCHSIDE nails the criteria:
- **Operational Intelligence & Real-time Decision Support:** Instead of a generic chatbot, this is a tactical engine. Staff query the AI about specific incidents (e.g., "Gate C is congested"), and the AI reasons about crowd density, weather, and incidents to give actionable recommendations.
- **Dynamic CSV Ingestion:** Powered by **PapaParse**, venue operations can drag-and-drop live `csv` datasets (Crowd Movement, Incidents, Staff Roster) to dynamically update the stadium state and AI context on the fly without reloading the page.
- **Crowd Management:** Live-updating stadium zones and wait-time KPIs provide a direct response to the crowd management requirement.
- **Sustainability & Accessibility:** Built-in tracking for "Waste Diverted" and medical/accessibility incidents directly aligns with the challenge's core themes.

## Key Features

1. **Lightning Fast AI via Google Gemini 3.5 Flash**
   The live Ops Intelligence feed utilizes the lightning-fast **Google Gemini 3.5 Flash** model via the official `@google/genai` SDK, streaming responses using Server-Sent Events (SSE) for zero-latency operations.

2. **Dual-Architecture AI Connection**
   - **Serverless API:** The primary pipeline routes through a secure `/api/chat` Vercel function to keep API tokens completely hidden from the browser.
   - **Client-Side Fallback:** For local development or extreme low-latency edge testing, the application gracefully falls back to contact the Google REST API directly using `VITE_GEMINI_KEY`.

3. **Resilient API Key Management**
   The serverless proxy supports `GEMINI_API_KEY`, `VITE_GEMINI_API_KEY`, `VITE_GEMINI_KEY`, and `GEMINI_KEY` to guarantee out-of-the-box compatibility regardless of how you configure your deployment environments.

4. **High-Fidelity Operations UI**
   Features a meticulously designed "Intelligence Ops" layout, incorporating live-updating KPI strips, interactive crowd density bar charts, and a real-time event feed.

5. **Automated Unit Testing & Linting**
   Configured with Vitest, React Testing Library, and oxlint. Components are fully tested for reliable rendering, robust UI accessibility (a11y), and edge-case tracking (network timeouts, empty states, malicious inputs).

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
This project requires a Google Gemini API token for the AI Ops Intelligence feed.
Copy the example file and add your token:
```bash
cp .env.example .env
```
Inside `.env`, set:
```env
# Required for local vercel dev server testing (Primary Backend)
GEMINI_API_KEY=your_gemini_api_key_here

# Required for local development direct streaming fallback (Vite UI)
VITE_GEMINI_KEY=your_gemini_api_key_here
```
*(Ensure you do NOT commit your `.env` file to version control. It is already added to `.gitignore`).*

### 3. Run the Development Server
```bash
npm run dev
```
*(Note: To test the serverless fallback function locally, use `vercel dev` instead of `npm run dev` if you have the Vercel CLI installed).*

### 4. Run the Test Suite
```bash
npm run test
```

## Deployment
This project is configured for one-click deployment on **Vercel**. When deploying, ensure you add the **`GEMINI_API_KEY`** environment variable in your Vercel Project Settings under Environment Variables (check Production & Preview).
