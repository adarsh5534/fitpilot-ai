# FitPilot AI

AI-powered personal fitness coaching application.

**Tech Stack:** React Native + Expo · Node.js + Express · Supabase · OpenAI

## Project Structure

```
fitpilot-ai/
├── apps/
│   ├── mobile/          # Expo React Native app
│   └── api/             # Express TypeScript backend
├── packages/
│   └── shared/          # Shared Zod schemas + TypeScript types
├── database/
│   ├── migrations/      # SQL schema migrations
│   └── seeds/           # Development seed data
└── docs/                # Architecture documentation
```

## Getting Started

### Prerequisites
- Node.js ≥ 20
- A Supabase project (free tier works)

### 1. Install dependencies

```bash
# From repo root (installs api + shared packages)
npm install

# Install mobile app deps separately (uses its own package manager)
cd apps/mobile
npm install
```

### 2. Set up environment variables

```bash
# API
cp .env.example apps/api/.env
# Edit apps/api/.env with your Supabase credentials
```

### 3. Run database migrations

Go to your Supabase project → SQL Editor, then run in order:
1. `database/migrations/001_initial_schema.sql`
2. `database/migrations/002_rls_policies.sql`
3. `database/seeds/001_exercises.sql` (optional, for dev)

### 4. Start the API

```bash
npm run dev:api
# or
cd apps/api && npm run dev
```

API runs at: http://localhost:3000  
Health check: http://localhost:3000/health

### 5. Start the mobile app

```bash
cd apps/mobile
npm start
```

Scan the QR code with Expo Go (iOS/Android) or press `a` for Android emulator.

## Development Phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project Foundation | ✅ Complete |
| 2 | Authentication & Profile | 🔜 Next |
| 3 | Workout Management | 📅 Planned |
| 4 | Nutrition Tracking | 📅 Planned |
| 5 | AI Integration | 📅 Planned |
| 6 | Progress Analytics | 📅 Planned |
| 7 | Advanced Features | 📅 Planned |

## TypeScript Checks

```bash
npm run typecheck:api      # Check API
npm run typecheck:shared   # Check shared package
cd apps/mobile && npx tsc --noEmit  # Check mobile
```
