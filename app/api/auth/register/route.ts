import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  isUniqueConstraintError,
  passwordSaltRounds,
  registerSchema,
} from "@/server/auth";
import { EmailDeliveryError, sendEmail } from "@/server/email";
import {
  emailVerificationResendCooldownSeconds,
  emailVerificationTtlMinutes,
  issueEmailVerificationCode,
} from "@/server/email-verification";
import {
  createRegistrationVerificationEmailAttachments,
  createRegistrationVerificationEmailHtml,
  createRegistrationVerificationEmailSubject,
} from "@/server/registration-verification-email";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

async function sendRegistrationVerificationCode(
  user: { id: string; email: string },
  successStatus: 200 | 201,
) {
  const issuedCode = await issueEmailVerificationCode(user.id);

  if (!issuedCode.ok) {
    return NextResponse.json(
      {
        error: `Espera ${issuedCode.retryAfterSeconds} segundos antes de reenviar el código.`,
        verificationRequired: true,
        email: user.email,
      },
      {
        status: 429,
        headers: { "Retry-After": String(issuedCode.retryAfterSeconds) },
      },
    );
  }

  try {
    await sendEmail({
      to: user.email,
      subject: createRegistrationVerificationEmailSubject(),
      html: createRegistrationVerificationEmailHtml(issuedCode.code),
      attachments: createRegistrationVerificationEmailAttachments(),
    });
  } catch (error) {
    if (error instanceof EmailDeliveryError) {
      return NextResponse.json(
        {
          error:
            "La cuenta está pendiente, pero no pudimos enviar el correo. Intenta reenviar el código.",
          verificationRequired: true,
          email: user.email,
        },
        { status: error.status },
      );
    }

    throw error;
  }

  return NextResponse.json(
    {
      verificationRequired: true,
      email: user.email,
      expiresInMinutes: emailVerificationTtlMinutes,
      resendCooldownSeconds: emailVerificationResendCooldownSeconds,
    },
    { status: successStatus },
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
      },
    });

    if (existingUser) {
      if (existingUser.emailVerifiedAt) {
        return NextResponse.json(
          { error: "El correo ya está registrado." },
          { status: 409 },
        );
      }

      return sendRegistrationVerificationCode(existingUser, 200);
    }

    const passwordHash = await bcrypt.hash(data.password, passwordSaltRounds);
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return sendRegistrationVerificationCode(user, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", issues: error.issues },
        { status: 400 },
      );
    }

    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "El número de celular ya está registrado." },
        { status: 409 },
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
