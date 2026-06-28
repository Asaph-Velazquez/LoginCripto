import path from "node:path";

import { emailVerificationTtlMinutes } from "@/server/email-verification";

const logoCid = "criptext-logo@email-verification";
const logoPath = path.join(
  process.cwd(),
  "emails",
  "images",
  "criptextLogo.png",
);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createRegistrationVerificationEmailHtml(code: string) {
  const safeCode = escapeHtml(code);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verifica tu correo</title>
</head>
<body style="margin:0;padding:0;background:#07111f;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#eef7ff;">
  <div style="display:none;">Usa este código para verificar tu correo y activar tu cuenta.</div>
  <div style="padding:40px 16px;background:#07111f;">
    <table align="center" cellpadding="0" cellspacing="0" role="none" style="width:100%;max-width:640px;margin:0 auto;">
      <tr>
        <td style="padding-bottom:24px;text-align:center;">
          <img src="cid:${logoCid}" width="250" alt="Login Cripto" style="max-width:100%;vertical-align:middle;">
        </td>
      </tr>
      <tr>
        <td style="padding:40px 36px;border-radius:20px;background:#0d1c2e;box-shadow:0 24px 80px rgba(0,0,0,.38);">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#62a8ff;">Activa tu cuenta</div>
          <h1 style="margin:16px 0;font-size:32px;line-height:1.15;color:#eef7ff;">Confirma que este correo es tuyo</h1>
          <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#9fb7d0;">Ingresa el siguiente código en la pantalla de registro para completar la activación de tu cuenta.</p>
          <div style="padding:28px 24px;border:1px solid #25415f;border-radius:16px;background:#091524;text-align:center;">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.24em;color:#37d5ff;">Código de verificación</div>
            <div style="padding:12px 0 8px;font-size:38px;font-weight:700;letter-spacing:.35em;color:#eef7ff;">${safeCode}</div>
            <div style="font-size:13px;color:#9fb7d0;">Expira en ${emailVerificationTtlMinutes} minutos.</div>
          </div>
          <p style="margin:24px 0 0;font-size:14px;line-height:22px;color:#9fb7d0;">Si no intentaste crear esta cuenta, ignora este correo. No compartas el código con nadie.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

export function createRegistrationVerificationEmailSubject() {
  return "Verifica tu correo para activar tu cuenta";
}

export function createRegistrationVerificationEmailAttachments() {
  return [
    {
      filename: "criptextLogo.png",
      path: logoPath,
      cid: logoCid,
      contentType: "image/png",
    },
  ];
}
