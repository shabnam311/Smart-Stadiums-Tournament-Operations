# PITCHSIDE - Stadium Operations Control

PITCHSIDE is a high-performance, real-time command center UI built specifically for **venue operations staff** managing live matches during the FIFA World Cup 2026 (Challenge 4 - Smart Stadiums & Tournament Operations).

It aggregates crowd density, incident tracking, staff deployment, and an AI-powered Ops Intelligence preview into a single pane of glass, allowing staff to ask the stadium "what happens next" and get reasoning-based decisions.

## Key Features

1. **Free Tier AI via Google Gemma 4**
   The live Ops Intelligence feed utilizes the 100% free **Google Gemma 4 (`gemma-4-26b-a4b-it`)** model via the Gemini API, ensuring highly accurate, context-aware responses with no billing constraints.

2. **Dual-Architecture AI Connection**
   - **Client-Side Generation:** For lowest latency and edge deployments, the application contacts the Google REST API directly using `VITE_GEMINI_KEY`.
   - **Serverless Fallback:** Gracefully falls back to a secure `/api/chat` Vercel function (Demo/Reconnecting mode) if direct client limits or network boundaries are hit.

3. **High-Fidelity Operations UI**
   Features a meticulously designed "Intelligence Ops" layout, incorporating live-updating KPI strips, interactive crowd density bar charts, and a real-time event feed.

4. **Automated Unit Testing**
   Configured with Vitest and React Testing Library. Components are fully tested for reliable rendering, robust UI accessibility (a11y), and edge-case tracking (network timeouts, empty states).

5. **Dynamic Routing**
   Integrated with `react-router-dom` to support modular navigation across multiple dashboards in future iterations.

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
VITE_GEMINI_KEY=your_real_key_here
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
This project is configured for one-click deployment on **Vercel**. When deploying, ensure you add the `VITE_GEMINI_KEY` environment variable in your Vercel Project Settings under Environment Variables (Production & Preview).
