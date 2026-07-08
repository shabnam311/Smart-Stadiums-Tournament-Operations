# PITCHSIDE — Stadium Operations Control

PITCHSIDE is a high-performance, real-time command center UI for stadium operations, originally built for the FIFA World Cup 2026 Challenge 4 hackathon.

It aggregates crowd density, incident tracking, staff deployment, and an AI-powered Fan Assistant preview into a single pane of glass.

## Key Features

1. **Serverless AI Proxy (Vercel Functions)**
   The live Fan Assistant preview relies on a serverless Vercel function (`api/chat.js`) to securely query a Hugging Face LLM (Llama 3.2 3B Instruct) without exposing API tokens to the client bundle.
2. **Simulated Live Data via React Hooks**
   Static data has been replaced with dynamic React `useState` and `useEffect` hooks, simulating real-time fluctuations in crowd density and entry rates.
3. **Automated Unit Testing**
   Configured with Vitest and React Testing Library. Components are fully tested for reliable rendering, robust UI accessibility (a11y), and interaction tracking. 
4. **Dynamic Routing**
   Integrated with `react-router-dom` to support modular navigation across multiple dashboards in future iterations.
5. **Accessible & Responsive Design**
   Utilizes high-contrast color palettes (WCAG AA compliant text), screen-reader-only utilities (`.sr-only`), and semantic HTML5 structures.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
This project requires a Hugging Face token for the AI Ops Intelligence feed.
Copy the example file and add your token:
```bash
cp .env.example .env
```
Inside `.env`, set:
`HF_TOKEN=your_real_token_here`

### 3. Run the Development Server
```bash
npm run dev
```
*(Note: To test the serverless function locally, use `vercel dev` instead of `npm run dev` if you have the Vercel CLI installed).*

### 4. Run the Test Suite
```bash
npm run test
```

## Deployment
This project is configured for one-click deployment on **Vercel**. When deploying, ensure you add the `HF_TOKEN` environment variable in your Vercel Project Settings under Environment Variables (Production & Preview).
