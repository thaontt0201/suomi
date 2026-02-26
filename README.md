# Suomi YKI Practice

A Finnish language learning app for YKI exam preparation.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TailwindCSS, TanStack Query |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Docker) |
| AI | Ollama (local LLMs) |
| Speech-to-Text | faster-whisper |
| Auth | Google OAuth |

---

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Set up the backend

```bash
cd backend

# Copy and fill in your credentials
cp .env.example .env

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

### 3. Set up the frontend

```bash
cd frontend

# Copy env file
cp .env.local.example .env.local

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 4. Visit the app

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

---

## Required: Fill in `.env`

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SECRET_KEY=any-random-32-char-string
```

### Getting Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add `http://localhost:8000/auth/callback/google` as an authorized redirect URI
5. Copy Client ID and Client Secret into `backend/.env`

---

## Ollama Models

Make sure you have the required models pulled:

```bash
ollama pull qwen2.5
ollama pull llama3.1
ollama pull mistral
```

---

## Project Structure

```
suomi/
├── docker-compose.yml          # PostgreSQL
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── config.py           # Settings (env vars)
│   │   ├── database.py         # SQLAlchemy async engine
│   │   ├── models/             # ORM models (User, PracticeResult, Flashcard)
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── routers/            # API routes (speaking, writing, vocabulary, auth, progress)
│   │   └── services/
│   │       ├── ollama.py       # Ollama client + prompt builders
│   │       └── whisper.py      # faster-whisper transcription
│   ├── migrations/             # Alembic migrations
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── page.tsx            # Login page
    │   ├── dashboard/          # Dashboard
    │   ├── speaking/           # Speaking practice
    │   ├── writing/            # Writing practice
    │   ├── vocabulary/         # Vocabulary + flashcards
    │   ├── progress/           # Progress analytics
    │   └── history/            # Session history
    ├── components/
    │   ├── Navigation.tsx
    │   ├── AudioRecorder.tsx   # MediaRecorder wrapper
    │   ├── ScoreCard.tsx
    │   └── Providers.tsx       # TanStack Query provider
    └── lib/
        ├── api.ts              # All API calls
        └── types.ts            # TypeScript types
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/auth/login/google` | Start Google OAuth |
| GET | `/auth/me` | Get current user |
| POST | `/api/speaking/generate` | Generate speaking task |
| POST | `/api/speaking/evaluate` | Upload audio + get evaluation |
| POST | `/api/writing/generate` | Generate writing task |
| POST | `/api/writing/submit` | Submit text + get evaluation |
| POST | `/api/vocabulary/generate` | Generate vocabulary list |
| GET | `/api/vocabulary/flashcards` | Get user's flashcards |
| POST | `/api/vocabulary/flashcards` | Save a flashcard |
| GET | `/api/progress/summary` | Progress summary |
| GET | `/api/progress/history` | Session history |
