import type { RockDustEntry, RockDustAction, RockDustTarget } from '@sculpt/spec';

// In-memory append-only log (v1). V2 writes to PostgreSQL.
const log: RockDustEntry[] = [];

let counter = 0;

export function appendRockDust(
  agentId: string,
  action: RockDustAction,
  target: RockDustTarget,
  detail: string,
  reasoning: string,
  approvedBy: string = 'system'
): RockDustEntry {
  const entry: RockDustEntry = {
    id: `dust_${agentId}_${++counter}`,
    timestamp: new Date().toISOString(),
    action,
    target,
    detail,
    reasoning,
    approved_by: approvedBy,
  };

  log.push(entry);
  return entry;
}

export function getDust(agentId: string): RockDustEntry[] {
  return log.filter(e => e.id.startsWith(`dust_${agentId}_`));
}

export function clearDust(): void {
  log.length = 0;
  counter = 0;
}
