import { prisma } from "./client";
import type { SculptSession } from "@prisma/client";

export type { SculptSession };

export async function createSession(userId: string): Promise<SculptSession> {
  return prisma.sculptSession.create({
    data: { userId },
  });
}

export async function updateSession(
  sessionId: string,
  data: {
    messages?: object[];
    phase?: string;
    draftSpec?: object | null;
  }
): Promise<SculptSession> {
  return prisma.sculptSession.update({
    where: { id: sessionId },
    data: {
      ...(data.messages !== undefined && { messages: data.messages }),
      ...(data.phase !== undefined && { phase: data.phase }),
      ...(data.draftSpec !== undefined && { draftSpec: data.draftSpec ?? undefined }),
    },
  });
}

export async function getSession(sessionId: string): Promise<SculptSession | null> {
  return prisma.sculptSession.findUnique({ where: { id: sessionId } });
}

export async function getLatestSession(userId: string): Promise<SculptSession | null> {
  return prisma.sculptSession.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}
