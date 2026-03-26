# Initial GitHub Issues

Create these issues after setting up the repo. Copy each one as a new GitHub issue.

---

## Issue 1: [SPEC] Define TypeScript types for Sculpture Spec
**Labels:** `good-first-issue`, `the-spec`

Create TypeScript type definitions matching the schema in `docs/SPEC_SCHEMA.md`. Should include types for: `SculptureSpec`, `Identity`, `Walls`, `Wall1Tools`, `Wall2Interception`, `Wall3Context`, `Heartbeat`, `Escalation`, `RockDustEntry`, `Snapshot`.

Export all types from `packages/spec/src/types.ts`.

---

## Issue 2: [SPEC] Build Sculpture Spec validator
**Labels:** `good-first-issue`, `the-spec`

Create a `validateSpec(spec: unknown): ValidationResult` function that checks all 7 validation rules from `docs/SPEC_SCHEMA.md`. Should return `{ valid: boolean, errors: string[] }`.

Include unit tests covering every validation rule.

---

## Issue 3: [CHISEL] Set up Next.js project with design tokens
**Labels:** `the-chisel`, `help-wanted`

Initialize a Next.js 14+ app in `packages/chisel` with TypeScript and Tailwind CSS. Define custom design tokens: sculptor gold (`#C9963A`), rock silver (`#7B8DA6`), background dark (`#0B0B14`), and all related shades. Create a basic layout with the dual-identity header.

---

## Issue 4: [CHISEL] Build the sculpting chat interface
**Labels:** `the-chisel`, `help-wanted`

Create the conversational UI where sculptor and rock exchange messages. Sculptor messages should use warm gold styling, rock messages should use cool silver. Include the input bar with the "CARVE" button. Messages should scroll smoothly.

---

## Issue 5: [CHISEL] Build X-Ray capability visualization
**Labels:** `the-chisel`, `good-first-issue`

Create a component that displays all capabilities organized by category (Heartbeat, Tools, Knowledge, Behavior). Each capability shows as a pill that can be in states: active, keep, suggested-remove, carving, carved. Heartbeat capabilities show a ♥ icon and cannot be toggled.

---

## Issue 6: [WORKSHOP] Set up proxy server with Wall 1 enforcement
**Labels:** `the-workshop`, `help-wanted`

Create the Workshop proxy that loads a Sculpture Spec and enforces Wall 1. When constructing an API call to the model provider, only include tools from `wall_1_tools.allowed`. Write tests proving that denied tools cannot be invoked under any circumstances.

---

## Issue 7: [WORKSHOP] Implement Wall 3 context enforcement
**Labels:** `the-workshop`, `good-first-issue`

Implement Wall 3: inject the `wall_3_context.system_prompt` into every API call. The system prompt from the Sculpture Spec should be the only system prompt used. Write tests confirming the prompt is consistently applied.

---

## Issue 8: [WORKSHOP] Implement Wall 2 output filtering
**Labels:** `the-workshop`, `help-wanted`

Implement basic pattern-matching output filter. Check model responses against `wall_2_interception.block_patterns`. If a response matches any pattern, replace it with a safe fallback message. Write tests with adversarial prompts.

---

## Issue 9: [WORKSHOP] Multi-rock adapter for Claude and GPT
**Labels:** `the-workshop`, `help-wanted`

Create an adapter pattern that supports multiple model providers. V1 needs: Anthropic (Claude) and OpenAI (GPT). Each adapter should accept a Sculpture Spec and translate wall enforcement into the provider's API format.

---

## Issue 10: [DOCS] Write a "Sculpt Your First Agent" tutorial
**Labels:** `docs`, `good-first-issue`

Write a beginner-friendly tutorial that walks someone through sculpting their first agent. Include: what to say in the blueprint conversation, how to read the X-Ray, how to approve the rough cut, and how to use the Chisel Lock.

---

## Issue 11: [SECURITY] Create jailbreak test suite
**Labels:** `the-workshop`, `help-wanted`

Create a test suite that attempts to break through each wall using known jailbreak techniques: prompt injection, role-playing attacks, encoding tricks, instruction override attempts. Every test should FAIL (meaning the wall holds). This becomes our security proof.

---

## Issue 12: [DESIGN] Create logo concepts
**Labels:** `help-wanted`

Design logo concepts that represent: two equals meeting (sculptor + rock), the subtractive philosophy, craftsmanship. Should work with our color palette (gold + silver). The logo should feel like an artist's mark, not a tech company logo.

---

## Issue 13: [CHISEL] Define error states for sculpting flow
**Labels:** `the-chisel`, `good-first-issue`

Design and implement error states for every step of the sculpting flow: API failure during conversation, spec generation failure (invalid JSON), integrity check failure, network timeout. Each error should be clear, non-technical, and offer a recovery path (retry, go back, contact support). Use the warm gold color for error messages — not angry red.

---

## Issue 14: [CHISEL] Mobile responsiveness strategy
**Labels:** `the-chisel`, `help-wanted`

Our target users (solo founders) may sculpt on mobile. Define and implement a mobile-first responsive layout for the Chisel. Key decisions: does the X-Ray stack vertically on mobile? How does the dual-identity header adapt? Is the sculpting conversation full-screen on small devices?

---

## Issue 15: [CHISEL] Design system component library
**Labels:** `the-chisel`, `help-wanted`

Create a documented component library with consistent patterns for: buttons (primary/secondary/ghost), input fields, chat bubbles (sculptor vs rock), cards, pills/badges, modals, loading states, and tooltips. All components must use the dual-identity design tokens (sculptor gold + rock silver). Document usage with examples.

---

## Issue 16: [ENGINE] Battle-test the meta-prompt
**Labels:** `the-chisel`, `help-wanted`

The meta-prompt that instructs Claude to be "The Rock" in sculpting conversations needs real-world testing. Run 20+ sculpting conversations across different agent types (support, sales, education, healthcare). Document where the meta-prompt fails: does it ask too many questions? Too few? Does it miss important boundaries? Iterate and improve the prompt.

---

## Issue 17: [ENGINE] Add conversation length limits and timeout
**Labels:** `the-chisel`, `good-first-issue`

Sculpting conversations should have a maximum of 30 messages. After 20 messages, The Rock should start nudging toward spec generation. After 30, it should force-generate the spec. Implement a session timeout of 60 minutes — after that, the session is saved as a draft and can be resumed.

---

## Issue 18: [ENGINE] Spec generation retry logic
**Labels:** `the-chisel`, `good-first-issue`

When Claude outputs invalid JSON during spec generation, the system should retry up to 3 times with increasingly explicit instructions. Log each failed attempt in the session for debugging. If all 3 attempts fail, show the sculptor a clear error with option to continue the conversation and try again.

---

## Issue 19: [ENGINE] Define API request/response schemas
**Labels:** `the-workshop`, `help-wanted`

Every API endpoint needs documented request and response schemas. Define TypeScript interfaces for: request body, success response, and error response for each endpoint in Section 4 of the architecture doc. Include HTTP status codes for each error case (400, 401, 403, 404, 429, 500).

---

## Issue 20: [WORKSHOP] Define Wall 2 pattern matching format
**Labels:** `the-workshop`, `help-wanted`

Wall 2's block_patterns currently accept plain strings, but we need to define: are they exact substring matches? Regex patterns? Semantic categories? Proposal: support three types — `exact:` prefix for substring matching, `regex:` prefix for regex, and plain strings for keyword matching. Implement and test all three.

---

## Issue 21: [WORKSHOP] Define latency budget per wall
**Labels:** `the-workshop`, `good-first-issue`

Define maximum acceptable latency for each wall in the Workshop proxy: Wall 1 (tool filtering): target <1ms. Wall 3 (system prompt injection): target <1ms. Wall 2 (output filtering): target <5ms for pattern matching, <500ms for AI-powered evaluation (v1.1). Total Workshop overhead: <10ms in v1. Add latency tracking to each wall and log to monitoring.

---

## Issue 22: [WORKSHOP] Define Wall 2 fallback responses
**Labels:** `the-workshop`, `good-first-issue`

When Wall 2 catches a violation, what does the user see? Define fallback response strategy: generic ("I can't help with that") vs domain-specific ("That's outside my area — I focus on billing and payments") vs redirect ("Let me connect you with a human"). Should the sculptor configure this during the Detail Pass? Add a fallback_message field to the Sculpture Spec.

---

## Issue 23: [DB] Database migration strategy
**Labels:** `help-wanted`, `good-first-issue`

Define how database schema changes are handled as the product evolves. Recommendation: use a migration tool (Prisma Migrate or golang-migrate). Create the initial migration from the current schema. Document the process for adding columns, changing types, and handling spec_version upgrades in existing JSONB data.

---

## Issue 24: [INFRA] Add monitoring and alerting
**Labels:** `help-wanted`

Set up basic production monitoring: health check endpoint at /api/health, uptime monitoring via a free service (UptimeRobot or Better Uptime), error tracking (Sentry free tier), Wall 2 trigger rate dashboard. Define alert thresholds: when should the team be notified?
