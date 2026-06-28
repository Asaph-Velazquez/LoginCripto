import { NextResponse } from "next/server";
import { z } from "zod";

import {
  parseEmailVerification,
  verifyAndConsumeEmailVerificationCode,
} from "@/server/email-verification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const data = parseEmailVerification(await request.json());
    const result = await verifyAndConsumeEmailVerificationCode(
      data.email,
      data.verificationCode,
    );

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            result.reason === "expired"
              ? "El código expiró o no existe una verificación activa."
              : "El código de verificación es incorrecto.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", issues: error.issues },
        { status: 400 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "No pudimos verificar el correo." },
      { status: 500 },
    );
  }
}
