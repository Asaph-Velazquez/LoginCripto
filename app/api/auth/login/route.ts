import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { loginSchema, serializeUser } from "@/server/auth";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 },
      );
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        {
          error: "Debes verificar tu correo antes de iniciar sesión.",
          verificationRequired: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", issues: error.issues },
        { status: 400 },
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
