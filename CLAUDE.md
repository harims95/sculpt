# Sculpt — Claude Code Context

## What this project is
A platform to build AI agents subtractively — start with a full AI and carve away capabilities you don't want. Production-ready MVP built for fundraising.

## Packages
| Package | Status | Description |
|---|---|---|
| `packages/spec` | ✅ 8/8 tests | TypeScript types + validator |
| `packages/workshop` | ✅ 13/13 tests | Express proxy (3 walls) |
| `packages/chisel` | ✅ TypeScript clean | Next.js 16 full UI |
| `packages/db` | ✅ TypeScript clean | Prisma + PostgreSQL |

## MVP is complete — ready to deploy

### Run locally
```bash
cp packages/chisel/.env.local.example packages/chisel/.env.local
# Fill: ANTHROPIC_API_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
#       DATABASE_URL, ENCRYPTION_KEY, NEXT_PUBLIC_WORKSHOP_URL

npm run db:push        # run DB migrations (once)
npm run dev            # chisel → http://localhost:3000
npm run workshop:dev   # workshop → http://localhost:3001 (separate terminal)
```

### Deploy (see DEPLOY.md for full steps)
1. **Neon** — free PostgreSQL → `DATABASE_URL`
2. **Clerk** — auth keys + webhook secret
3. **Railway** — deploy workshop via Dockerfile
4. **Vercel** — deploy chisel, set all env vars

## Pages
- `/` — landing
- `/sign-in` `/sign-up` — Clerk auth
- `/sculpt` — sculpting conversation (protected)
- `/sculpt/xray` — X-Ray spec review + Chisel Lock
- `/agent/[id]` — live chat with deployed agent
- `/agent/[id]/dust` — Rock Dust audit log
- `/dashboard` — all user's agents

## Key Technical Decisions
- npm workspaces monorepo, branch: master
- Next.js 16 + Tailwind 4 (breaking changes vs v14 — read AGENTS.md in chisel)
- Clerk v7 — use `useAuth()` hook, `SignInButton`/`SignUpButton` (NO `SignedIn`/`SignedOut`)
- Jest hoisted to root — run via `../../node_modules/jest/bin/jest.js`
- Wall 1 strongest — denied tools never in API call
- Wall 2 regex v1, AI-powered v1.1
- Heartbeat (`reasoning`, `language_understanding`, `context_awareness`) cannot be denied
- Workshop auto-switches: in-memory if no DATABASE_URL, PostgreSQL if set
- API keys encrypted AES-256-GCM via `packages/db/src/crypto.ts`
- `NEXT_PUBLIC_WORKSHOP_URL` env var controls workshop endpoint (no hardcoded localhost)

## What's next (post-MVP / v2)
- Stripe payments
- Analytics + usage metrics
- Agent public sharing / gallery
- Rate limiting
- Redis cache
- Mobile app

## Reference
- Architecture doc: `docs/ARCHITECTURE.pdf`
- Deployment guide: `DEPLOY.md`
- GitHub: https://github.com/harims95/sculpt
