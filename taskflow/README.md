# PeakTasks ⚡

A full-stack task management app I built because I was tired of juggling three different
productivity tools at once. It's got everything I actually use — task CRUD, priority levels,
due dates, filters, search, and a Pomodoro timer baked right into each task card.

Built with Node.js, Express, PostgreSQL, and React. No fancy framework magic, just
straightforward code that does what it says.

---

## Why I built this

I kept switching between Notion for tasks, a separate timer app for focus sessions, and
sticky notes for "quick things". It was a mess. I wanted one thing that worked the way
my brain works, so I built it. Also wanted to practice doing a proper full-stack app
from scratch — auth, database, REST API, the whole thing — without leaning on an ORM
or some meta-framework that hides everything from you.

Turns out it's not that complicated when you just sit down and do it.

---

## Features

- **Auth** — signup, login, logout with JWT. passwords hashed with bcrypt, obviously
- **Task CRUD** — create, read, update, delete. the classics
- **Task fields** — title, description, due date, priority (low/medium/high), completed toggle
- **Filters** — all / active / completed tabs + priority dropdown
- **Search** — real-time search by title, debounced so it's not hammering the db
- **Sort** — by newest, due date, priority, or created date
- **Pagination** — 10 tasks per page, clean prev/next controls
- **Overdue highlighting** — overdue tasks show in red with a warning icon
- **Stats bar** — total, completed, overdue counts at a glance
- **Pomodoro timer** — 🍅 button on every task card, 25min work / 5min break, SVG ring progress,
  browser notifications when the session ends, session counter so you know how many you've done
- **Skeleton loaders** — proper loading skeletons instead of a spinning circle
- **Custom 404** — because a blank page is boring
- **About page** — `/about` if you want to know the backstory
- **Toast notifications** — success/error feedback that doesn't get in the way
- **Dark UI** — it's always dark mode, I don't make the rules

---

## Tech stack

| Layer    | Tech                                    | Why                                      |
|----------|-----------------------------------------|------------------------------------------|
| Backend  | Node.js + Express                       | boring and reliable, exactly what I want |
| Database | PostgreSQL + raw SQL (`pg`)             | I like knowing what queries are running  |
| Auth     | JWT + bcryptjs                          | simple, works, no magic                  |
| Frontend | React 18 + Vite                         | fast dev server, hooks are great         |
| Styling  | Tailwind CSS                            | utility classes just make sense to me    |
| HTTP     | Axios                                   | interceptors for auth headers            |
| Toasts   | react-hot-toast                         | lightweight, looks good                  |

---

## Database schema

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100),
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  due_date    DATE,
  priority    VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tables are auto-created on first server startup — you don't need to run any migration scripts.

---

## Project structure

```
peaktasks/
├── backend/
│   ├── config/
│   │   ├── db.js           pg connection pool
│   │   └── initDB.js       auto-creates tables on startup
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js         JWT verification
│   ├── queries/
│   │   ├── users.js        user SQL
│   │   └── tasks.js        task SQL — filtering, sorting, pagination
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── .env.local          your actual local config (gitignored)
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PomodoroTimer.jsx   the fun one
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskListSkeleton.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Signup.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .env.local          your actual local config (gitignored)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Setup

### What you need

- Node.js 18+
- PostgreSQL 14+

### 1. Create the database

```bash
psql -U postgres
CREATE DATABASE peaktasks;
\q
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env.local
```

Edit `.env.local` — the file has comments explaining each variable:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/peaktasks
JWT_SECRET=make_this_long_and_random_seriously
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
# tables get created automatically on first run
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `localhost:5000` automatically, so you don't need
to touch the frontend `.env.local` unless you're pointing at a different backend.

### 4. Open it

[http://localhost:5173](http://localhost:5173) — sign up, start adding tasks.

---

## API endpoints

| Method | Endpoint         | Auth | Description                        |
|--------|------------------|------|------------------------------------|
| POST   | /api/auth/signup | No   | register                           |
| POST   | /api/auth/login  | No   | login, returns JWT                 |
| GET    | /api/auth/me     | Yes  | get current user                   |
| GET    | /api/tasks       | Yes  | list tasks (supports query params) |
| POST   | /api/tasks       | Yes  | create task                        |
| GET    | /api/tasks/:id   | Yes  | get one task                       |
| PUT    | /api/tasks/:id   | Yes  | update task                        |
| DELETE | /api/tasks/:id   | Yes  | delete task                        |
| GET    | /api/health      | No   | health check                       |

### Query params for GET /api/tasks

| Param    | Values                            | Default |
|----------|-----------------------------------|---------|
| status   | `active`, `completed`             | all     |
| priority | `low`, `medium`, `high`           | all     |
| search   | any string                        | —       |
| sort     | `due_date`, `priority`, `created` | newest  |
| page     | number                            | 1       |
| limit    | number                            | 20      |

---

## Security stuff

- passwords hashed with bcrypt at 12 rounds
- JWT tokens in localStorage (good enough for this, HTTP-only cookies would be better in prod)
- all task routes require a valid token
- every task query is scoped to `user_id` — you can't see someone else's tasks
- parameterized SQL queries throughout, no string concatenation

---

## Things I want to add eventually

- task tags / labels
- recurring tasks (the infastructure is almost there, just need the UI)
- drag-and-drop reordering
- maybe a mobile app, but the web version works fine on mobile so probably not

---

## Commit history

I tried to keep commits small and meaningful. Run `git log --oneline` to see them all.

---

Built with too much coffee. If something's broken, it's a feature.
