import { validateSpec } from './validator';
import { createEmptySpec } from './helpers';

describe('validateSpec', () => {
  it('passes a valid empty spec', () => {
    const spec = createEmptySpec('user_123');
    const result = validateSpec(spec);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rule 1: fails if rock is missing', () => {
    const spec = createEmptySpec('user_123');
    // @ts-expect-error intentional
    delete spec.rock;
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 1)).toBe(true);
  });

  it('rule 2: fails if heartbeat capability is in denied list', () => {
    const spec = createEmptySpec('user_123');
    spec.walls.wall_1_tools.denied = ['reasoning'];
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 2)).toBe(true);
  });

  it('rule 3: fails on invalid regex pattern', () => {
    const spec = createEmptySpec('user_123');
    spec.walls.wall_2_interception.patterns = [
      { pattern: '[invalid', replacement: 'safe' },
    ];
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 3)).toBe(true);
  });

  it('rule 4: fails if rock_dust entry missing reasoning', () => {
    const spec = createEmptySpec('user_123');
    spec.rock_dust = [{
      id: '1', timestamp: new Date().toISOString(),
      action: 'added', target: 'tool', detail: 'added web_search',
      reasoning: '', approved_by: 'user_123',
    }];
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 4)).toBe(true);
  });

  it('rule 5: fails on unsupported provider', () => {
    const spec = createEmptySpec('user_123');
    // @ts-expect-error intentional
    spec.rock.provider = 'unknown_provider';
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 5)).toBe(true);
  });

  it('rule 6: fails if heartbeat is empty', () => {
    const spec = createEmptySpec('user_123');
    spec.heartbeat = [];
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 6)).toBe(true);
  });

  it('rule 7: fails if tool is in both allowed and denied', () => {
    const spec = createEmptySpec('user_123');
    spec.walls.wall_1_tools.allowed = ['web_search'];
    spec.walls.wall_1_tools.denied = ['web_search'];
    const result = validateSpec(spec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 7)).toBe(true);
  });
});
