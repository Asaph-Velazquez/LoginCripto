import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/prisma";
import {
  isUniqueConstraintError,
  passwordSaltRounds,
  registerSchema,
  serializeUser,
} from "@/server/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);
    const passwordHash = await bcrypt.hash(data.password, passwordSaltRounds);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        passwordHash,
      },
    });

    return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
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

    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "El correo o celular ya esta registrado." },
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
