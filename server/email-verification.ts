import { randomInt } from "node:crypto";

import { z } from "zod";

import { config } from "@/server/config";
import { prisma } from "@/server/prisma";

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(320)
  .transform((value) => value.toLowerCase());

const verifyEmailSchema = z.object({
  email: emailSchema,
  verificationCode: z.string().trim().regex(/^\d{6}$/),
});

const resendEmailVerificationSchema = z.object({
  email: emailSchema,
});

export const emailVerificationTtlMinutes =
  config.auth.passwordRecoveryCodeTtlMinutes;
export const emailVerificationResendCooldownSeconds =
  config.auth.passwordRecoveryResendCooldownSeconds;

export function parseEmailVerification(input: unknown) {
  return verifyEmailSchema.parse(input);
}

export function parseEmailVerificationResend(input: unknown) {
  return resendEmailVerificationSchema.parse(input);
}

function createEmailVerificationCode() {
  return String(randomInt(100000, 1000000));
}

export async function issueEmailVerificationCode(userId: string) {
  const nowMs = Date.now();
  const cooldownMs = emailVerificationResendCooldownSeconds * 1000;
  const lastRequest = await prisma.emailVerificationCode.findFirst({
    where: { userId },
    orderBy: { requestedAt: "desc" },
    select: { requestedAt: true },
  });

  if (lastRequest) {
    const elapsedMs = nowMs - lastRequest.requestedAt.getTime();

    if (elapsedMs < cooldownMs) {
      return {
        ok: false as const,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((cooldownMs - elapsedMs) / 1000),
        ),
      };
    }
  }

  const code = createEmailVerificationCode();
  const expiresAt = new Date(
    nowMs + emailVerificationTtlMinutes * 60 * 1000,
  );

  await prisma.emailVerificationCode.create({
    data: {
      userId,
      code,
      expiresAt,
    },
    select: { id: true },
  });

  return {
    ok: true as const,
    code,
    expiresAt,
  };
}

export async function verifyAndConsumeEmailVerificationCode(
  email: string,
  code: string,
) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (user.emailVerifiedAt) {
    return { ok: true as const, alreadyVerified: true };
  }

  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      userId: user.id,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { requestedAt: "desc" },
    select: {
      id: true,
      code: true,
    },
  });

  if (!record) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (record.code !== code) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const verifiedAt = new Date();

  await prisma.$transaction([
    prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { consumedAt: verifiedAt },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: verifiedAt },
    }),
  ]);

  return { ok: true as const, alreadyVerified: false };
}
