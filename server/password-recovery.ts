import { randomInt } from "node:crypto";

import { z } from "zod";

import { config } from "@/server/config";

const requestPasswordRecoverySchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
});

const verifyPasswordRecoveryCodeSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  verificationCode: z.string().trim().regex(/^\d{6}$/),
});

type PasswordRecoveryRecord = {
  code: string;
  expiresAt: number;
  requestedAt: number;
};

const passwordRecoveryStore = new Map<string, PasswordRecoveryRecord>();

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

export function issuePasswordRecoveryCode(email: string) {
  const now = Date.now();
  const current = passwordRecoveryStore.get(email);
  const cooldownMs = passwordRecoveryResendCooldownSeconds * 1000;

  if (current && now - current.requestedAt < cooldownMs) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((cooldownMs - (now - current.requestedAt)) / 1000),
    );

    return {
      ok: false as const,
      retryAfterSeconds,
    };
  }

  const code = createPasswordRecoveryCode();
  const expiresAt = now + passwordRecoveryTtlMinutes * 60 * 1000;

  passwordRecoveryStore.set(email, {
    code,
    expiresAt,
    requestedAt: now,
  });

  return {
    ok: true as const,
    code,
    expiresAt,
  };
}

export function getPasswordRecoveryCode(email: string) {
  const record = passwordRecoveryStore.get(email);

  if (!record) {
    return null;
  }

  if (record.expiresAt <= Date.now()) {
    passwordRecoveryStore.delete(email);
    return null;
  }

  return record;
}

export function verifyPasswordRecoveryCode(email: string, code: string) {
  const record = getPasswordRecoveryCode(email);

  if (!record) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (record.code !== code) {
    return { ok: false as const, reason: "invalid" as const };
  }

  return { ok: true as const };
}

export function consumePasswordRecoveryCode(email: string, code: string) {
  const result = verifyPasswordRecoveryCode(email, code);

  if (!result.ok) {
    return result;
  }

  passwordRecoveryStore.delete(email);

  return { ok: true as const };
}
