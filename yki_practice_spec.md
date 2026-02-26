# YKI Practice Application --- Development Specification (Slonik + Ollama Version)

## 1. Project Overview

Build a web-based YKI (Yleinen kielitutkinto) practice application
focused on:

-   Speaking practice
-   Writing practice
-   Vocabulary learning

The system must use AI-generated exercises and AI-based evaluation while
prioritizing locally hosted open‑source models.

Primary goals:

-   Generate realistic YKI-style tasks
-   Evaluate writing and speaking submissions
-   Record and analyze speech
-   Track learner progress
-   Provide vocabulary training via games/flashcards
-   Support Google authentication
-   Persist personalized learning data

------------------------------------------------------------------------

## 2. System Architecture

### High-Level Architecture

Frontend (Next.js) ↓ Node.js API Server ↓ PostgreSQL (Slonik) ↓ Ollama
AI Services (Local LLMs) ↓ Speech-to-Text Model

------------------------------------------------------------------------

## 3. Tech Stack Requirements

### Frontend

-   Next.js (App Router)
-   React
-   TailwindCSS
-   MediaRecorder API (audio recording)
-   TanStack Query

### Backend

-   Node.js
-   TypeScript
-   REST API

### Database

-   PostgreSQL
-   Slonik (SQL client)
-   node-pg-migrate (schema migrations)

### Authentication

-   Google OAuth via Auth.js (NextAuth)

### AI (Priority: Open Source)

Use Ollama locally.

Preferred models:

Text Generation & Evaluation: - llama3.1 - mistral - mixtral - qwen2.5 -
deepseek-coder

Finnish-capable models: - qwen2.5 - llama3.1-instruct - mistral-nemo

Speech-to-Text: - Whisper (faster-whisper recommended)

------------------------------------------------------------------------

## 4. Database Layer (Slonik)

### Connection

``` ts
import { createPool } from 'slonik';
export const pool = createPool(process.env.DATABASE_URL);
```

### Migration Tool

Use node-pg-migrate.

CLI:

``` bash
npm run migrate up
npm run migrate down
```

### Core Tables

#### users

``` sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  level_estimate TEXT
);
```

#### practice_results

``` sql
CREATE TABLE practice_results (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  skill TEXT NOT NULL,
  type TEXT,
  score INTEGER,
  feedback JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

#### flashcards

``` sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  word TEXT,
  translation TEXT,
  example_sentence TEXT,
  difficulty INTEGER,
  next_review TIMESTAMP
);
```

------------------------------------------------------------------------

## 5. AI Integration (Ollama)

### Core Rule

The system MUST prioritize local inference via Ollama.

### Ollama Service Wrapper

Create:

    /services/ai/ollama.ts

Example:

``` ts
async function generate(prompt: string) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "qwen2.5",
      prompt,
      stream: false
    })
  });

  return res.json();
}
```

### Model Usage Strategy

  Task                        Model
  --------------------------- ----------------
  Writing prompt generation   qwen2.5
  Writing evaluation          llama3.1
  Speaking evaluation         mistral
  Vocabulary generation       qwen2.5
  Structured scoring          deepseek-coder

------------------------------------------------------------------------

## 6. Speaking Practice Module

### Speaking Types

-   kertominen
-   keskustelu
-   tilanne
-   mielipide

### Flow

#### Generate Task

POST /api/speaking/generate

Input:

``` json
{
  "level": "A2|B1|B2",
  "type": "kertominen|keskustelu|tilanne|mielipide"
}
```

### Recording Requirements

-   Record microphone audio
-   Countdown timer
-   Auto-stop at time limit
-   Upload audio file

Use MediaRecorder API.

### Speech Evaluation Pipeline

1.  Audio upload
2.  Whisper transcription
3.  Send transcript to Ollama
4.  Receive structured evaluation

Expected output:

``` json
{
  "score": 0,
  "levelEstimate": "A2",
  "feedback": {
    "strengths": [],
    "improvements": [],
    "grammarCorrections": [],
    "betterExpressions": []
  }
}
```

------------------------------------------------------------------------

## 7. Writing Practice Module

### Writing Types

-   Informal message/email
-   Formal email / complaint / letter
-   Mielipide text

### Generate Task

POST /api/writing/generate

### Submission

POST /api/writing/submit

### Writing Evaluation Criteria

-   Grammar accuracy
-   Vocabulary range
-   Register appropriateness
-   Structure
-   Cohesion
-   Task completion

------------------------------------------------------------------------

## 8. Vocabulary Practice Module

### Flashcards

Fields: - word - translation - example sentence - difficulty score -
next review date

### AI Vocabulary Generation

POST /api/vocabulary/generate

AI returns: - Finnish word - translation - example sentence - synonyms

### Vocabulary Games

Implement at least one: - Multiple choice quiz - Matching game -
Fill-in-the-blank

------------------------------------------------------------------------

## 9. Authentication

Use Google OAuth via Auth.js.

Requirements: - Auto-create user after login - Store userId in session -
Protect API routes

------------------------------------------------------------------------

## 10. Progress Tracking

Dashboard shows: - Speaking score trend - Writing improvements -
Vocabulary mastery - Estimated CEFR progression

------------------------------------------------------------------------

## 11. UI Pages

Required: - Login - Dashboard - Speaking Practice - Writing Practice -
Vocabulary Practice - Progress Analytics - Practice History

------------------------------------------------------------------------

## 12. AI Prompt Design Rules

Prompts must: - Be written in Finnish - Match YKI exam tone - Be
level-aware (A2/B1/B2) - Avoid unnatural academic wording - Produce
structured JSON outputs

------------------------------------------------------------------------

## 13. Non-Functional Requirements

-   Mobile responsive
-   Secure audio storage
-   Autosave writing drafts
-   Feedback latency target \< 10 seconds
-   GDPR-conscious storage

------------------------------------------------------------------------

## 14. Expected Deliverables

Claude Code should:

1.  Create project structure
2.  Configure Slonik pool
3.  Setup node-pg-migrate migrations
4.  Implement Ollama client
5.  Build AI generation endpoints
6.  Implement audio recording workflow
7.  Add Whisper transcription pipeline
8.  Implement authentication
9.  Build frontend pages
10. Provide setup & run instructions
