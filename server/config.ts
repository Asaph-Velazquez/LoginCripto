function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildUrl(protocol: string, host: string, port: number, path = "") {
  return `${protocol}://${host}:${port}${path}`;
}

const appProtocol = process.env.APP_PROTOCOL ?? "http";
const appHost = process.env.APP_HOST ?? "localhost";
const appPort = readNumber(process.env.APP_PORT, 3000);
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.APP_URL ??
  buildUrl(appProtocol, appHost, appPort);

const apiProtocol = process.env.API_PROTOCOL ?? "http";
const apiHost = process.env.API_HOST ?? "localhost";
const apiPort = readNumber(process.env.API_PORT, 4000);
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  buildUrl(apiProtocol, apiHost, apiPort);

const dbHost = process.env.DB_HOST ?? "localhost";
const dbPort = readNumber(process.env.DB_PORT, 5233);
const dbName = process.env.DB_NAME ?? "logincripto";
const dbSchema = process.env.DB_SCHEMA ?? "public";
const dbUser = process.env.DB_USER ?? "postgres";
const dbPassword = process.env.DB_PASSWORD ?? "postgres";
const cleverDbHost = process.env.POSTGRESQL_ADDON_HOST;
const cleverDbPort = process.env.POSTGRESQL_ADDON_PORT;
const cleverDbName = process.env.POSTGRESQL_ADDON_DB;
const cleverDbUser = process.env.POSTGRESQL_ADDON_USER;
const cleverDbPassword = process.env.POSTGRESQL_ADDON_PASSWORD;
const cleverDatabaseUrl =
  cleverDbHost && cleverDbPort && cleverDbName && cleverDbUser && cleverDbPassword
    ? `postgresql://${encodeURIComponent(cleverDbUser)}:${encodeURIComponent(
        cleverDbPassword,
      )}@${cleverDbHost}:${cleverDbPort}/${cleverDbName}?schema=${dbSchema}&sslmode=require`
    : undefined;
const databaseUrl =
  cleverDatabaseUrl ??
  process.env.POSTGRESQL_ADDON_URI ??
  process.env.DATABASE_URL ??
  `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`;

export const config = {
  app: {
    protocol: appProtocol,
    host: appHost,
    port: appPort,
    url: appUrl,
  },
  api: {
    protocol: apiProtocol,
    host: apiHost,
    port: apiPort,
    url: apiUrl,
    corsOrigin: process.env.CORS_ORIGIN ?? appUrl,
  },
  db: {
    host: dbHost,
    port: dbPort,
    name: dbName,
    schema: dbSchema,
    user: dbUser,
    password: dbPassword,
    url: databaseUrl,
  },
  auth: {
    passwordSaltRounds: readNumber(process.env.PASSWORD_SALT_ROUNDS, 12),
    passwordRecoveryUrl:
      process.env.PASSWORD_RECOVERY_URL ?? `${appUrl}/recuperar-contrasena`,
    passwordRecoveryCodeTtlMinutes: readNumber(
      process.env.PASSWORD_RECOVERY_CODE_TTL_MINUTES,
      10,
    ),
    passwordRecoveryResendCooldownSeconds: readNumber(
      process.env.PASSWORD_RECOVERY_RESEND_COOLDOWN_SECONDS,
      60,
    ),
  },
  email: {
    from: process.env.EMAIL_FROM ?? "",
    smtpHost: process.env.SMTP_HOST ?? "smtp.gmail.com",
    smtpPort: readNumber(process.env.SMTP_PORT, 465),
    smtpSecure: (process.env.SMTP_SECURE ?? "true").toLowerCase() === "true",
    smtpUser: process.env.SMTP_USER ?? "",
    smtpPass: process.env.SMTP_PASS ?? "",
  },
} as const;
