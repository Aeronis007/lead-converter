# Unified Lead Management Platform

A unified lead management system for importing, cleaning, and managing leads across channels. The monorepo contains a Next.js frontend and a Node/Express backend built with TypeScript and Prisma.

## Project Goals
- Upload leads from CSV/Excel/Google Sheets exports
- Auto-detect and map lead columns (first name, last name, email, phone, etc.)
- Confirm/customize column mapping
- Validate and clean lead data
- Store leads in PostgreSQL
- Manage and filter leads in a dashboard
- Enable future integrations with ad platforms (Meta, Google, etc.)

## Monorepo Structure
```
apps/
  web/          # Next.js (App Router) + Tailwind CSS
services/
  api/          # Node.js + Express + Prisma
```

## Getting Started
### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup
1. Install dependencies at the root:
   ```bash
   npm install
   ```
2. Copy environment templates and fill in values:
   ```bash
   cp .env.example .env
   cp apps/web/.env.example apps/web/.env.local
   cp services/api/.env.example services/api/.env
   ```
3. Start the development servers:
   ```bash
   npm run dev
   ```

### Backend (API) Scripts
From `services/api`:
```bash
npm run dev
npm run build
npm run start
```

### Frontend (Web) Scripts
From `apps/web`:
```bash
npm run dev
npm run build
npm run start
```

## Environment Variables
Root `.env` (shared tooling):
- `DATABASE_URL` - PostgreSQL connection string

Backend `.env`:
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Frontend `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`

## Roadmap
- [ ] Authentication (JWT, refresh tokens, RBAC)
- [ ] Lead import wizard (CSV/XLSX/Google Sheets)
- [ ] Auto column detection + mapping UI
- [ ] Validation + normalization pipeline
- [ ] Lead list, filters, and detail pages
- [ ] Team management + roles
- [ ] Integrations (Meta, Google, Webhooks)
- [ ] Auditing and activity logs
- [ ] Ad platform integrations (Meta, Google, LinkedIn)
- [ ] AI-based lead scoring
- [ ] Campaign attribution reporting
- [ ] Multi-tenant support

## Architecture Notes
- App Router with feature-first organization for frontend.
- Service layer in API for business logic.
- Prisma schema modularized for future enterprise extensions.
