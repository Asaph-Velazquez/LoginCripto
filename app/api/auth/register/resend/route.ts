import { NextResponse } from "next/server";
import { z } from "zod";

import { EmailDeliveryError, sendEmail } from "@/server/email";
import {
  emailVerificationResendCooldownSeconds,
  emailVerificationTtlMinutes,
  issueEmailVerificationCode,
  parseEmailVerificationResend,
} from "@/server/email-verification";
import {
  createRegistrationVerificationEmailAttachments,
  createRegistrationVerificationEmailHtml,
  createRegistrationVerificationEmailSubject,
} from "@/server/registration-verification-email";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const data = parseEmailVerificationResend(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
      },
    });

    if (!user || user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "No existe una cuenta pendiente de verificación." },
        { status: 404 },
      );
    }

    const issuedCode = await issueEmailVerificationCode(user.id);

    if (!issuedCode.ok) {
      return NextResponse.json(
        {
          error: `Espera ${issuedCode.retryAfterSeconds} segundos antes de reenviar el código.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(issuedCode.retryAfterSeconds) },
        },
      );
    }

    await sendEmail({
      to: user.email,
      subject: createRegistrationVerificationEmailSubject(),
      html: createRegistrationVerificationEmailHtml(issuedCode.code),
      attachments: createRegistrationVerificationEmailAttachments(),
    });

    return NextResponse.json({
      email: user.email,
      expiresInMinutes: emailVerificationTtlMinutes,
      resendCooldownSeconds: emailVerificationResendCooldownSeconds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof EmailDeliveryError) {
      return NextResponse.json(
        { error: "No pudimos enviar el correo de verificación." },
        { status: error.status },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "No pudimos reenviar el código." },
      { status: 500 },
    );
  }
}
