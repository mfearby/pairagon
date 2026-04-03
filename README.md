# Pairagon

![Pairagon](frontend/src/assets/pairagon-wide.png)
*Image generated using Google Gemini 3 Flash*

A simple task list for software development teams. At the start of each day, use Pairagon to define tasks for the current sprint and assign developers — either manually or by random pairing. Tasks can be dragged to reflect priority order, and assignments can be one developer, a pair, or the whole team.

Created using [Kiro](https://kiro.dev/) to learn how to use it.

## Stack

- Frontend: React + TypeScript + Vite + Mantine
- Backend: Kotlin + Spring Boot 3.5 + Java 21
- Database: PostgreSQL

## Getting started

### 1. Start the database

```bash
docker compose up -d postgres
```

### 2. Start the backend

```bash
cd backend
./gradlew bootRun
```

Runs on `http://localhost:8080`

### 3. Start the frontend

```bash
cd frontend
npm install   # first time only
npm run dev
```

Runs on `http://localhost:5173`

## Running everything with Docker

```bash
docker compose up --build
```

Frontend will be available at `http://localhost:5173`.
