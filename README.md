<div align="center">
  <h1>Scaler Persona-Based AI Chatbot</h1>
  <p><strong>An interactive AI mentorship platform featuring Scaler Academy & InterviewBit leaders.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
  [![Gemini API](https://img.shields.io/badge/Google_Gemini-API-orange?logo=google)](https://ai.google.dev/)
  [![CSS3](https://img.shields.io/badge/Vanilla_CSS-UI-1572B6?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
</div>

<br />

> Built as an assignment for Scaler Academy, this application leverages the Google Gemini API to have deeply contextual and persona-accurate conversations based on extensive research and structured prompt engineering.

---

## Features

- **Three Unique Personas**: Chat with **Anshuman Singh**, **Abhimanyu Saxena**, or **Kshitij Mishra**. Each has a highly specific system prompt defining their background, communication style, and constraints.
- **Claude-Style Interactive Quizzes**: The AI is instructed via Structured JSON Output to dynamically generate pop-quizzes when asked. These render as a distinct, elevated UI component with immediate correct/incorrect color-coded feedback.
- **Dynamic Suggestion Chips**: The AI dynamically generates natural follow-up options for every message, creating a seamless, click-driven conversational flow.
- **Secure Backend**: The API key is stored securely in an environment variable and injected server-side via Next.js API Routes.
- **Graceful Error Handling**: User-friendly error messages if the API key is missing or the API quota is exceeded.
---

## Live Demo

> _App is live and deployed on Vercel:_  
> **[Live App Deployment](https://your-deployment-url-here.vercel.app)**
---

## Getting Started (Local Development)

### Prerequisites
- **Node.js** (v18 or higher)
- **Google Gemini API Key** (Get one [here](https://aistudio.google.com/))

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amishipatidar/scaler-persona-chatbot.git
   cd scaler-persona-chatbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and paste your Gemini API key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The application will now be running at [http://localhost:3000](http://localhost:3000).*

---

## Repository Structure & Deliverables

| File/Directory | Description |
|---|---|
| `prompts.md` | Contains the documented system prompts, reasoning, and few-shot examples. |
| `reflection.md` | A 300-500 word reflection on the process and GIGO principle. |
| `app/api/chat/route.ts` | The secure backend API route managing the LLM interaction & JSON parsing. |
| `app/page.tsx` | The frontend chat interface with dynamic UI components. |
| `app/page.module.css` | The custom Vanilla CSS design system. |

---

## Deployment Guide (Vercel)

This project is built with Next.js, making it trivial to deploy on Vercel:
1. Push your code to your public GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository (`scaler-persona-chatbot`).
4. In the "Environment Variables" section, add a new key:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** *[Your API Key]*
5. Click **Deploy**. Your app will be live globally with secure API access!
