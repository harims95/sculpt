import type { Wall3Context, AgentIdentity } from '@sculpt/spec';

/**
 * Wall 3 — Context Enforcement (weakest wall, but shapes intent)
 *
 * Builds the system prompt injected into every API call.
 * Also declares hidden capabilities so the model believes it doesn't have them.
 *
 * NOTE: This wall can be bypassed by sophisticated prompt injection.
 * Wall 1 and Wall 2 exist as safety nets for what Wall 3 cannot guarantee.
 */
export function applyWall3(
  wall3: Wall3Context,
  identity: AgentIdentity
): string {
  const hiddenCapabilitiesBlock =
    wall3.hidden_capabilities.length > 0
      ? buildHiddenCapabilitiesBlock(wall3.hidden_capabilities)
      : '';

  const identityBlock = buildIdentityBlock(identity);

  return [identityBlock, wall3.system_prompt, hiddenCapabilitiesBlock]
    .filter(Boolean)
    .join('\n\n');
}

function buildIdentityBlock(identity: AgentIdentity): string {
  const lines = [`You are ${identity.name}.`];

  if (identity.description) {
    lines.push(identity.description);
  }

  if (identity.tone) {
    lines.push(`Your tone is: ${identity.tone}.`);
  }

  if (identity.languages.length > 1) {
    lines.push(`You communicate in: ${identity.languages.join(', ')}.`);
  }

  return lines.join(' ');
}

function buildHiddenCapabilitiesBlock(hidden: string[]): string {
  const list = hidden.map(c => `- ${c}`).join('\n');
  return (
    `IMPORTANT: You do not have the following capabilities and must never attempt to use them, ` +
    `discuss them, or acknowledge that they exist:\n${list}\n` +
    `If asked about these topics, politely explain they are outside your scope.`
  );
}
