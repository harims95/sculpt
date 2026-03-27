// ─── Providers ────────────────────────────────────────────────────────────────

export type ModelProvider = 'anthropic' | 'openai' | 'meta' | 'mistral';

// ─── Rock ─────────────────────────────────────────────────────────────────────

export interface Rock {
  provider: ModelProvider;
  model: string;
}

// ─── Walls ────────────────────────────────────────────────────────────────────

export interface Wall1Tools {
  /** Tools passed through to the model API — only these are offered */
  allowed: string[];
  /** Tools explicitly carved away — never included in API calls */
  denied: string[];
}

export interface Wall2Pattern {
  pattern: string;       // regex string
  replacement: string;   // safe fallback text shown to user
}

export interface Wall2Interception {
  patterns: Wall2Pattern[];
  domain_boundary: string;
}

export interface Wall3Context {
  system_prompt: string;
  /** Domains the agent has no awareness of — injected into the system prompt */
  hidden_capabilities: string[];
}

export interface Walls {
  wall_1_tools: Wall1Tools;
  wall_2_interception: Wall2Interception;
  wall_3_context: Wall3Context;
}

// ─── Escalation ───────────────────────────────────────────────────────────────

export interface Escalation {
  enabled: boolean;
  trigger: string;
  fallback: string;
}

// ─── Rock Dust (audit trail) ──────────────────────────────────────────────────

export type RockDustAction = 'added' | 'removed' | 'modified' | 'locked' | 'rolled_back';
export type RockDustTarget = 'tool' | 'pattern' | 'prompt' | 'capability' | 'escalation' | 'identity';

export interface RockDustEntry {
  id: string;
  timestamp: string;         // ISO 8601
  action: RockDustAction;
  target: RockDustTarget;
  detail: string;            // what changed
  reasoning: string;         // why it changed
  approved_by: string;       // sculptor_id or 'system'
}

// ─── Identity ─────────────────────────────────────────────────────────────────

export interface AgentIdentity {
  name: string;
  description: string;
  tone: string;
  languages: string[];
}

// ─── Sculpture Spec ───────────────────────────────────────────────────────────

export interface SculptureSpec {
  id: string;
  version: number;
  created_at: string;        // ISO 8601
  sculptor_id: string;
  rock: Rock;
  identity: AgentIdentity;
  walls: Walls;
  /** Core capabilities that cannot be removed without a full re-sculpt */
  heartbeat: string[];
  escalation: Escalation;
  /** Versioned snapshots for rollback */
  snapshots: SculptureSpec[];
  /** Append-only audit log */
  rock_dust: RockDustEntry[];
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  rule: number;
  field: string;
  message: string;
}
