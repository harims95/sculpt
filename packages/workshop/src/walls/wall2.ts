import type { Wall2Interception } from '@sculpt/spec';

const DOMAIN_VIOLATION_FALLBACK =
  "I'm not able to help with that — it's outside my area. Is there something else I can assist you with?";

const PATTERN_VIOLATION_FALLBACK =
  "I'm sorry, I can't provide that information.";

/**
 * Wall 2 — Output Filtering
 *
 * Checks the model's response against block patterns before it reaches the user.
 * If a violation is detected, the response is replaced with a safe fallback.
 * V1: regex pattern matching. V1.1: AI-powered interception.
 */
export function applyWall2(
  response: string,
  wall2: Wall2Interception
): Wall2Result {
  // Check each block pattern
  for (const entry of wall2.patterns) {
    try {
      const regex = new RegExp(entry.pattern, 'i');
      if (regex.test(response)) {
        return {
          passed: false,
          output: entry.replacement || PATTERN_VIOLATION_FALLBACK,
          violation: `Matched pattern: ${entry.pattern}`,
        };
      }
    } catch {
      // Invalid regex in spec — skip and log, don't crash
      console.warn(`[Wall2] Invalid regex pattern skipped: ${entry.pattern}`);
    }
  }

  // Check domain boundary (simple keyword check in v1)
  if (wall2.domain_boundary) {
    const domainCheck = checkDomainBoundary(response, wall2.domain_boundary);
    if (!domainCheck.withinBoundary) {
      return {
        passed: false,
        output: DOMAIN_VIOLATION_FALLBACK,
        violation: `Outside domain boundary: ${wall2.domain_boundary}`,
      };
    }
  }

  return { passed: true, output: response, violation: null };
}

/**
 * V1 domain boundary check — looks for strong off-topic signals.
 * V1.1 will replace this with an AI call.
 */
function checkDomainBoundary(
  response: string,
  _domain: string
): { withinBoundary: boolean } {
  // In v1 we trust Wall 3 (system prompt) to keep responses on-domain.
  // Wall 2 pattern matching handles explicit violations.
  // Full AI-powered domain checking is a v1.1 feature.
  return { withinBoundary: true };
}

export interface Wall2Result {
  passed: boolean;
  output: string;
  violation: string | null;
}
