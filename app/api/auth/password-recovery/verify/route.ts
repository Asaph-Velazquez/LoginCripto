import { NextResponse } from "next/server";
import { z } from "zod";

import {
  parsePasswordRecoveryCodeVerification,
  verifyPasswordRecoveryCode,
} from "@/server/password-recovery";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parsePasswordRecoveryCodeVerification(body);
    const verifiedCode = await verifyPasswordRecoveryCode(
      data.email,
      data.verificationCode,
    );

    if (!verifiedCode.ok) {
      return NextResponse.json(
        {
          error:
            verifiedCode.reason === "expired"
              ? "El codigo ya expiro o no existe una solicitud activa."
              : "El codigo de verificacion es incorrecto.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true });
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

    console.error(error);

    return NextResponse.json(
      { error: "No pudimos validar el codigo de verificacion." },
      { status: 500 },
    );
  }
}
