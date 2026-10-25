# NovaChat

A clean, modern AI chat interface built with React, TypeScript, and FastAPI.

I built this as a portfolio project to practice creating polished frontend experiences with real streaming responses. It focuses on good UX, performance, and clean code rather than trying to be another ChatGPT clone.

## Features

- Real-time streaming responses using Groq
- Multiple model support (switchable from the UI)
- Stop generation button
- Persistent chat history (saved in localStorage)
- Markdown support (code blocks, lists, etc.)
- Dark, minimal interface
- Fully responsive
- Accessible (keyboard + screen reader friendly)

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- react-markdown

**Backend**
- FastAPI
- Groq API (for fast inference)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ahmed20455/NovaChat
cd NovaChat
```
### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate     
pip install -r requirements.txt
```
Create a '.env' file inside the backend folder:
```bash
GROQ_API_KEY=your_key
```
Then run the backend:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd NovaChat
npm install
npm run dev
```

Open http://localhost:5173

### Project Structure
```text
novachat/
├── novachat/          # React + Vite app
├── backend/           # FastAPI server
└── README.md
```

#### Why I build this
I wanted to create something that feels fast and clean, not just functional. Streaming responses,
proper loading states, stop generation, and good accessibility were important to me.
It also gave me a chance to connect a real AI backend while keeping the frontend architecture simple and maintainable.
