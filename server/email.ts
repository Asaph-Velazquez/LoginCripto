import nodemailer from "nodemailer";

import { config } from "@/server/config";

type EmailAttachment = {
  filename?: string;
  path: string;
  cid?: string;
  contentType?: string;
};

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
};

export class EmailDeliveryError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "EmailDeliveryError";
    this.status = status;
  }
}

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: config.email.smtpSecure,
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPass,
  },
});

export async function sendEmail({ to, subject, html, attachments }: SendEmailInput) {
  if (!config.email.smtpUser) {
    throw new EmailDeliveryError("Missing SMTP_USER.", 500);
  }

  if (!config.email.smtpPass) {
    throw new EmailDeliveryError("Missing SMTP_PASS.", 500);
  }

  if (!config.email.from) {
    throw new EmailDeliveryError("Missing EMAIL_FROM.", 500);
  }

  try {
    await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
      attachments,
    });
  } catch (error) {
    throw new EmailDeliveryError(
      error instanceof Error ? `SMTP email failed: ${error.message}` : "SMTP email failed.",
      500,
    );
  }
}
