import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { passwordResetSchema, passwordSaltRounds } from "@/server/auth";
import { consumePasswordRecoveryCode } from "@/server/password-recovery";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = passwordResetSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No encontramos una cuenta con ese correo." },
        { status: 404 },
      );
    }

    const consumedCode = await consumePasswordRecoveryCode(
      data.email,
      data.verificationCode,
    );

    if (!consumedCode.ok) {
      return NextResponse.json(
        {
          error:
            consumedCode.reason === "expired"
              ? "El codigo ya expiro o no existe una solicitud activa."
              : "El codigo de verificacion es incorrecto.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(data.password, passwordSaltRounds);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

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
      { error: "No pudimos actualizar la contrasena." },
      { status: 500 },
    );
  }
}
