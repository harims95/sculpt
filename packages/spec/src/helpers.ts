import type { SculptureSpec } from './types';

/** Returns a blank valid Sculpture Spec with sensible defaults */
export function createEmptySpec(sculptorId: string): SculptureSpec {
  return {
    id: `sculpt_${Date.now()}`,
    version: 1,
    created_at: new Date().toISOString(),
    sculptor_id: sculptorId,
    rock: {
      provider: 'anthropic',
      model: 'claude-sonnet-4-6',
    },
    identity: {
      name: '',
      description: '',
      tone: '',
      languages: ['en'],
    },
    walls: {
      wall_1_tools: {
        allowed: [],
        denied: [],
      },
      wall_2_interception: {
        patterns: [],
        domain_boundary: '',
      },
      wall_3_context: {
        system_prompt: '',
        hidden_capabilities: [],
      },
    },
    heartbeat: ['reasoning', 'language_understanding', 'context_awareness'],
    escalation: {
      enabled: false,
      trigger: '',
      fallback: '',
    },
    snapshots: [],
    rock_dust: [],
  };
}

/**
 * Returns a list of fields that differ between two spec versions.
 * Used to generate rock_dust entries when a spec changes.
 */
export function diffSpecs(
  prev: SculptureSpec,
  next: SculptureSpec
): Array<{ field: string; from: unknown; to: unknown }> {
  const diffs: Array<{ field: string; from: unknown; to: unknown }> = [];

  const compare = (a: unknown, b: unknown, path: string) => {
    if (typeof a !== typeof b || JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push({ field: path, from: a, to: b });
    }
  };

  compare(prev.rock.provider, next.rock.provider, 'rock.provider');
  compare(prev.rock.model, next.rock.model, 'rock.model');
  compare(prev.identity, next.identity, 'identity');
  compare(prev.walls.wall_1_tools, next.walls.wall_1_tools, 'walls.wall_1_tools');
  compare(prev.walls.wall_2_interception, next.walls.wall_2_interception, 'walls.wall_2_interception');
  compare(prev.walls.wall_3_context.system_prompt, next.walls.wall_3_context.system_prompt, 'walls.wall_3_context.system_prompt');
  compare(prev.walls.wall_3_context.hidden_capabilities, next.walls.wall_3_context.hidden_capabilities, 'walls.wall_3_context.hidden_capabilities');
  compare(prev.heartbeat, next.heartbeat, 'heartbeat');
  compare(prev.escalation, next.escalation, 'escalation');

  return diffs;
}
