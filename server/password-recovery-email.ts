import path from "node:path";

import { passwordRecoveryTtlMinutes } from "@/server/password-recovery";

const passwordRecoveryLogoCid = "criptext-logo@logincripto";
const passwordRecoveryLogoPath = path.join(
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

export function createPasswordRecoveryEmailHtml(code: string) {
  const safeCode = escapeHtml(code);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <title>Recuperación de contraseña</title>
</head>
<body style="margin:0;width:100%;padding:0;background-color:#07111f;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;word-break:break-word;color:#eef7ff;">
  <div style="display:none;">Usa este código de 6 dígitos para recuperar tu contraseña.</div>
  <div role="article" aria-roledescription="email" aria-label="Recuperación de contraseña" lang="es" style="background-color:#07111f;padding:40px 16px;">
    <table align="center" style="margin:0 auto;width:100%;max-width:640px;" cellpadding="0" cellspacing="0" role="none">
      <tr>
        <td>
          <table style="width:100%;" cellpadding="0" cellspacing="0" role="none">
            <tr>
              <td style="padding-bottom:24px;text-align:center;">
                <img src="cid:${passwordRecoveryLogoCid}" width="250" alt="Login Cripto" style="max-width:100%;vertical-align:middle;margin-left:auto;margin-right:auto;">
              </td>
            </tr>
          </table>
          <table style="width:100%;border-radius:20px;background:linear-gradient(180deg,#10253d 0%,#0d1c2e 100%);background-color:#0d1c2e;box-shadow:0 24px 80px rgba(0,0,0,.38);" cellpadding="0" cellspacing="0" role="none">
            <tr>
              <td style="padding:40px 36px;">
                <table style="width:100%;" cellpadding="0" cellspacing="0" role="none">
                  <tr>
                    <td style="padding-bottom:24px;">
                      <span style="display:inline-block;border-radius:9999px;border:1px solid #25415f;background-color:#0d1c2e;padding:8px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.22em;color:#62a8ff;">Seguridad de acceso</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:16px;font-size:32px;font-weight:700;line-height:1.1;color:#eef7ff;">
                      Recupera tu contraseña con un código de verificación
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:24px;font-size:16px;line-height:26px;color:#9fb7d0;">
                      Recibimos una solicitud para restablecer la contraseña de tu cuenta. Ingresa este código de 6 dígitos en la pantalla de recuperación para continuar.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:32px;">
                      <table style="width:100%;border-radius:16px;border:1px solid #25415f;background-color:#091524;" cellpadding="0" cellspacing="0" role="none">
                        <tr>
                          <td style="padding:28px 24px;text-align:center;">
                            <div style="padding-bottom:12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.28em;color:#37d5ff;">Código de verificación</div>
                            <div style="font-size:38px;font-weight:700;letter-spacing:.42em;color:#eef7ff;">${safeCode}</div>
                            <div style="padding-top:12px;font-size:13px;line-height:20px;color:#9fb7d0;">Este código expira en ${passwordRecoveryTtlMinutes} minutos.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:16px;font-size:14px;line-height:22px;color:#9fb7d0;">
                      Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida mientras no completes el proceso.
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:14px;line-height:22px;color:#9fb7d0;">
                      Por seguridad, no compartas este código con nadie y evita reenviar este mensaje.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table style="width:100%;" cellpadding="0" cellspacing="0" role="none">
            <tr>
              <td style="padding:24px 12px;text-align:center;font-size:12px;line-height:20px;color:#9fb7d0;">
                Este correo fue enviado para proteger el acceso a tu cuenta.
                <br>
                &copy; ${new Date().getFullYear()} Login Cripto. Todos los derechos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

export function createPasswordRecoveryEmailSubject() {
  return "Código de verificación para recuperar tu contraseña";
}

export function createPasswordRecoveryEmailAttachments() {
  return [
    {
      filename: "criptextLogo.png",
      path: passwordRecoveryLogoPath,
      cid: passwordRecoveryLogoCid,
      contentType: "image/png",
    },
  ];
}
