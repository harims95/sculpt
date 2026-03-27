import type { SculptureSpec, ValidationResult, ValidationError } from './types';

const SUPPORTED_PROVIDERS = ['anthropic', 'openai', 'meta', 'mistral'];

/**
 * Validates a Sculpture Spec against all 7 rules.
 *
 * Rule 1: Must have exactly one Rock (provider + model)
 * Rule 2: Wall 1 denied list cannot include heartbeat capabilities
 * Rule 3: Wall 2 patterns must be valid regex
 * Rule 4: Every rock_dust entry must have reasoning and approved_by
 * Rule 5: Model provider must be supported
 * Rule 6: Heartbeat capabilities cannot be empty
 * Rule 7: Wall 1 allowed and denied lists must not overlap
 */
export function validateSpec(spec: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!spec || typeof spec !== 'object') {
    return {
      valid: false,
      errors: [{ rule: 0, field: 'spec', message: 'Spec must be a non-null object' }],
    };
  }

  const s = spec as SculptureSpec;

  // Rule 1: Must have exactly one Rock with provider and model
  if (!s.rock) {
    errors.push({ rule: 1, field: 'rock', message: 'Spec must have a rock definition' });
  } else {
    if (!s.rock.provider) {
      errors.push({ rule: 1, field: 'rock.provider', message: 'Rock must have a provider' });
    }
    if (!s.rock.model) {
      errors.push({ rule: 1, field: 'rock.model', message: 'Rock must have a model' });
    }
  }

  // Rule 5: Provider must be supported (checked alongside rule 1)
  if (s.rock?.provider && !SUPPORTED_PROVIDERS.includes(s.rock.provider)) {
    errors.push({
      rule: 5,
      field: 'rock.provider',
      message: `Unsupported provider "${s.rock.provider}". Must be one of: ${SUPPORTED_PROVIDERS.join(', ')}`,
    });
  }

  // Rule 6: Heartbeat cannot be empty
  if (!s.heartbeat || s.heartbeat.length === 0) {
    errors.push({
      rule: 6,
      field: 'heartbeat',
      message: 'Heartbeat capabilities cannot be empty',
    });
  }

  // Rule 2: Wall 1 denied list cannot include heartbeat capabilities
  if (s.heartbeat && s.walls?.wall_1_tools?.denied) {
    const heartbeatSet = new Set(s.heartbeat);
    for (const denied of s.walls.wall_1_tools.denied) {
      if (heartbeatSet.has(denied)) {
        errors.push({
          rule: 2,
          field: 'walls.wall_1_tools.denied',
          message: `Heartbeat capability "${denied}" cannot be in the denied list`,
        });
      }
    }
  }

  // Rule 3: Wall 2 patterns must be valid regex
  if (s.walls?.wall_2_interception?.patterns) {
    for (let i = 0; i < s.walls.wall_2_interception.patterns.length; i++) {
      const entry = s.walls.wall_2_interception.patterns[i];
      try {
        new RegExp(entry.pattern);
      } catch {
        errors.push({
          rule: 3,
          field: `walls.wall_2_interception.patterns[${i}].pattern`,
          message: `Invalid regex pattern: "${entry.pattern}"`,
        });
      }
    }
  }

  // Rule 4: Every rock_dust entry must have reasoning and approved_by
  if (s.rock_dust) {
    for (let i = 0; i < s.rock_dust.length; i++) {
      const entry = s.rock_dust[i];
      if (!entry.reasoning) {
        errors.push({
          rule: 4,
          field: `rock_dust[${i}].reasoning`,
          message: `Rock dust entry ${i} is missing reasoning`,
        });
      }
      if (!entry.approved_by) {
        errors.push({
          rule: 4,
          field: `rock_dust[${i}].approved_by`,
          message: `Rock dust entry ${i} is missing approved_by`,
        });
      }
    }
  }

  // Rule 7: Wall 1 allowed and denied must not overlap
  if (s.walls?.wall_1_tools) {
    const allowed = new Set(s.walls.wall_1_tools.allowed ?? []);
    const denied = s.walls.wall_1_tools.denied ?? [];
    for (const tool of denied) {
      if (allowed.has(tool)) {
        errors.push({
          rule: 7,
          field: 'walls.wall_1_tools',
          message: `Tool "${tool}" cannot be in both allowed and denied lists`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
