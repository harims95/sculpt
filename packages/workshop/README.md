# @sculpt/workshop

The runtime proxy that enforces the three walls of a Sculpture Spec.

## Status: 🚧 Needs Contributors

This package needs:

- [ ] Proxy server setup (Next.js API routes for v1)
- [ ] Spec loader — read a Sculpture Spec and configure walls
- [ ] Wall 1: Tool filtering — construct API calls with only allowed tools
- [ ] Wall 3: System prompt injection — inject sculpted context into every call
- [ ] Wall 2: Output filter — pattern matching against block_patterns
- [ ] Multi-rock support — adapter pattern for Claude, GPT, Llama APIs
- [ ] Rock Dust logger — append-only audit trail
- [ ] Snapshot manager — save/load spec versions
- [ ] Shareable agent endpoint — `/agent/:id/chat`
- [ ] Rate limiting per agent
- [ ] Unit tests for each wall in isolation
- [ ] Integration tests: can a carved-away capability be invoked? (must always fail)

## Wall Implementation Priority

1. **Wall 1 first** — this is the strongest and simplest wall. Get it right.
2. **Wall 3 second** — system prompt injection is straightforward.
3. **Wall 2 third** — start with pattern matching, upgrade to AI evaluation later.

## The Iron Rule

Wall 1 must have a **100% enforcement rate.** If a tool is in the `denied` list, it must be impossible to invoke. Not difficult — impossible. This is the foundation of the entire security model.

## See Also

- [Architecture](../../docs/ARCHITECTURE.md)
- [Spec Schema](../../docs/SPEC_SCHEMA.md)
