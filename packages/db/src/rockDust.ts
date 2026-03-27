import { prisma } from "./client";
import type { RockDust } from "@prisma/client";

export type { RockDust };

export async function appendRockDust(params: {
  agentId: string;
  action: string;
  target: string;
  detail: string;
  reasoning: string;
  approvedBy: string;
}): Promise<RockDust> {
  return prisma.rockDust.create({ data: params });
}

export async function getDustByAgent(agentId: string): Promise<RockDust[]> {
  return prisma.rockDust.findMany({
    where: { agentId },
    orderBy: { createdAt: "asc" },
  });
}
