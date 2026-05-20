# PaintCon Sales Dashboard

A full-stack sales dashboard for the PaintCon 2026 ticket campaign. Dark, modern, client-facing demo quality.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v3 + Recharts + React Router v6 + Firebase Auth
- **Backend**: Node.js + Express (mock data, no database required)

## Quick Start (Demo Mode)

Firebase is optional. The app runs in **Demo Mode** automatically when Firebase is not configured — auth is handled via localStorage.

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Log in

Open http://localhost:5173 and use any of the demo credentials:

| Role  | Email                          | Password   |
|-------|--------------------------------|------------|
| Owner | owner@paintcon.com             | demo1234   |
| Rep   | sarah.chen@paintcon.com        | demo1234   |
| Rep   | marcus.johnson@paintcon.com    | demo1234   |
| Rep   | emily.rodriguez@paintcon.com   | demo1234   |
| Rep   | david.kim@paintcon.com         | demo1234   |
| Rep   | jessica.taylor@paintcon.com    | demo1234   |

## Firebase Setup (Optional)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication > Email/Password**
3. Create user accounts with the emails above
4. Copy `frontend/.env.example` to `frontend/.env` and fill in your Firebase config

```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your Firebase credentials
```

## Environment Variables

### Frontend (`frontend/.env`)

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)

```
PORT=3001
NODE_ENV=development
```

## Deployment

### Backend (Render)

See `backend/render.yaml`. Deploy the `backend/` directory as a Node.js web service.

### Frontend (Vercel)

1. Update `frontend/vercel.json` with your Render backend URL
2. Deploy the `frontend/` directory to Vercel
3. Set the `VITE_*` environment variables in Vercel project settings

## Project Structure

```
paintcon-sales-dashboard/
├── backend/
│   ├── server.js           # Express app entry point
│   └── src/
│       ├── data/mockData.js    # All campaign mock data
│       └── routes/
│           ├── team.js         # /api/team endpoints
│           └── reps.js         # /api/reps endpoints
└── frontend/
    └── src/
        ├── pages/
        │   ├── LoginPage.jsx       # Auth with demo mode fallback
        │   ├── OwnerDashboard.jsx  # Full team overview
        │   └── RepDashboard.jsx    # Individual rep view
        └── components/
            ├── shared/             # Navbar, KPICard, ProtectedRoute
            ├── owner/              # Campaign, KPIs, Charts, Leaderboard
            └── rep/                # Personal KPIs, Target, Trend, Feed
```

## Campaign Data Summary

- **Campaign**: Dec 1, 2025 – May 31, 2026
- **Goal**: 1,000 tickets @ $149 each
- **Sold to date**: 683 tickets ($101,767 revenue)
- **Progress**: 68.3%
- **5 Reps**: Sarah Chen, Marcus Johnson, Emily Rodriguez, David Kim, Jessica Taylor
