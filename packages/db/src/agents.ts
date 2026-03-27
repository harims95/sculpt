import { prisma } from "./client";
import type { Agent, AgentStatus } from "@prisma/client";
import type { SculptureSpec } from "@sculpt/spec";

export type { Agent };

export async function createAgent(
  userId: string,
  spec: SculptureSpec
): Promise<Agent> {
  return prisma.agent.create({
    data: {
      id: spec.id,
      userId,
      name: spec.identity.name,
      description: spec.identity.description,
      spec: spec as object,
    },
  });
}

export async function getAgent(agentId: string): Promise<Agent | null> {
  return prisma.agent.findUnique({ where: { id: agentId } });
}

export async function getAgentsByUser(userId: string): Promise<Agent[]> {
  return prisma.agent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateAgentSpec(
  agentId: string,
  spec: SculptureSpec
): Promise<Agent> {
  return prisma.agent.update({
    where: { id: agentId },
    data: {
      name: spec.identity.name,
      description: spec.identity.description,
      spec: spec as object,
    },
  });
}

export async function updateAgentStatus(
  agentId: string,
  status: AgentStatus
): Promise<void> {
  await prisma.agent.update({ where: { id: agentId }, data: { status } });
}

export function getSpecFromAgent(agent: Agent): SculptureSpec {
  return agent.spec as unknown as SculptureSpec;
}
