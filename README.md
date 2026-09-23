# On-Demand Service Platform (Monorepo)

A full-stack, multi-application platform for real-time on-demand services built with Node.js/Express, TypeScript, Prisma, Redis, Socket.IO, React Native (Expo), and Next.js.

## Monorepo Architecture

```
.
├── apps/
│   ├── customer-app/        # React Native (Expo) app for end-users
│   ├── provider-app/        # React Native (Expo) app for service providers
│   └── admin-dashboard/     # Next.js web application for system administrators
├── backend/                 # Node.js + Express + Prisma + Socket.IO REST & WebSocket API
└── plans/                   # Architectural blueprints & implementation milestones
```

## Security & Environment Configuration

Sensitive files like `.env` and compiled artifacts are strictly excluded from version control via `.gitignore`. 

- Copy `.env.example` to `.env` in the `backend/` directory before running locally.
- Never commit credentials, private keys, or API tokens.

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis
- Expo CLI (for mobile development)

## Getting Started

1. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npx prisma db push
   npm run dev
   ```

2. **Setup Mobile Apps:**
   ```bash
   cd apps/customer-app # or apps/provider-app
   npm install
   npx expo start
   ```

3. **Setup Admin Dashboard:**
   ```bash
   cd apps/admin-dashboard
   npm install
   npm run dev
   ```
