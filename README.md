# Skarbix Frontend

Current frontend for Skarbix, a premium AI-powered personal finance SaaS with
Monobank integration.

## Current Stack

This codebase is currently Vite, not Next.js:

```text
Vite
React
TypeScript
Tailwind CSS
shadcn-style Radix UI components
Framer Motion
Recharts
Lucide React
Zustand
React Hook Form
Zod
Sonner
i18next
React Router
```

Target direction is documented in:

```text
/opt/skarbix/docs
```

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

## Build Status

Production build has been checked successfully with Node 22 in Docker:

```bash
docker run --rm -v /opt/skarbix/frontend:/app -w /app node:22-alpine sh -lc 'npm ci && npm run build'
```

Known warnings:

- Large main JS bundle.
- `npm audit` reports dependency vulnerabilities.

## Current Routes

The app currently has routes for dashboard, transactions, accounts,
categories, debts, subscriptions, analytics, capital, calendar, budgets, goals,
AI assistant, payments, history, settings, auth, onboarding, landing and static
pages.

## Important

Do not put runtime secrets in frontend code. Anything included in a frontend
build is public.
