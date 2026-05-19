---
trigger: always_on
---

# Architecture Rules

These rules describe how SecureGate is structured internally. Every agent building features must follow this architecture exactly. Do not introduce new patterns, frameworks, or architectural decisions without approval first.

---

# The Stack

SecureGate is a Next.js 14 application using the App Router, written in TypeScript (strict mode), backed by PostgreSQL through Prisma.

Authentication is handled through NextAuth.js using the Credentials Provider.

Passwords are hashed using bcryptjs.

Emails are sent using Resend.

Validation uses Zod.

Rate limiting uses Upstash Redis or a lightweight custom middleware solution.

There is NO separate backend service.

Everything lives inside the Next.js application using:
- server components
- server actions
- route handlers
- middleware

The project is intentionally small in scope and security-focused.

Do not introduce unnecessary architectural complexity.

---

# Directory Layout

```txt
app/
├── (auth)/
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   └── reset-password/
│
├── (protected)/
│   └── dashboard/
│
├── verify-email/
│   └── [token]/
│
└── api/
    ├── auth/
    ├── verification/
    ├── password-reset/
    └── rate-limit/

components/
├── ui/                          ← primitive reusable components
└── auth/                        ← authentication-specific UI

lib/
├── prisma.ts                    ← Prisma client singleton
├── auth.ts                      ← NextAuth config
├── mail.ts                      ← Resend email logic
├── tokens.ts                    ← verification/reset token utilities
├── rate-limit.ts                ← rate limiting logic
├── validations.ts               ← shared zod validation schemas
└── utils.ts                     ← shared helpers

prisma/
├── schema.prisma                ← single source of truth for DB
└── migrations/                  ← generated migration files

tokens/
├── colors.css                   ← DO NOT modify directly
└── typography.css               ← DO NOT modify directly

types/
└── index.ts                     ← shared TypeScript types

public/                          ← static assets

middleware.ts                    ← route protection middleware
```

---

# Rendering Rules

Authentication pages may use client components for interactivity, but authentication state and protected data must always be validated on the server.

Protected dashboard pages should use server-side authentication checks before rendering sensitive content.

Do not rely solely on client-side route protection.

The dashboard must never render protected content before authentication verification completes.

---

# Styling Rules

The project uses the existing design system only.

All styling must follow:
- the existing typography system
- the existing color tokens
- the existing spacing conventions
- the existing component patterns

---

## Styling Architecture

Use ONLY the existing CSS architecture.

DO NOT:
- install Tailwind CSS
- install Bootstrap
- install Chakra UI
- install Material UI
- install shadcn/ui
- install styled-components
- introduce competing styling systems

---

## Design Tokens

The following files are the design system source of truth:

```txt
tokens/colors.css
tokens/typography.css
```

Use:
```css
var(--token-name)
```

Never:
- hardcode colors
- hardcode typography values
- override token systems
- introduce inconsistent spacing patterns

---

# Data Flow

There are four kinds of writes in SecureGate:

---

## 1. User Authentication Writes

Signup, login, logout, and password reset actions happen through:
- server actions
- secure route handlers

Authentication payloads are validated with Zod before database interaction.

Passwords are hashed before persistence.

---

## 2. Verification Token Writes

Verification token generation occurs during signup.

Flow:
1. User account created
2. Verification token generated
3. Token stored in database
4. Verification email sent
5. Token invalidated after successful usage

Verification state is enforced through middleware and session validation.

---

## 3. Password Reset Writes

Password reset flow:
1. User requests password reset
2. Secure reset token generated
3. Token stored with expiration
4. Email sent using Resend
5. Password updated after validation
6. Token invalidated after successful usage

The reset flow must NEVER reveal whether an email exists.

---

## 4. Session Writes

Sessions are managed through NextAuth.js.

Session lifecycle includes:
- secure login
- protected session creation
- session validation
- logout invalidation
- expired session rejection

Sessions are trusted only after server validation.

---

# State Management

There is NO global state library.

Do NOT install:
- Redux
- Zustand
- MobX
- Jotai
- Recoil

React state and server-side data are sufficient.

Authentication state should primarily live on the server.

Client components receive auth-safe data from parent server components.

---

# Database Access

All database access goes through Prisma.

The Prisma client is imported ONLY from:

```txt
lib/prisma.ts
```

Never instantiate:
```ts
new PrismaClient()
```

outside the singleton file.

Creating multiple Prisma clients causes connection pool exhaustion during development.

---

# Database Models

## User

```prisma
id              String    @id @default(cuid())
name            String
email           String    @unique
password        String
emailVerified   Boolean   @default(false)
createdAt       DateTime  @default(now())
```

---

## VerificationToken

```prisma
identifier      String
token           String    @unique
expires         DateTime
```

---

## PasswordResetToken

```prisma
email           String
token           String    @unique
expires         DateTime
```

---

# Authentication Architecture

Authentication is handled by NextAuth.js.

Configuration lives in:

```txt
lib/auth.ts
```

The application uses:
- Credentials Provider
- JWT session strategy

Reason:
- lightweight architecture
- simpler deployment
- fewer DB lookups
- appropriate for assessment scope

---

## Session Rules

Sessions must:
- use secure cookies
- reject invalid tokens
- reject expired sessions
- redirect unauthorized users safely

Cookies must be:
- httpOnly
- secure in production
- sameSite=lax

---

# Middleware Architecture

All protected routes are secured through:
```txt
middleware.ts
```

Middleware responsibilities:
- validate authentication state
- validate verification state
- redirect unauthorized users
- prevent redirect loops
- safely handle invalid sessions

Middleware should remain:
- lightweight
- security-focused
- predictable

Do NOT place heavy business logic inside middleware.

---

# API Architecture

API routes exist under:
```txt
app/api/
```

Authentication-sensitive endpoints include:
- login
- signup
- forgot-password
- reset-password
- resend-verification

---

## API Rules

All API routes must:
- validate payloads using Zod
- sanitize input
- return consistent JSON structures
- use proper HTTP status codes
- avoid leaking internal errors
- fail safely under malformed input

---

## Response Format

Successful responses:

```json
{
  "ok": true,
  "data": {}
}
```

Failure responses:

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe user-facing message"
  }
}
```

Never expose:
- stack traces
- Prisma errors
- raw exceptions
- internal auth logic

---

# Rate Limiting Architecture

Rate limiting protects:
- login endpoint
- forgot password endpoint
- verification resend endpoint

Default policy:
- maximum 5 requests per IP within 10 minutes

Rate limiting logic lives in:
```txt
lib/rate-limit.ts
```

The system should:
- fail safely
- return generic messages
- avoid leaking security details

---

# Token Architecture

Token utilities live in:
```txt
lib/tokens.ts
```

Verification and reset tokens must:
- be cryptographically secure
- expire automatically
- be single-use only
- be invalidated after usage

Never:
- reuse tokens
- expose token values publicly
- trust expired tokens

---

# Email Architecture

All email logic lives in:
```txt
lib/mail.ts
```

Emails supported:
- verification emails
- password reset emails

Emails must:
- use secure tokenized URLs
- include expiration messaging
- avoid exposing implementation details

Never duplicate email logic across routes.

---

# Error Handling

Server actions and route handlers return structured responses.

Clients must NEVER receive:
- raw exceptions
- Prisma errors
- stack traces
- sensitive auth details

Always:
- log detailed errors server-side
- return sanitized messages client-side

---

# Environments

## Development
- local PostgreSQL database
- local environment variables
- Resend development setup

---

## Production
- Vercel deployment
- production environment variables
- secure HTTPS-only cookies
- production database

---

# Security Rules

The system must:
- hash passwords using bcryptjs
- validate all inputs server-side
- sanitize incoming payloads
- protect secrets using env vars
- implement token expiration
- prevent auth enumeration attacks
- rate limit sensitive endpoints

---

## Forbidden Security Practices

NEVER:
- store plain text passwords
- hardcode secrets
- expose API keys
- reveal whether emails exist
- expose sensitive errors publicly

---

# What Not To Do

- Do not add OAuth providers
- Do not add social login
- Do not add admin dashboards
- Do not add analytics systems
- Do not add a separate backend
- Do not add GraphQL
- Do not add microservices
- Do not install Tailwind CSS
- Do not override design tokens
- Do not build a custom auth system
- Do not bypass NextAuth.js
- Do not introduce unnecessary abstractions

Keep the architecture intentionally small, secure, and maintainable.