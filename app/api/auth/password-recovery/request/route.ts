import { NextResponse } from "next/server";
import { z } from "zod";

import { EmailDeliveryError, sendEmail } from "@/server/email";
import {
  createPasswordRecoveryEmailAttachments,
  createPasswordRecoveryEmailHtml,
  createPasswordRecoveryEmailSubject,
} from "@/server/password-recovery-email";
import {
  issuePasswordRecoveryCode,
  parsePasswordRecoveryRequest,
  passwordRecoveryResendCooldownSeconds,
  passwordRecoveryTtlMinutes,
} from "@/server/password-recovery";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parsePasswordRecoveryRequest(body);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No encontramos una cuenta con ese correo." },
        { status: 404 },
      );
    }

    const issuedCode = issuePasswordRecoveryCode(user.email);

    if (!issuedCode.ok) {
      return NextResponse.json(
        {
          error: `Espera ${issuedCode.retryAfterSeconds} segundos antes de solicitar otro codigo.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(issuedCode.retryAfterSeconds),
          },
        },
      );
    }

    await sendEmail({
      to: user.email,
      subject: createPasswordRecoveryEmailSubject(),
      html: createPasswordRecoveryEmailHtml(issuedCode.code),
      attachments: createPasswordRecoveryEmailAttachments(),
    });

    return NextResponse.json({
      email: user.email,
      expiresInMinutes: passwordRecoveryTtlMinutes,
      resendCooldownSeconds: passwordRecoveryResendCooldownSeconds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos invalidos.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof EmailDeliveryError) {
      return NextResponse.json(
        {
          error: "No pudimos enviar el correo de verificacion.",
          details:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: error.status },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error: "No pudimos enviar el correo de verificacion.",
        details:
          process.env.NODE_ENV === "production"
            ? undefined
            : error instanceof Error
              ? error.message
              : "Unknown error",
      },
      { status: 500 },
    );
  }
}
