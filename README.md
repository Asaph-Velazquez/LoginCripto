This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open the URL configured in `NEXT_PUBLIC_APP_URL` in your browser. By default that is [http://localhost:3000](http://localhost:3000).

## Backend API

Create a `.env` file from `.env.example`, then adjust ports and URLs there if needed. The main variables are `APP_PORT`, `API_PORT`, `DB_PORT`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `CORS_ORIGIN`, `PASSWORD_RECOVERY_URL`, and `DATABASE_URL`.

After that, install dependencies and prepare Prisma:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

Run the Express API on the URL configured in `NEXT_PUBLIC_API_URL`. By default that is [http://localhost:4000](http://localhost:4000):

```bash
npm run dev:api
```

Available endpoints:

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/:id`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# LoginCripto

## Despliegue en Vercel (recomendado)

Este repo ya tiene API Routes en `app/api/**` (Next.js Route Handlers) y están marcadas con `export const runtime = "nodejs";`, lo cual es compatible con Prisma en Vercel.

1. Importa el repo en Vercel (Framework: Next.js).
2. Configura variables de entorno (Production + Preview) al menos:
   - `DATABASE_URL` (Postgres)
   - `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
   - `PASSWORD_RECOVERY_URL` (normalmente `https://<tu-dominio>/recuperar-contrasena`)
3. Migraciones: ejecútalas fuera del runtime serverless (por ejemplo, en tu máquina o en un job/CI) usando `prisma migrate deploy` o el flujo que prefieras; el deploy no debería depender de `prisma migrate dev`.

Nota: la lógica de códigos de recuperación de contraseña en `server/password-recovery.ts` usa un `Map` en memoria; en entornos serverless puede perderse entre invocaciones. Para producción conviene persistir esos códigos en la base de datos o en un KV/Redis.
