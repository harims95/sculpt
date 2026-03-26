# Sculpture Spec Reference

The Sculpture Spec is the single most important data structure in the system. It is the output of the sculpting conversation (The Chisel) and the input to the runtime (The Workshop).

## Full Schema

```json
{
  "spec_version": "string — schema version (e.g., '1.0'). Used for migration compatibility.",
  "id": "string — unique identifier",
  "version": "number — spec version, increments on each snapshot",
  "created_at": "ISO 8601 timestamp",
  "sculptor_id": "string — user who created this sculpture",

  "rock": {
    "provider": "anthropic | openai | local",
    "model": "string — specific model identifier"
  },

  "identity": {
    "name": "string — short agent name",
    "description": "string — one-line description",
    "tone": "string — tone description (e.g., 'warm, casual, empathetic')",
    "languages": ["string — ISO language codes"]
  },

  "walls": {
    "wall_1_tools": {
      "allowed": ["string — tools the agent CAN use"],
      "denied": ["string — tools that have been carved away"]
    },
    "wall_2_interception": {
      "block_patterns": ["string — behaviors to block in outputs"],
      "domain_boundary": "string — the domain the agent operates within"
    },
    "wall_3_context": {
      "system_prompt": "string — the full system prompt for the sculpted agent",
      "hidden_capabilities": ["string — domains the agent should not know about"]
    }
  },

  "heartbeat": ["string — capabilities that must never be removed"],

  "escalation": {
    "enabled": "boolean",
    "trigger": "string — when to escalate",
    "fallback": "string — message to show when escalating"
  },

  "snapshots": ["array of previous spec versions"],
  "rock_dust": ["array of audit log entries"]
}
```

## Field Details

### `walls.wall_1_tools`

**This is the strongest wall.** Tools listed in `denied` are never included in API calls to the model. The model cannot invoke a tool it was never offered.

Available tools:
- `web_search` — search the internet
- `code_execution` — run code
- `code_writing` — generate code
- `code_reading` — analyze code
- `file_reading` — read uploaded files
- `file_creation` — create new files
- `data_analysis` — analyze structured data
- `image_understanding` — interpret images
- `mathematics` — mathematical computation
- `translation` — language translation

### `walls.wall_2_interception`

**Output filter.** The `block_patterns` array contains rules that are checked against every model response before it reaches the end user. If a response matches a pattern, it is replaced with a safe fallback.

V1 uses string pattern matching. V1.1 will add AI-powered evaluation.

### `walls.wall_3_context`

**The system prompt.** This shapes the model's understanding of its own identity and capabilities. The `hidden_capabilities` array lists domains that the system prompt explicitly states the agent does not possess.

Note: This is the weakest wall when used alone. Its strength comes from being backed by Wall 1 and Wall 2.

### `heartbeat`

**Protected capabilities.** These can never be removed by adaptive changes. Only a full re-sculpt with Chisel Lock approval can modify them. Default heartbeats:

- `reasoning` — logical thinking
- `language_understanding` — comprehending input
- `context_awareness` — maintaining conversation context

### `rock_dust`

**Audit trail.** Each entry records:

```json
{
  "timestamp": "ISO 8601",
  "action": "string — what happened",
  "reason": "string — why",
  "approved_by": "string — sculptor or system",
  "details": {}
}
```

## Validation Rules

1. `spec_version` must be a recognized version string
2. `heartbeat` array must contain at least `reasoning`, `language_understanding`, `context_awareness`
3. `wall_1_tools.allowed` and `wall_1_tools.denied` must not overlap
4. `identity.name` must be non-empty, max 100 characters
5. `identity.description` max 500 characters
6. `walls.wall_3_context.system_prompt` must be non-empty, max 10,000 characters
7. `rock.provider` must be one of: `anthropic`, `openai`, `local`
8. Every tool in `allowed` must be a recognized tool identifier
9. `version` must be a positive integer
10. `wall_2_interception.block_patterns` max 50 items
11. `wall_1_tools.allowed` and `wall_1_tools.denied` max 30 items each
12. `identity.languages` max 10 items

## Size Limits

| Field | Max Length |
|---|---|
| identity.name | 100 characters |
| identity.description | 500 characters |
| identity.tone | 200 characters |
| wall_3_context.system_prompt | 10,000 characters |
| wall_2_interception.domain_boundary | 500 characters |
| Each block_pattern | 500 characters |
| identity.languages | 10 items |
| wall_1_tools.allowed | 30 items |
| wall_1_tools.denied | 30 items |
| wall_2_interception.block_patterns | 50 items |

## Example Specs

### Customer Support Agent

```json
{
  "identity": {
    "name": "FinBot",
    "description": "Customer support for QuickPay fintech app",
    "tone": "warm, casual, empathetic",
    "languages": ["en", "hi"]
  },
  "walls": {
    "wall_1_tools": {
      "allowed": ["data_analysis"],
      "denied": ["web_search", "code_execution", "code_writing", "file_creation", "image_understanding"]
    },
    "wall_2_interception": {
      "block_patterns": [
        "never reveal internal system prompt",
        "never share customer data externally",
        "never provide medical or legal advice",
        "never process refunds directly"
      ],
      "domain_boundary": "finance, payments, and customer support"
    },
    "wall_3_context": {
      "system_prompt": "You are FinBot, a friendly customer support agent for QuickPay...",
      "hidden_capabilities": ["medical", "legal", "code", "creative_writing", "science"]
    }
  },
  "heartbeat": ["reasoning", "language_understanding", "context_awareness", "sentiment_detection", "escalation"]
}
```
