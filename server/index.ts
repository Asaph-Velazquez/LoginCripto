import bcrypt from "bcryptjs";
import cors from "cors";
import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { prisma } from "./prisma";

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const passwordSaltRounds = Number(process.env.PASSWORD_SALT_ROUNDS ?? 12);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

const registerSchema = z
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

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
});

function serializeUser(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
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

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "logincripto-api" });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
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

    res.status(201).json({ user: serializeUser(user) });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      res.status(409).json({ error: "El correo o celular ya esta registrado." });
      return;
    }

    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({ error: "Credenciales invalidas." });
      return;
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatches) {
      res.status(401).json({ error: "Credenciales invalidas." });
      return;
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;

  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: "Datos invalidos.",
      issues: error.issues,
    });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Error interno del servidor." });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
