# Sculpt — Claude Code Context

## What this project is
A platform to build AI agents subtractively — start with a full AI and carve away capabilities you don't want. The result is safer, more focused agents because removed capabilities literally don't exist in the API call.

Three components:
- **Chisel** (`packages/chisel`) — Next.js 16 UI for the sculpting conversation
- **Spec** (`packages/spec`) — Shared TypeScript types + validator for the Sculpture Spec JSON
- **Workshop** (`packages/workshop`) — Express proxy that enforces the spec via three walls

## Current State

### ✅ packages/spec — COMPLETE (8/8 tests)
```bash
cd packages/spec && npm test
```
Files: `src/types.ts`, `src/validator.ts`, `src/helpers.ts`, `src/index.ts`

### ✅ packages/workshop — COMPLETE (13/13 tests)
```bash
cd packages/workshop && npm test
```
Files: `src/walls/wall1.ts`, `wall2.ts`, `wall3.ts`, `src/adapters/anthropic.ts`, `src/specLoader.ts`, `src/rockDust.ts`, `src/server.ts`

### ✅ packages/chisel — COMPLETE (TypeScript clean)
```bash
# Add ANTHROPIC_API_KEY to packages/chisel/.env.local first
npm run dev   # from root — opens at http://localhost:3000
```
Files: `app/globals.css` (design tokens), `app/page.tsx` (landing), `app/sculpt/page.tsx` (chat UI), `app/api/sculpt/message/route.ts` (Claude API)

## What's next
1. ⬜ Spec generator — conversation → Sculpture Spec JSON
2. ⬜ X-Ray visualization page
3. ⬜ Chisel Lock + snapshot versioning
4. ⬜ /agent/[id] page — live agent chat via Workshop
5. ⬜ Dashboard — list agents, specs, rock dust
6. ⬜ Database (PostgreSQL + Redis)
7. ⬜ Auth (Clerk) + Deployment (Vercel + Railway)

## Key Technical Decisions
- npm workspaces monorepo (branch: master)
- Next.js 16 + Tailwind 4 (latest — has breaking changes vs v14)
- Jest hoisted to root — run via `../../node_modules/jest/bin/jest.js`
- Wall 1 is strongest — denied tools never passed to model API
- Wall 2 uses regex in v1 (AI-powered is v1.1)
- Wall 3 is weakest — relies on model following system prompt
- Heartbeat (`reasoning`, `language_understanding`, `context_awareness`) cannot be denied
- Chisel uses `claude-haiku-4-5-20251001` for sculpting conversation

## Sculpture Spec (core data structure)
- `rock` — model provider + model name
- `walls.wall_1_tools` — allowed/denied tool lists
- `walls.wall_2_interception` — regex patterns to block in output
- `walls.wall_3_context` — system prompt + hidden capabilities
- `heartbeat` — immutable core capabilities
- `rock_dust` — append-only audit log

## Reference
- Architecture doc: `docs/ARCHITECTURE.pdf`
- Issues roadmap: `docs/INITIAL_ISSUES.md`
- GitHub: https://github.com/harims95/sculpt
