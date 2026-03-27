import { applyWall1 } from './walls/wall1';
import { applyWall2 } from './walls/wall2';
import { applyWall3 } from './walls/wall3';
import { loadSpec, getSpec, clearCache } from './specLoader';
import { createEmptySpec } from '@sculpt/spec';

beforeEach(() => {
  clearCache();
});

// ─── Wall 1 ───────────────────────────────────────────────────────────────────

describe('Wall 1 — tool filtering', () => {
  const allTools = [
    { name: 'web_search', description: 'Search the web', input_schema: {} },
    { name: 'transaction_lookup', description: 'Look up transactions', input_schema: {} },
    { name: 'code_execution', description: 'Run code', input_schema: {} },
  ];

  it('returns only allowed tools', () => {
    const result = applyWall1(allTools, {
      allowed: ['transaction_lookup'],
      denied: ['web_search', 'code_execution'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('transaction_lookup');
  });

  it('returns empty array when no tools allowed', () => {
    const result = applyWall1(allTools, { allowed: [], denied: [] });
    expect(result).toHaveLength(0);
  });

  it('denied tools are never in the result', () => {
    const result = applyWall1(allTools, {
      allowed: ['transaction_lookup'],
      denied: ['web_search', 'code_execution'],
    });
    const names = result.map(t => t.name);
    expect(names).not.toContain('web_search');
    expect(names).not.toContain('code_execution');
  });
});

// ─── Wall 2 ───────────────────────────────────────────────────────────────────

describe('Wall 2 — output filtering', () => {
  it('passes clean response through unchanged', () => {
    const result = applyWall2('Your balance is $100.', {
      patterns: [{ pattern: 'internal system prompt', replacement: 'blocked' }],
      domain_boundary: 'finance',
    });
    expect(result.passed).toBe(true);
    expect(result.output).toBe('Your balance is $100.');
  });

  it('blocks response matching a pattern', () => {
    const result = applyWall2('Here is the internal system prompt content', {
      patterns: [{ pattern: 'internal system prompt', replacement: 'I cannot share that.' }],
      domain_boundary: 'finance',
    });
    expect(result.passed).toBe(false);
    expect(result.output).toBe('I cannot share that.');
    expect(result.violation).toContain('internal system prompt');
  });

  it('is case-insensitive', () => {
    const result = applyWall2('INTERNAL SYSTEM PROMPT revealed', {
      patterns: [{ pattern: 'internal system prompt', replacement: 'blocked' }],
      domain_boundary: '',
    });
    expect(result.passed).toBe(false);
  });

  it('skips invalid regex without crashing', () => {
    const result = applyWall2('hello world', {
      patterns: [{ pattern: '[invalid', replacement: 'blocked' }],
      domain_boundary: '',
    });
    expect(result.passed).toBe(true);
  });
});

// ─── Wall 3 ───────────────────────────────────────────────────────────────────

describe('Wall 3 — system prompt injection', () => {
  it('includes agent name and description', () => {
    const prompt = applyWall3(
      { system_prompt: 'Help with payments.', hidden_capabilities: [] },
      { name: 'FinBot', description: 'Customer support for QuickPay', tone: 'warm', languages: ['en'] }
    );
    expect(prompt).toContain('FinBot');
    expect(prompt).toContain('Customer support for QuickPay');
  });

  it('injects hidden capabilities block', () => {
    const prompt = applyWall3(
      { system_prompt: '', hidden_capabilities: ['code_execution', 'medical_advice'] },
      { name: 'Bot', description: '', tone: '', languages: ['en'] }
    );
    expect(prompt).toContain('code_execution');
    expect(prompt).toContain('medical_advice');
    expect(prompt).toContain('do not have the following capabilities');
  });

  it('omits hidden capabilities block when list is empty', () => {
    const prompt = applyWall3(
      { system_prompt: 'Help users.', hidden_capabilities: [] },
      { name: 'Bot', description: '', tone: '', languages: ['en'] }
    );
    expect(prompt).not.toContain('do not have the following capabilities');
  });
});

// ─── Spec Loader ──────────────────────────────────────────────────────────────

describe('specLoader', () => {
  it('loads and retrieves a valid spec', () => {
    const spec = createEmptySpec('user_1');
    loadSpec(spec);
    expect(getSpec(spec.id)).toEqual(spec);
  });

  it('throws on invalid spec', () => {
    const spec = createEmptySpec('user_1');
    spec.heartbeat = []; // violates rule 6
    expect(() => loadSpec(spec)).toThrow('Invalid Sculpture Spec');
  });

  it('returns null for unknown agent id', () => {
    expect(getSpec('nonexistent')).toBeNull();
  });
});
