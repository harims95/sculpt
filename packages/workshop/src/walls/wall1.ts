import type { Wall1Tools } from '@sculpt/spec';

/**
 * Wall 1 — Tool Filtering (strongest wall)
 *
 * Constructs the tools array for the model API call.
 * Only tools in the allowed list are passed through.
 * Denied tools are never offered to the model — they cannot be invoked
 * because they were never defined in the API call.
 */
export function applyWall1(
  allAvailableTools: ModelTool[],
  wall1: Wall1Tools
): ModelTool[] {
  if (wall1.allowed.length === 0) {
    // No tools allowed — pass nothing
    return [];
  }

  const allowedSet = new Set(wall1.allowed);
  return allAvailableTools.filter(tool => allowedSet.has(tool.name));
}

export interface ModelTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}
