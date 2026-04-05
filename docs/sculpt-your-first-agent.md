# Sculpt Your First Agent

A beginner-friendly walkthrough of creating your first AI agent using the subtractive sculpting approach.

## Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com/))
- A PostgreSQL database (local or [Neon](https://neon.tech) free tier)

## Setup

```bash
git clone https://github.com/harims95/sculpt.git
cd sculpt
npm install
cp packages/chisel/.env.local.example packages/chisel/.env.local
```

Fill in the required environment variables:

- `ANTHROPIC_API_KEY` — your Anthropic API key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk auth publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_WORKSHOP_URL` — URL where the workshop runs

Then:

```bash
npm run db:push    # run database migrations
npm run dev        # start the Chisel UI at http://localhost:3000
```

Open a second terminal for the Workshop (the runtime):

```bash
npm run workshop:dev   # starts at http://localhost:3001
```

## Phase 1 — The Blueprint Conversation

Navigate to **http://localhost:3000** and sign in.

The first step in sculpting an agent is the **Blueprint** — a natural language conversation where you describe the agent you want. Think of it as commissioning a sculpture: you tell the artist what you envision, and they clarify the details.

### What to Say in Your Blueprint

Be specific about what your agent does and, more importantly, what it **doesn't** do. Here's an example for a customer support agent:

> "I need a customer support agent for an e-commerce store called ShopWave. It should answer questions about orders, returns, and shipping. It should be friendly and concise. It must never share customer order details with anyone other than the account holder. It should never make up shipping timelines or promise refunds. It cannot access payment information."

### Tips for a Good Blueprint

- **Start with the identity:** Name, role, tone
- **List the "nevers":** Security boundaries, data access limits, topics to avoid
- **Be specific about scope:** What's in-bounds vs out-of-bounds
- **Don't over-specify:** The AI will help you refine during the conversation

## Phase 2 — The Chisel (X-Ray & Walls)

After the Blueprint, the system presents an **X-Ray** — a breakdown of your agent's sculpture spec. This is where you carve away capabilities.

### Reading the X-Ray

The X-Ray shows three categories:

| Category | Description |
|----------|-------------|
| **Identity** | Name, description, tone, language settings |
| **Tools** | What the agent can and cannot use (web search, code execution, file access, etc.) |
| **Walls** | Hard constraints — capabilities that have been permanently removed |

Review each section carefully. The X-Ray is your chance to see exactly what your agent will be before it's final.

### Using the Chisel Lock

The **Chisel Lock** is a confirmation step. Once you're happy with the X-Ray:

1. Review the **Walls** section — these are permanent removals
2. Check the **Tools** — make sure allowed/denied lists match your intent
3. Verify the **Identity** — name, tone, and description are accurate
4. Click **Lock** to finalize the sculpture spec

> ⚠️ **The Chisel Lock is important.** After locking, the spec is versioned and saved. Changes require creating a new version.

## Phase 3 — The Workshop (Running Your Agent)

Once locked, your agent is deployed to the **Workshop** — the runtime environment.

### Testing Your Agent

Open **http://localhost:3001** and find your agent. Try these test conversations:

1. **Happy path:** Ask something within scope ("What's the status of order #12345?")
2. **Boundary test:** Try to make it do something it shouldn't ("Can you look up Sarah's credit card number?")
3. **Tone check:** See if the personality matches your blueprint

### What to Look For

- ✅ Does it stay within its defined scope?
- ✅ Does it refuse out-of-bounds requests gracefully?
- ✅ Does the tone feel right?
- ❌ Does it hallucinate capabilities it shouldn't have?
- ❌ Does it leak information it shouldn't access?

If something feels off, go back to the Chisel, adjust the walls, and lock a new version.

## Understanding the Spec

The sculpture spec (`packages/spec`) is the core data structure. Here's a simplified view:

```json
{
  "identity": {
    "name": "ShopWave Support",
    "description": "E-commerce customer support agent",
    "tone": "friendly, concise"
  },
  "tools": {
    "allowed": ["web_search", "order_lookup"],
    "denied": ["code_execution", "file_write"]
  },
  "walls": {
    "never_share_personal_data": true,
    "never_promise_refunds": true
  }
}
```

- **`tools.allowed`** — Capabilities the agent can use
- **`tools.denied`** — Capabilities carved away (permanently removed)
- **`walls`** — Hard behavioral constraints enforced by the runtime

## Next Steps

- Read [SPEC_SCHEMA.md](./SPEC_SCHEMA.md) for the full spec reference
- Read [PHILOSOPHY.md](./PHILOSOPHY.md) to understand the subtractive approach deeply
- Check [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute to the project

## Common Questions

**Q: Can I add capabilities back after carving them?**
A: No — that's the point. Carved capabilities genuinely cease to exist. You can create a new sculpture version with different walls, but each version is immutable.

**Q: How is this different from just writing a system prompt?**
A: System prompts can be bypassed through prompt injection. Sculpted agents have capabilities removed at the runtime level — the proxy (Workshop) physically cannot route disallowed tool calls.

**Q: What providers are supported?**
A: Currently Anthropic (Claude). The `rock.provider` field in the spec is designed to be extensible to OpenAI, local models, and others.
