# Gr4de Platform

Monorepo with a frontend (Vite + React + Tailwind) and a backend (Node.js + Express + Supabase).

## Quick facts

- Frontend: Vite, React 19, Tailwind CSS (v4), Zustand, React Router.
- Backend: Node.js (ESM), Express 5, Supabase client for DB, dotenv-based env config.
- Repo layout (top-level):
  - `frontend/` — React app
  - `backend/` — Express API

---

## Getting started (local)

Prerequisites

- Node.js >= 18 (v22 tested in this repo)
- npm or yarn

1. Install dependencies

```bash
# from repo root
cd frontend && npm install
cd ../backend && npm install
```

2. Environment variables

Copy `backend/.env.example` to `backend/.env` and fill the values. Important variables used in backend:

- SUPABASE_URL
- SUPABASE_SERVICE_KEY (or SUPABASE_KEY)
- SUPABASE_ANON_KEY
- JWT_SECRET
- CLIENT_URL (frontend origin)

3. Run backend and frontend in separate terminals

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

Open the frontend URL printed by Vite (default http://localhost:5173).

---

## Project structure (high level)

### Frontend

- `src/main.jsx` — app entry
- `src/App.jsx` — router + global app initialization
- `src/index.css` — Tailwind directives and global CSS variables (note: Tailwind v4 uses `@import "tailwindcss/preflight"` and `@tailwind utilities`)
- `src/pages/` — pages (index, login, register, dashboard, errors)
- `src/components/` — UI components including `LoadingScreen`, `ProtectedRoute`, and shadcn UI components
- `vite.config.js` — Vite config with `@` alias → `src`

### Backend

- `src/index.js` — server start and routes mount
- `src/config/supabase.js` — supabase client and health helpers
- `src/routes/` — API routes (auth etc.)
- `src/middleware/` — auth and validation middleware
- `src/controllers/` — request handlers

---

## Notable implementation details & troubleshooting

- Node ESM imports require file extensions for local modules (for example `import x from './config/supabase.js'`). The backend `package.json` is set to `"type": "module"`.
- Tailwind v4 changes:
  - `@tailwind base` → use `@import "tailwindcss/preflight"`
  - `@tailwind components` removed — use `@layer utilities` or explicit classes
  - Keep `@tailwind utilities` to generate utilities
- If you get unknown utility errors like `Cannot apply unknown utility class 'border-border'`, avoid using `@apply` on non-existent utilities. Either define those utilities in `@layer utilities` or use CSS variables directly.
- If the server reports `Missing Supabase environment variables` but your `.env` has keys, check names: code accepts `SUPABASE_SERVICE_KEY` or `SUPABASE_KEY` as a fallback.

---

## Scripts

Frontend (in `frontend`):

- `npm run dev` — start Vite dev server
- `npm run build` — build for production

Backend (in `backend`):

- `npm run dev` — start server with nodemon
- `npm run start` — run compiled server

---

## Next steps and suggestions

- Add a root-level `README` run commands section with examples.
- Add tests (Jest) and CI workflow.
- If you use environment-specific configuration, add a `README` section for deployment (e.g., Docker, Vercel, or Render).

---

If you want, I can:

- Run both dev servers here and report exact outputs.
- Create a `postcss.config.cjs` and add `autoprefixer` for consistent CSS builds.
- Add `@layer utilities` definitions so classes like `bg-background` and `border-border` resolve.

Tell me which follow-up you prefer and I'll proceed.
