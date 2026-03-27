import { prisma } from "./client";
import type { Snapshot } from "@prisma/client";
import type { SculptureSpec } from "@sculpt/spec";

export type { Snapshot };

export async function createSnapshot(
  agentId: string,
  spec: SculptureSpec,
  version: number
): Promise<Snapshot> {
  return prisma.snapshot.create({
    data: { agentId, version, spec: spec as object },
  });
}

export async function getSnapshots(agentId: string): Promise<Snapshot[]> {
  return prisma.snapshot.findMany({
    where: { agentId },
    orderBy: { version: "desc" },
  });
}

export async function getSnapshot(
  agentId: string,
  version: number
): Promise<Snapshot | null> {
  return prisma.snapshot.findFirst({ where: { agentId, version } });
}
