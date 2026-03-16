# CampLog MVP Proposal

## Target Environment

- Development OS: macOS
- Runtime: Node.js 20 LTS
- Package manager: npm
- Shell examples: `zsh`
- Local Supabase workflow: `supabase` CLI on macOS

## Directory Structure

```text
Camplog App/
├─ docs/
│  └─ mvp-architecture.md
├─ public/
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  ├─ manifest.json
│  └─ sw.js
├─ src/
│  ├─ app/
│  │  ├─ (auth)/
│  │  │  ├─ login/
│  │  │  │  └─ page.tsx
│  │  │  └─ signup/
│  │  │     └─ page.tsx
│  │  ├─ (dashboard)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ logs/
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ new/
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ [logId]/
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ edit/
│  │  │  │        └─ page.tsx
│  │  │  ├─ gear/
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ new/
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ [gearId]/
│  │  │  │     └─ edit/
│  │  │  │        └─ page.tsx
│  │  │  └─ settings/
│  │  │     └─ page.tsx
│  │  ├─ api/
│  │  │  ├─ upload/
│  │  │  │  └─ route.ts
│  │  │  └─ pwa/
│  │  │     └─ route.ts
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ auth/
│  │  │  ├─ auth-form.tsx
│  │  │  └─ logout-button.tsx
│  │  ├─ gear/
│  │  │  ├─ gear-form.tsx
│  │  │  ├─ gear-list.tsx
│  │  │  └─ gear-picker.tsx
│  │  ├─ logs/
│  │  │  ├─ camp-log-form.tsx
│  │  │  ├─ camp-log-card.tsx
│  │  │  ├─ camp-log-list.tsx
│  │  │  ├─ media-uploader.tsx
│  │  │  └─ weather-badge.tsx
│  │  ├─ layout/
│  │  │  ├─ app-shell.tsx
│  │  │  ├─ header.tsx
│  │  │  ├─ mobile-nav.tsx
│  │  │  └─ sidebar.tsx
│  │  └─ ui/
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ input.tsx
│  │     ├─ select.tsx
│  │     └─ textarea.tsx
│  ├─ lib/
│  │  ├─ auth/
│  │  │  ├─ guard.ts
│  │  │  └─ session.ts
│  │  ├─ supabase/
│  │  │  ├─ browser.ts
│  │  │  ├─ server.ts
│  │  │  ├─ middleware.ts
│  │  │  └─ types.ts
│  │  ├─ pwa/
│  │  │  └─ config.ts
│  │  ├─ constants.ts
│  │  ├─ schemas.ts
│  │  ├─ queries.ts
│  │  └─ utils.ts
│  ├─ hooks/
│  │  ├─ use-offline-status.ts
│  │  └─ use-upload-queue.ts
│  └─ middleware.ts
├─ supabase/
│  ├─ schema.sql
│  ├─ seed.sql
│  └─ storage.sql
├─ .env.example
├─ next.config.ts
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ tsconfig.json
```

## Architecture Notes

- `app/(auth)` handles login and signup with Supabase Auth.
- `app/(dashboard)` contains authenticated screens for logs, gear, and settings.
- `components/logs/media-uploader.tsx` uploads campfire and cooking photos to Supabase Storage.
- `hooks/use-upload-queue.ts` is reserved for offline-first upload recovery after reconnect.
- `supabase/schema.sql` defines the application tables and Row Level Security policies.
- `public/manifest.json` and `next-pwa` provide installability and offline cache for previously visited pages.

## macOS Setup Assumptions

- Project bootstrap uses `npx create-next-app@latest` from Terminal on macOS.
- Library installation uses `npm install` and `npm install -D`.
- Environment variables are managed with `.env.local`.
- PWA verification and manual smoke tests run in a local desktop browser on macOS.
- Supabase can be connected either to a hosted project or a local CLI stack started from macOS.

## MVP Feature Boundaries

- Auth: email/password sign up, sign in, sign out.
- Camp logs: create, list, detail, edit for date, place, weather, campsite type, notes.
- Media: multiple photo upload per camp log with storage path metadata.
- Gear: create and manage owned gear.
- Gear links: attach multiple gear items to a camp log.
- Offline: cached read access for visited pages and static assets; write sync queue can be phase 2 if scope needs trimming.

## Recommended Initial UI Direction

- Dark-first palette with forest green, ember orange, stone neutrals.
- Large photo cards, soft gradients, glassy overlays, and strong section typography.
- Mobile-first shell with bottom navigation and a denser desktop sidebar.

## Implementation Sequence After Approval

1. Bootstrap Next.js app and install `@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`, `tailwindcss`, `lucide-react`, `zod`, and form helpers.
2. Configure Supabase clients, auth guard, middleware, and shared environment typing.
3. Implement auth screens and protected dashboard shell.
4. Implement camp logs CRUD and photo upload flow to Supabase Storage.
5. Implement gear CRUD and log-to-gear linking.
6. Configure manifest, service worker caching, install prompt, and offline notice.
7. Run browser-based verification for auth, logs, gear links, media upload, and offline read behavior on macOS.
