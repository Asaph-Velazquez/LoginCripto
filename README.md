<div align="center">
  <img src="./emails/images/criptextLogo.png" width="280" alt="LoginCripto" />

  # 🔐 LoginCripto

  **Autenticación segura con verificación de correo, recuperación de contraseña y persistencia en PostgreSQL.**

  [![Production](https://img.shields.io/badge/production-online-16a34a?style=for-the-badge&logo=vercel&logoColor=white)](https://logincripto-chi.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.4-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.8-2d3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Clever_Cloud-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

  [🚀 Ver aplicación](https://logincripto-chi.vercel.app) · [🐛 Reportar problema](https://github.com/Asaph-Velazquez/LoginCripto/issues)
</div>

---

## ✨ Funcionalidades

- 🔑 Inicio de sesión con correo y contraseña.
- 📨 Registro con código de verificación de seis dígitos.
- 🔄 Reanudación de cuentas cuyo correo todavía no fue verificado.
- ♻️ Reenvío de códigos con límite de frecuencia.
- 🛡️ Bloqueo de acceso para cuentas pendientes de verificación.
- 🔓 Recuperación de contraseña mediante código temporal.
- 🗄️ Persistencia de usuarios y códigos en PostgreSQL.
- ☁️ API serverless con Next.js Route Handlers y despliegue en Vercel.
- 📱 Interfaz adaptable con temas claro y oscuro.

## 🧭 Flujo de autenticación

```mermaid
flowchart LR
    A["📝 Registro"] --> B["📨 Envío de código"]
    B --> C{"🔍 ¿Código válido?"}
    C -- "Sí" --> D["✅ Correo verificado"]
    C -- "No" --> E["🔄 Reintentar o reenviar"]
    E --> C
    D --> F["🔑 Inicio de sesión"]
    F --> G["🏠 Acceso a la aplicación"]

    classDef action fill:#0759c9,color:#ffffff,stroke:#62a8ff,stroke-width:2px;
    classDef decision fill:#0d1c2e,color:#eef7ff,stroke:#37d5ff,stroke-width:2px;
    classDef success fill:#15803d,color:#ffffff,stroke:#86efac,stroke-width:2px;

    class A,B,E,F action;
    class C decision;
    class D,G success;
```

## 🧱 Stack tecnológico

| Área | Tecnología | Uso |
| --- | --- | --- |
| ⚡ Frontend | Next.js 16 + React 19 | App Router, páginas y componentes |
| 🎨 Interfaz | Material UI + Emotion | Temas, formularios y diseño adaptable |
| 🧩 Lenguaje | TypeScript 5 | Tipado estático |
| 🌐 API | Next.js Route Handlers | Endpoints serverless en Node.js |
| 🗃️ ORM | Prisma 7 | Modelos, cliente y migraciones |
| 🐘 Base de datos | PostgreSQL / Clever Cloud | Usuarios y códigos temporales |
| ✉️ Correo | Nodemailer + SMTP | Verificación y recuperación |
| 🔒 Seguridad | bcryptjs + Zod | Hash de contraseñas y validación |
| 🚀 Hosting | Vercel | Build y despliegue de producción |

## 📁 Estructura

```text
logincripto/
├── app/
│   ├── api/auth/                     # Endpoints de autenticación
│   ├── inicio/                       # Vista posterior al acceso
│   └── recuperar-contrasena/         # Flujo de recuperación
├── components/auth/                  # Experiencia de login y registro
├── emails/                           # Recursos visuales para correo
├── prisma/
│   ├── migrations/                   # Historial de migraciones
│   └── schema.prisma                 # Modelos de datos
├── server/
│   ├── email-verification.ts         # Códigos de registro
│   ├── password-recovery.ts          # Códigos de recuperación
│   ├── prisma.ts                     # Cliente PostgreSQL
│   └── email.ts                      # Transporte SMTP
└── public/                            # Recursos públicos
```

## 🚀 Inicio rápido

### Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Una instancia PostgreSQL.
- Una cuenta SMTP para enviar correos.

### Instalación

```bash
git clone https://github.com/Asaph-Velazquez/LoginCripto.git
cd LoginCripto
npm install
```

Crea el archivo local de variables:

```bash
cp .env.example .env
```

Genera Prisma y aplica las migraciones:

```bash
npm run prisma:generate
npm run prisma:deploy
```

Inicia el entorno de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 🔧 Variables de entorno

Nunca subas el archivo `.env` al repositorio. En Vercel, configura estas variables en **Project → Settings → Environment Variables**.

### Base de datos

La aplicación acepta la URI completa de Clever Cloud:

```env
POSTGRESQL_ADDON_URI="postgresql://usuario:password@host:5432/database"
```

También puede construir la conexión con variables separadas:

```env
POSTGRESQL_ADDON_HOST=""
POSTGRESQL_ADDON_DB=""
POSTGRESQL_ADDON_USER=""
POSTGRESQL_ADDON_PORT="5432"
POSTGRESQL_ADDON_PASSWORD=""
```

Como alternativa genérica:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/database?schema=public"
```

### Correo SMTP

```env
EMAIL_FROM="LoginCripto <correo@dominio.com>"
SMTP_HOST="smtp.example.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER=""
SMTP_PASS=""
```

### Seguridad y recuperación

```env
PASSWORD_SALT_ROUNDS="12"
PASSWORD_RECOVERY_URL="https://tu-dominio.com/recuperar-contrasena"
PASSWORD_RECOVERY_CODE_TTL_MINUTES="10"
PASSWORD_RECOVERY_RESEND_COOLDOWN_SECONDS="60"
```

## 🔌 API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Crea o reanuda un registro pendiente |
| `POST` | `/api/auth/register/verify` | Verifica el correo del nuevo usuario |
| `POST` | `/api/auth/register/resend` | Reenvía el código de registro |
| `POST` | `/api/auth/login` | Valida credenciales y correo verificado |
| `POST` | `/api/auth/password-recovery/request` | Solicita un código de recuperación |
| `POST` | `/api/auth/password-recovery/verify` | Valida el código de recuperación |
| `POST` | `/api/auth/password-recovery/reset` | Actualiza la contraseña |

## 🗄️ Modelo de datos

- **User**: identidad, credenciales cifradas y estado de verificación.
- **EmailVerificationCode**: códigos temporales para activar cuentas.
- **PasswordRecoveryCode**: códigos temporales para recuperar acceso.

Los códigos tienen fecha de expiración, cooldown de reenvío y marca de consumo para impedir reutilización.

## 🧪 Comandos

| Comando | Acción |
| --- | --- |
| `npm run dev` | Inicia Next.js en desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el build local |
| `npm run lint` | Ejecuta ESLint |
| `npm run prisma:generate` | Genera Prisma Client |
| `npm run prisma:migrate` | Crea migraciones en desarrollo |
| `npm run prisma:deploy` | Aplica migraciones pendientes |
| `npm run prisma:studio` | Abre Prisma Studio |

## ☁️ Despliegue

### Vercel

```bash
vercel link
vercel deploy --prod --yes
```

El archivo `.vercelignore` evita subir secretos y artefactos locales.

### Clever Cloud

1. Crea un addon PostgreSQL.
2. Copia las variables `POSTGRESQL_ADDON_*`.
3. Agrégalas al proyecto en Vercel.
4. Ejecuta `npm run prisma:deploy` apuntando a la instancia remota.
5. Redespliega la aplicación.

## 🛡️ Seguridad

- Las contraseñas se almacenan con hash bcrypt.
- Los payloads se validan con Zod.
- Una cuenta no puede iniciar sesión antes de verificar su correo.
- Los códigos expirados o consumidos no pueden reutilizarse.
- Los secretos permanecen fuera de Git mediante `.gitignore` y `.vercelignore`.

---

<div align="center">
  <strong>LoginCripto</strong><br />
  Construido con Next.js, Prisma y PostgreSQL.
</div>
