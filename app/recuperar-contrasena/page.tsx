"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";

type RecoveryStep = "email" | "code" | "reset";

const flowSteps = [
  {
    id: "email" as const,
    index: "01",
    title: "Enviaremos un codigo de verificacion a tu correo.",
    description:
      "Ingresa el correo asociado a tu cuenta. Te enviaremos un codigo temporal para confirmar tu identidad antes de permitir el cambio de contrasena.",
  },
  {
    id: "code" as const,
    index: "02",
    title: "Confirma el codigo que enviamos a tu correo.",
    description:
      "Introduce el codigo de 6 digitos para validar la solicitud antes de habilitar el cambio de contrasena.",
  },
  {
    id: "reset" as const,
    index: "03",
    title: "Define una nueva contrasena segura.",
    description:
      "Cuando el codigo sea valido, podras terminar el restablecimiento con una contrasena nueva.",
  },
];

type PasswordRecoveryRequestResponse = {
  email?: string;
  error?: string;
  expiresInMinutes?: number;
};

type PasswordResetResponse = {
  ok?: boolean;
  error?: string;
};

type PasswordRecoveryVerifyResponse = {
  ok?: boolean;
  error?: string;
};

export default function PasswordRecoveryPage() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const palette = prefersDarkMode
    ? {
        pageGlow:
          "radial-gradient(circle at 18% 18%, rgba(55, 213, 255, .18), transparent 30%), radial-gradient(circle at 82% 12%, rgba(98, 168, 255, .2), transparent 28%), linear-gradient(135deg, rgba(7,17,31,.98), rgba(8,32,58,.96))",
        panelGradient:
          "linear-gradient(135deg, rgba(4,24,49,.16), rgba(7,89,201,.14), rgba(55,213,255,.06))",
        badgeBorder: "1px solid rgba(158,208,255,.18)",
        badgeBg: "rgba(8, 23, 40, 0.48)",
        accent: "#9ed0ff",
        muted: "#9fb7d0",
        cardBorder: "rgba(158,208,255,.14)",
        infoBg: "rgba(10, 24, 42, 0.48)",
        surface: "rgba(13, 28, 46, .86)",
        inputBg: "rgba(6, 18, 32, 0.76)",
        foreground: "#eef7ff",
        shadow: "0 24px 80px rgba(0, 0, 0, .4)",
        divider: "1px solid rgba(158,208,255,.1)",
      }
    : {
        pageGlow:
          "radial-gradient(circle at 18% 18%, rgba(7, 89, 201, .14), transparent 30%), radial-gradient(circle at 82% 12%, rgba(55, 213, 255, .18), transparent 28%), linear-gradient(135deg, #f7fbff, #e6f3ff)",
        panelGradient:
          "linear-gradient(135deg, rgba(238,246,255,.22), rgba(7,89,201,.1), rgba(55,213,255,.12))",
        badgeBorder: "1px solid rgba(7,89,201,.14)",
        badgeBg: "rgba(255, 255, 255, 0.56)",
        accent: "#0759c9",
        muted: "#4f6884",
        cardBorder: "rgba(7,89,201,.12)",
        infoBg: "rgba(255, 255, 255, 0.54)",
        surface: "rgba(255,255,255,.9)",
        inputBg: "rgba(255,255,255,.86)",
        foreground: "#0a1c33",
        shadow: "0 24px 80px rgba(7, 89, 201, .16)",
        divider: "1px solid rgba(7,89,201,.08)",
      };

  const activeStep = flowSteps.find((item) => item.id === step) ?? flowSteps[0];

  async function submitRecoveryEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSendingCode(true);
    setRequestError("");
    setInfoMessage("");

    try {
      const response = await fetch("/api/auth/password-recovery/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as PasswordRecoveryRequestResponse;

      if (!response.ok) {
        setRequestError(payload.error ?? "No pudimos enviar el codigo.");
        return;
      }

      setInfoMessage(
        `Enviamos un codigo de 6 digitos a ${payload.email ?? email}. Expira en ${payload.expiresInMinutes ?? 10} minutos.`,
      );
      setIsCodeVerified(false);
      setVerificationCode("");
      setPassword("");
      setConfirmPassword("");
      setStep("code");
    } catch {
      setRequestError("No pudimos enviar el codigo.");
    } finally {
      setIsSendingCode(false);
    }
  }

  async function submitVerificationCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError("");
    setResetSuccessMessage("");

    if (verificationCode.length !== 6) {
      setRequestError("Ingresa un codigo de 6 digitos.");
      return;
    }

    setIsVerifyingCode(true);

    try {
      const response = await fetch("/api/auth/password-recovery/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode,
        }),
      });

      const payload = (await response.json()) as PasswordRecoveryVerifyResponse;

      if (!response.ok) {
        setIsCodeVerified(false);
        setRequestError(payload.error ?? "No pudimos validar el codigo.");
        return;
      }

      setIsCodeVerified(true);
      setStep("reset");
    } catch {
      setIsCodeVerified(false);
      setRequestError("No pudimos validar el codigo.");
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function submitPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCodeVerified) {
      setRequestError("Primero valida el codigo de verificacion.");
      return;
    }

    setIsResettingPassword(true);
    setRequestError("");
    setResetSuccessMessage("");

    try {
      const response = await fetch("/api/auth/password-recovery/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode,
          password,
          confirmPassword,
        }),
      });

      const payload = (await response.json()) as PasswordResetResponse;

      if (!response.ok) {
        setRequestError(payload.error ?? "No pudimos actualizar la contrasena.");
        return;
      }

      setResetSuccessMessage("Tu contrasena fue actualizada correctamente.");
      setPassword("");
      setConfirmPassword("");
      setVerificationCode("");
      setIsCodeVerified(false);
    } catch {
      setRequestError("No pudimos actualizar la contrasena.");
    } finally {
      setIsResettingPassword(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: palette.pageGlow,
        color: palette.foreground,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: palette.panelGradient,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "7%",
          left: "-8%",
          width: "34rem",
          height: "20rem",
          borderRadius: "48% 52% 44% 56%",
          background:
            "radial-gradient(ellipse at 36% 42%, rgba(55,213,255,.9), rgba(7,89,201,.38) 48%, rgba(7,17,31,0) 76%)",
          filter: "blur(20px)",
          opacity: prefersDarkMode ? 0.6 : 0.48,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-10%",
          bottom: "4%",
          width: "32rem",
          height: "26rem",
          borderRadius: "52% 48% 58% 42%",
          background:
            "radial-gradient(ellipse at 52% 48%, rgba(158,208,255,.82), rgba(0,141,180,.34) 50%, rgba(7,17,31,0) 78%)",
          filter: "blur(24px)",
          opacity: prefersDarkMode ? 0.5 : 0.38,
        }}
      />

      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          display: "grid",
          alignItems: "center",
          padding: "32px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "18px",
              paddingRight: "8px",
            }}
          >
            <span
              style={{
                width: "fit-content",
                padding: "10px 16px",
                borderRadius: "999px",
                border: palette.badgeBorder,
                background: palette.badgeBg,
                color: palette.accent,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Recuperacion con verificacion
            </span>

            <div style={{ display: "grid", gap: "12px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(2.8rem, 6vw, 5.4rem)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.05em",
                  maxWidth: "10ch",
                }}
              >
                Recupera el acceso.
              </h1>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${palette.cardBorder}`,
              borderRadius: "28px",
              background: palette.surface,
              backdropFilter: "blur(26px)",
              boxShadow: palette.shadow,
              padding: "28px",
            }}
          >
            <div style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
              <span
                style={{
                  color: palette.accent,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Etapa {activeStep.index}
              </span>
              <h2 style={{ margin: 0, fontSize: "2rem", letterSpacing: "-0.04em" }}>
                {activeStep.title}
              </h2>
              <p style={{ margin: 0, color: palette.muted, lineHeight: 1.65 }}>
                {activeStep.description}
              </p>
            </div>

            {step === "email" ? (
              <form onSubmit={submitRecoveryEmail} style={{ display: "grid", gap: "18px" }}>
                <label style={{ display: "grid", gap: "8px" }}>
                  <span style={{ fontSize: "0.92rem", color: palette.muted }}>Correo electronico</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    style={inputStyle(palette)}
                  />
                </label>

                {requestError ? <StatusMessage message={requestError} /> : null}

                <button type="submit" style={primaryButtonStyle()} disabled={isSendingCode}>
                  {isSendingCode ? "Enviando codigo..." : "Enviar codigo de verificacion"}
                </button>
              </form>
            ) : null}

            {step === "code" ? (
              <form onSubmit={submitVerificationCode} style={{ display: "grid", gap: "18px" }}>
                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: "18px",
                    border: `1px solid ${palette.cardBorder}`,
                    background: palette.infoBg,
                    color: palette.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {infoMessage ||
                    "Hemos enviado un codigo de 6 digitos al correo registrado. Introducelo para continuar con el restablecimiento."}
                </div>

                <label style={{ display: "grid", gap: "8px" }}>
                  <span style={{ fontSize: "0.92rem", color: palette.muted }}>Codigo de verificacion</span>
                  <input
                    type="text"
                    name="verificationCode"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(event) => {
                      setIsCodeVerified(false);
                      setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                    }}
                    style={{
                      ...inputStyle(palette),
                      textAlign: "center",
                      letterSpacing: "0.4em",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                    }}
                  />
                </label>

                {requestError ? <StatusMessage message={requestError} /> : null}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <button type="submit" style={primaryButtonStyle()} disabled={isVerifyingCode}>
                    {isVerifyingCode ? "Validando codigo..." : "Verificar codigo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestError("");
                      setInfoMessage("");
                      setIsCodeVerified(false);
                      setVerificationCode("");
                      setStep("email");
                    }}
                    style={secondaryButtonStyle(palette)}
                  >
                    Reenviar codigo
                  </button>
                </div>
              </form>
            ) : null}

            {step === "reset" ? (
              <form onSubmit={submitPasswordReset} style={{ display: "grid", gap: "18px" }}>
                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: "18px",
                    border: `1px solid ${palette.cardBorder}`,
                    background: palette.infoBg,
                    color: palette.muted,
                    lineHeight: 1.6,
                  }}
                >
                  Codigo validado para <strong style={{ color: palette.foreground }}>{email}</strong>.
                </div>

                <label style={{ display: "grid", gap: "8px" }}>
                  <span style={{ fontSize: "0.92rem", color: palette.muted }}>Nueva contrasena</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Escribe tu nueva contrasena"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    style={inputStyle(palette)}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  <span style={{ fontSize: "0.92rem", color: palette.muted }}>
                    Confirmar nueva contrasena
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Repite la nueva contrasena"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    style={inputStyle(palette)}
                  />
                </label>

                {requestError ? <StatusMessage message={requestError} /> : null}
                {resetSuccessMessage ? (
                  <SuccessMessage message={resetSuccessMessage} />
                ) : null}

                <button type="submit" style={primaryButtonStyle()} disabled={isResettingPassword}>
                  {isResettingPassword ? "Actualizando contrasena..." : "Restablecer contrasena"}
                </button>
              </form>
            ) : null}

            <div
              style={{
                marginTop: "20px",
                paddingTop: "18px",
                borderTop: palette.divider,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "12px",
                color: palette.muted,
                fontSize: "0.92rem",
              }}
            >
              <span>
                {step === "email"
                  ? "El codigo vence en 10 minutos."
                  : step === "code"
                    ? "Solo se aceptan codigos vigentes y no reutilizados."
                    : "Usa una contrasena unica para reforzar la seguridad."}
              </span>
              <Link href="/" style={{ color: palette.accent, fontWeight: 700 }}>
                Volver al acceso
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function inputStyle(palette: {
  cardBorder: string;
  inputBg: string;
  foreground: string;
}) {
  return {
    width: "100%",
    minHeight: "56px",
    borderRadius: "18px",
    border: `1px solid ${palette.cardBorder}`,
    background: palette.inputBg,
    color: palette.foreground,
    padding: "0 18px",
    outline: "none",
    fontSize: "1rem",
  } as const;
}

function primaryButtonStyle() {
  return {
    minHeight: "56px",
    border: 0,
    borderRadius: "18px",
    background: "linear-gradient(135deg, #62a8ff, #37d5ff)",
    color: "#03111d",
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 16px 40px rgba(55, 213, 255, 0.22)",
  } as const;
}

function secondaryButtonStyle(palette: {
  cardBorder: string;
  surface: string;
  foreground: string;
}) {
  return {
    minHeight: "56px",
    borderRadius: "18px",
    border: `1px solid ${palette.cardBorder}`,
    background: palette.surface,
    color: palette.foreground,
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    padding: "0 18px",
  } as const;
}

function StatusMessage({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "16px",
        border: "1px solid rgba(255, 107, 129, 0.28)",
        background: "rgba(93, 18, 30, 0.32)",
        color: "#ffb8c5",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "16px",
        border: "1px solid rgba(143, 247, 192, 0.28)",
        background: "rgba(10, 66, 44, 0.28)",
        color: "#b8f7d7",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}
