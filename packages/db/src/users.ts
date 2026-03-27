import { prisma } from "./client";
import { encrypt, decrypt } from "./crypto";
import type { User, Tier } from "@prisma/client";

export type { User };

export async function upsertUser(clerkId: string, email: string): Promise<User> {
  return prisma.user.upsert({
    where: { clerkId },
    update: { email },
    create: { clerkId, email },
  });
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function saveApiKey(userId: string, plainKey: string): Promise<void> {
  const encrypted = encrypt(plainKey);
  await prisma.user.update({
    where: { id: userId },
    data: { apiKeyEnc: encrypted },
  });
}

export async function getApiKey(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { apiKeyEnc: true },
  });
  if (!user?.apiKeyEnc) return null;
  return decrypt(user.apiKeyEnc);
}

export async function updateTier(userId: string, tier: Tier): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { tier } });
}
