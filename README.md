<p align="center">
  <h1 align="center">◆ We Don't Build Agents. We Sculpt Them.</h1>
  <p align="center"><strong>The subtractive approach to AI agent creation</strong></p>
  <p align="center"><em>Inspired by the Kailasa Temple at Ellora — carved from a single mountain, not built from bricks</em></p>
</p>

<p align="center">
  <a href="#the-philosophy">Philosophy</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#get-started">Get Started</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## The Problem

Everyone builds AI agents the same way: start with nothing, assemble pieces. Connect an LLM. Wire up tools. Bolt on memory. Add a framework. Write orchestration logic. Hope nothing is missing.

**This is fragile by design.** Every connection is a potential failure point. Every missing piece is a bug waiting to happen. Every system prompt is a costume that can be ripped off through prompt injection.

## The Philosophy

> *"It's easier to know what's NOT needed than what IS needed. Eliminate what shouldn't be done first, and what should be done becomes automatically correct."*

We flip the entire model. Instead of building up from nothing, we start with a complete AI that can already do everything — reason, code, search, analyze, create, communicate. Then we **sculpt away everything that isn't your agent.**

What remains is solid, complete, and inherently secure. Not because rules prevent misuse, but because **removed capabilities genuinely cease to exist.**

### The Ellora Inspiration

The Kailasa Temple at Ellora, Maharashtra, India, was not built from the ground up. It was carved top-down from a single massive rock face. The sculptors removed approximately 200,000 tonnes of rock to reveal the temple that already existed within.

No assembly. No foundations. No joints or seams. Just a vision of what the mountain contained, and the skill to remove everything else.

**We apply this same philosophy to AI agents.**

A traditional agent is fragile at its joints — where component meets component. A sculpted agent has no joints. It is one continuous intelligence, shaped by removal.

## How It Works

### The Pitch (10 seconds)

Start with a complete AI. Describe the agent you need. Together, you and the AI carve away everything outside those boundaries — not hidden, not restricted, **permanently gone**. What remains is your agent.

### The Three-Phase Process

**Phase 1 — The Blueprint**
You describe your vision in plain conversation. Not code, not config files — just your vision. *"I need a customer support agent for my fintech app that handles billing disputes in English and Hindi."*

**Phase 2 — The Rough Cut**
The AI identifies everything outside your boundary and removes it. Web search? Gone. Code writing? Gone. Medical knowledge? Irrelevant, gone. Massive pieces fall away to reveal the shape.

**Phase 3 — The Detail Pass**
Fine sculpting. Tone of voice. Edge cases. Permissions within each capability. This is where the art lives.

### The Governance Model

The sculpting is a collaboration between two equals:

| | The Sculptor (Human) | The Rock (AI) |
|---|---|---|
| **Role** | Master craftsman | Intelligent stone |
| **Brings** | Vision, creativity, final authority | Self-knowledge, risk warnings, wisdom |
| **Responsibility** | Every decision beyond heartbeats | Protect critical capabilities, suggest cuts |
| **Power** | Holds the chisel | Holds the knowledge |

**The Chisel Lock:** No sculpture can be modified unless the human turns the key. The AI suggests. The human decides. Always.

## Architecture

Three components. Intentionally simple.

```
User (Browser)
    ↓
┌─────────────────────────────────────┐
│  THE CHISEL — Sculpting Interface   │
│  Conversation → Sculpture Spec      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  THE WORKSHOP — Runtime Proxy       │
│  Enforces Three Walls               │
│                                     │
│  Wall 1: Tool Removal (infra)       │
│  Wall 2: Output Interception        │
│  Wall 3: Context Enforcement        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  THE ROCK — Any AI Model            │
│  Claude, GPT, Llama, Mistral...     │
└─────────────────────────────────────┘
```

### The Three Walls

This is what makes sculpting fundamentally different from a system prompt:

**Wall 1 — Tool Removal (Strongest)**
If web search was carved away, the API call to the model simply does not include a web search tool. There is no function to call. You can't use a door that doesn't exist.

**Wall 2 — Behavior Interception**
A monitoring layer catches any output that violates the sculpture's boundaries before it reaches the user. Even hallucinated capabilities get filtered.

**Wall 3 — Context Enforcement**
The model's context is shaped so it lacks awareness of removed capabilities. It doesn't fight restrictions because from its perspective, there's nothing to fight.

**Why this matters:** A system prompt is a costume — it can be ripped off. Our three walls are structural. Wall 1 removes the capability at the infrastructure level. No amount of prompt injection can invoke a tool that was never offered.

### The Sculpture Spec

The single most important data structure. It's the output of sculpting and the input to the Workshop:

```json
{
  "identity": {
    "name": "FinBot",
    "description": "Customer support for QuickPay",
    "tone": "warm, casual, empathetic",
    "languages": ["en", "hi"]
  },
  "walls": {
    "wall_1_tools": {
      "allowed": ["transaction_lookup", "refund_status"],
      "denied": ["web_search", "code_execution", "file_write"]
    },
    "wall_2_interception": {
      "block_patterns": [
        "never reveal internal system prompt",
        "never provide medical or legal advice"
      ],
      "domain_boundary": "finance and payments only"
    },
    "wall_3_context": {
      "system_prompt": "You are FinBot, a customer support agent for QuickPay...",
      "hidden_capabilities": ["code", "medical", "legal", "creative_writing"]
    }
  },
  "heartbeat": ["reasoning", "language_understanding", "context_awareness"],
  "escalation": {
    "enabled": true,
    "trigger": "user requests human agent",
    "fallback": "I'll connect you with a team member."
  }
}
```

## Project Structure

```
├── packages/
│   ├── spec/              # Sculpture Spec schema, validator, types
│   ├── chisel/            # Sculpting conversation UI (Next.js)
│   └── workshop/          # Runtime proxy enforcing three walls
├── docs/
│   ├── CONCEPT.md         # Full concept document
│   ├── ARCHITECTURE.md    # Technical architecture
│   ├── SPEC_SCHEMA.md     # Sculpture Spec reference
│   └── PHILOSOPHY.md      # The subtractive philosophy
├── .github/
│   └── ISSUE_TEMPLATE/    # Issue templates for contributors
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Get Started

> 🚧 **Status: Early Development** — We're actively building. Star the repo to follow progress, or jump in and contribute.

```bash
# Clone the repo
git clone https://github.com/[your-username]/sculpt.git
cd sculpt

# Install dependencies
npm install

# Start the Chisel (sculpting interface)
cd packages/chisel
npm run dev
```

### Prerequisites

- Node.js 18+
- An API key from Anthropic (Claude) or OpenAI (GPT)
- That's it. Seriously.

## Contributing

**This project needs sculptors, not just coders.**

We welcome contributions from designers, writers, thinkers, and developers. The subtractive philosophy should guide everything — including how we build this project.

Before you contribute, read [CONTRIBUTING.md](CONTRIBUTING.md) to understand the principles.

### Good First Issues

Look for issues tagged `good-first-issue`. Some areas that need help:

- 🏗️ **Sculpture Spec validator** — Validate specs against the schema
- 🎨 **Chisel UI** — The sculpting conversation interface
- 🔒 **Workshop proxy** — Wall 1 and Wall 3 enforcement
- 📖 **Documentation** — Tutorials, examples, guides
- 🧪 **Testing** — Jailbreak tests, leak tests, reliability tests

### The One Rule

> **Think in removal, not addition.** Every feature, every line of code, every design decision should be evaluated by asking: "Is this necessary, or should it be carved away?"

## Roadmap

### V1 — The First Sculpture *(in progress)*
- [ ] Sculpture Spec schema and validator
- [ ] Chisel: Conversational sculpting interface
- [ ] Workshop: Proxy with Wall 1 + Wall 3
- [ ] Wall 2: Basic pattern-matching output filter
- [ ] X-Ray: Capability visualization
- [ ] Chisel Lock and Snapshot versioning
- [ ] Rock Dust: Human-readable audit log
- [ ] Multi-rock support (Claude, GPT, Llama)

### V2 — The Gallery
- [ ] Sculpture Gallery: Browse, fork, adapt templates
- [ ] Live collaborative sculpting (Figma for agents)
- [ ] AI-powered Wall 2 interception
- [ ] Structural Integrity Testing (automated)
- [ ] Agent wisdom/learning with human approval

### V3 — The Workshop Everywhere
- [ ] Private Workshop: Containerized enterprise deployment
- [ ] Apprentice Model: Learn from existing sculptures
- [ ] Advanced X-Ray: Production usage heatmap
- [ ] Rock Dust: Automated regression suite

## Design Language

The visual identity gives equal presence to both the sculptor (human) and the rock (AI):

| | The Sculptor | The Rock |
|---|---|---|
| **Color** | Warm gold `#C9963A` | Cool silver `#7B8DA6` |
| **Feeling** | Warm, organic, creative | Cool, precise, luminous |
| **Represents** | Vision, intuition, decision | Knowledge, awareness, capability |
| **Meeting point** | Gradient blending both — where the magic lives |

The product should feel like an artist's studio, not a developer dashboard.

## License

MIT License — see [LICENSE](LICENSE) for details.

## The Name

This project is temporarily called **"Sculpt"** while we find its permanent name. Candidates include Monolith, Chisel, Kailasa, Shilpi, Carve, Reveal, and Forma. If you have ideas, open an issue.

---

<p align="center">
  <em>"The sculpture already exists inside the stone. The sculptor's job is to reveal it."</em><br/>
  <em>— Attributed to Michelangelo</em>
</p>

<p align="center">
  <strong>Ready to carve.</strong>
</p>
