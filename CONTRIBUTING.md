# Contributing to Sculpt

Thank you for wanting to help carve this project. Before you pick up the chisel, please read these guidelines.

## The Sculpting Principle

This project is built on a subtractive philosophy. That applies to the product AND to how we build it:

> **Before adding anything, ask: "Is this necessary, or should it be carved away?"**

We value:
- **Simplicity over complexity** — fewer files, fewer dependencies, fewer abstractions
- **Clarity over cleverness** — readable code beats compact code
- **Removal over addition** — if a feature isn't essential for v1, it doesn't exist yet
- **Conversation over configuration** — in the product AND in how we collaborate

## How to Contribute

### 1. Find an Issue

Browse open issues. Look for labels:
- `good-first-issue` — great starting points
- `help-wanted` — we need your skills here
- `the-chisel` — frontend/UI work
- `the-workshop` — backend/proxy work
- `the-spec` — Sculpture Spec schema work
- `docs` — documentation improvements
- `philosophy` — conceptual discussions

### 2. Claim It

Comment on the issue saying you'd like to work on it. Wait for a maintainer to assign it to you. This prevents duplicate work.

### 3. Fork and Branch

```bash
git fork
git checkout -b feature/your-feature-name
```

### 4. Build

Follow the setup instructions in README.md. Make your changes.

### 5. Submit a PR

- Keep PRs focused — one change per PR
- Describe what you changed and why
- Reference the issue number
- Include screenshots for UI changes

## Code Style

### General

- TypeScript for all new code
- Meaningful variable names over comments
- No unnecessary abstractions — if a function is only called once, it might not need to exist
- Delete dead code — don't comment it out

### Frontend (The Chisel)

- React with hooks
- Tailwind CSS with custom design tokens (see design system in docs)
- No component libraries — we craft our own UI
- Respect the dual-identity design: warm gold for sculptor, cool silver for rock

### Backend (The Workshop)

- Next.js API routes for v1 (no separate server)
- Explicit error handling — never swallow errors silently
- Every Wall enforcement must be testable in isolation

### The Sculpture Spec

- JSON Schema for validation
- Any changes to the spec schema require a discussion issue first
- Backward compatibility matters — existing specs must not break

## What We Don't Want

In the spirit of subtractive design:

- **No unnecessary dependencies** — every npm package must justify its existence
- **No premature optimization** — make it work, make it right, then make it fast
- **No feature creep** — if it's not in the v1 roadmap, open a discussion first
- **No AI-generated PRs without understanding** — if you use AI to write code, you must understand and be able to explain every line

## The Heartbeat Rule

Some parts of this project are heartbeat capabilities — they must never be broken:

- The Sculpture Spec schema must always validate
- Wall 1 (tool removal) must have 100% enforcement — no exceptions
- The Chisel Lock must never be bypassable
- Rock Dust logging must never lose data

PRs that break heartbeat capabilities will not be merged.

## Community

- Be kind. This project has soul — protect that.
- Disagree constructively. Challenge ideas, not people.
- Remember: the sculptor and the rock are equals. So are all contributors.

## Questions?

Open a discussion issue. We'd rather answer questions than fix misunderstandings.

---

*"The sculpture already exists inside the stone. Your contribution helps reveal it."*
