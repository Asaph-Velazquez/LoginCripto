import { z } from "zod";

import { config } from "@/server/config";
import type { User } from "@/server/generated/prisma/client";

export const passwordSaltRounds = config.auth.passwordSaltRounds;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    name: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(320),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\+?[1-9][0-9]{7,14}$/)
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[1-9][0-9]{7,14}$/)
      .optional(),
    password: z.string().min(8).max(128),
  })
  .transform((data, ctx) => {
    const firstName = data.firstName ?? data.name;
    const phoneNumber = data.phoneNumber ?? data.phone;

    if (!firstName) {
      ctx.addIssue({
        code: "custom",
        message: "El nombre es requerido.",
        path: ["firstName"],
      });
    }

    if (!phoneNumber) {
      ctx.addIssue({
        code: "custom",
        message: "El numero de celular es requerido.",
        path: ["phoneNumber"],
      });
    }

    return {
      firstName: firstName ?? "",
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phoneNumber: phoneNumber ?? "",
      password: data.password,
    };
  });

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
});

export function serializeUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    emailVerifiedAt: user.emailVerifiedAt,
    phoneVerifiedAt: user.phoneVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
