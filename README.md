# CampLog

CampLog is a Next.js MVP for recording camp trips, attached media, and reusable gear loadouts. The app is designed to run in two modes:

- `demo` mode when Supabase environment variables are missing
- `supabase` mode when Auth, Postgres, and Storage credentials are configured

## Stack

- Next.js 16 App Router
- Tailwind CSS 4
- Supabase Auth, Database, Storage
- `next-pwa`
- Playwright for smoke testing

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Supabase values to `.env.local` if you want real backend mode:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Mode

If `.env.local` is empty, the app falls back to local demo storage in the browser.

- Demo email: `demo@camplog.app`
- Demo password: `password123`

This keeps the app usable before Supabase is connected.

## Supabase Rollout

Run the SQL in this order:

1. [supabase/schema.sql](/Users/toyoharukohyama/Documents/Camplog%20App/supabase/schema.sql)
2. [supabase/seed.sql](/Users/toyoharukohyama/Documents/Camplog%20App/supabase/seed.sql) if you want starter data

Notes:

- `schema.sql` creates tables, triggers, RLS policies, and the `camp-media` bucket.
- Upload paths are expected to follow the convention documented in [supabase/storage.sql](/Users/toyoharukohyama/Documents/Camplog%20App/supabase/storage.sql).
- Once env vars are present, the app switches from demo storage to Supabase automatically.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run smoke
```

## PWA

- Manifest: [public/manifest.json](/Users/toyoharukohyama/Documents/Camplog%20App/public/manifest.json)
- Service worker is generated into `public/sw.js` during production build
- For PWA verification, build first and run a production server:

```bash
npm run build
npx next start --port 3001
```

## Auth Session Middleware

- [middleware.ts](/Users/toyoharukohyama/Documents/Camplog%20App/middleware.ts) refreshes Supabase auth cookies when env vars are set.
- [src/lib/supabase/middleware.ts](/Users/toyoharukohyama/Documents/Camplog%20App/src/lib/supabase/middleware.ts) is a no-op in demo mode.

## Verification Done

The current implementation has been validated with:

- `npm run lint`
- `npm run build`
- `npm run smoke`
- manifest and service worker checks on a production server
