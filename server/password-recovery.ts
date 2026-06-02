import { randomInt } from "node:crypto";

import { z } from "zod";

import { config } from "@/server/config";
import { prisma } from "@/server/prisma";

const requestPasswordRecoverySchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
});

const verifyPasswordRecoveryCodeSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  verificationCode: z.string().trim().regex(/^\d{6}$/),
});

export const passwordRecoveryCodeLength = 6;
export const passwordRecoveryTtlMinutes = config.auth.passwordRecoveryCodeTtlMinutes;
export const passwordRecoveryResendCooldownSeconds =
  config.auth.passwordRecoveryResendCooldownSeconds;

export function parsePasswordRecoveryRequest(input: unknown) {
  return requestPasswordRecoverySchema.parse(input);
}

export function parsePasswordRecoveryCodeVerification(input: unknown) {
  return verifyPasswordRecoveryCodeSchema.parse(input);
}

export function createPasswordRecoveryCode() {
  const min = 10 ** (passwordRecoveryCodeLength - 1);
  const max = 10 ** passwordRecoveryCodeLength;

  return String(randomInt(min, max));
}

async function getLatestActivePasswordRecoveryRecord(email: string) {
  const now = new Date();

  const record = await prisma.passwordRecoveryCode.findFirst({
    where: {
      email,
      consumedAt: null,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: { requestedAt: "desc" },
    select: {
      id: true,
      email: true,
      code: true,
      requestedAt: true,
      expiresAt: true,
    },
  });

  return record;
}

export async function issuePasswordRecoveryCode(email: string) {
  const nowMs = Date.now();
  const cooldownMs = passwordRecoveryResendCooldownSeconds * 1000;

  const lastRequest = await prisma.passwordRecoveryCode.findFirst({
    where: { email },
    orderBy: { requestedAt: "desc" },
    select: { requestedAt: true },
  });

  if (lastRequest) {
    const requestedAtMs = lastRequest.requestedAt.getTime();

    if (nowMs - requestedAtMs < cooldownMs) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((cooldownMs - (nowMs - requestedAtMs)) / 1000),
      );

      return {
        ok: false as const,
        retryAfterSeconds,
      };
    }
  }

  const code = createPasswordRecoveryCode();
  const expiresAtMs = nowMs + passwordRecoveryTtlMinutes * 60 * 1000;

  await prisma.passwordRecoveryCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(expiresAtMs),
    },
    select: { id: true },
  });

  return {
    ok: true as const,
    code,
    expiresAt: expiresAtMs,
  };
}

export async function verifyPasswordRecoveryCode(email: string, code: string) {
  const record = await getLatestActivePasswordRecoveryRecord(email);

  if (!record) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (record.code !== code) {
    return { ok: false as const, reason: "invalid" as const };
  }

  return { ok: true as const };
}

export async function consumePasswordRecoveryCode(email: string, code: string) {
  const record = await getLatestActivePasswordRecoveryRecord(email);

  if (!record) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (record.code !== code) {
    return { ok: false as const, reason: "invalid" as const };
  }

  await prisma.passwordRecoveryCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
    select: { id: true },
  });

  return { ok: true as const };
}
