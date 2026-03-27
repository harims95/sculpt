import type { SculptureSpec } from '@sculpt/spec';
import { validateSpec } from '@sculpt/spec';

// In-memory cache: agentId → spec
const cache = new Map<string, SculptureSpec>();

/**
 * Loads a Sculpture Spec by agent ID.
 * In v1 specs are stored in memory (loaded via loadSpec).
 * V2 will fetch from PostgreSQL with Redis caching.
 */
export function getSpec(agentId: string): SculptureSpec | null {
  return cache.get(agentId) ?? null;
}

/**
 * Stores a spec in the cache after validating it.
 * Throws if the spec is invalid.
 */
export function loadSpec(spec: SculptureSpec): void {
  const result = validateSpec(spec);
  if (!result.valid) {
    const messages = result.errors.map(e => `[Rule ${e.rule}] ${e.field}: ${e.message}`).join(', ');
    throw new Error(`Invalid Sculpture Spec: ${messages}`);
  }
  cache.set(spec.id, spec);
}

export function clearCache(): void {
  cache.clear();
}
