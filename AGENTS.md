# SecureGate — AGENTS.md

# What This Product Is

SecureGate is a standalone authentication and security application built to demonstrate production-grade identity and access management.

This is NOT a full SaaS application.

This project exists to validate:
- authentication architecture
- defensive programming
- session management
- token security
- secure route protection
- production engineering practices

The application should behave like the authentication layer of a real-world SaaS product.

Core promise:

“Secure, production-ready authentication built with defensive engineering principles.”

---

# Core Engineering Philosophy

SecureGate is security-first.

Every implementation decision must prioritize:
1. Security
2. Predictability
3. Maintainability
4. Simplicity
5. Production-readiness

Never prioritize convenience over security.

Assume:
- users make mistakes
- attackers abuse endpoints
- sessions fail
- requests are malformed
- tokens leak
- routes are bypassed

Build defensively at all times.

---

# Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Password Hashing | bcryptjs |
| Email Service | Resend |
| Validation | Zod |
| Rate Limiting | Upstash Redis or custom middleware |
| Hosting | Vercel |
| Styling | Existing Design System Only |

---

# Folder Structure

```txt
securegate/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── (protected)/
│   │   └── dashboard/
│   │
│   ├── verify-email/
│   │   └── [token]/
│   │
│   └── api/
│       ├── auth/
│       ├── verification/
│       ├── password-reset/
│       └── rate-limit/
│
├── components/
│   ├── ui/
│   └── auth/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── mail.ts
│   ├── tokens.ts
│   ├── rate-limit.ts
│   ├── validations.ts
│   └── utils.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tokens/
│   ├── colors.css
│   └── typography.css
│
├── middleware.ts
│
└── types/
    └── index.ts
```

---

# Design System Rules

The existing design system is the ONLY source of truth.

The project already has:
- established typography
- established color tokens
- established visual hierarchy
- established spacing conventions

AI agents must preserve and extend the existing design system only.

---

## Forbidden Styling Changes

DO NOT:
- install Tailwind CSS
- install Chakra UI
- install Material UI
- install Bootstrap
- introduce shadcn/ui
- introduce styled-components
- introduce competing CSS systems
- overwrite typography tokens
- overwrite color tokens
- hardcode arbitrary colors
- hardcode arbitrary font sizes
- create new spacing systems

---

## Styling Rules

Use ONLY:
- the existing typography system
- the existing color tokens
- the existing CSS architecture
- the existing spacing conventions

All new UI must visually match the current product design system.

Consistency is mandatory.

---

## Component Styling Rules

Components must:
- reuse existing design primitives
- inherit existing typography
- inherit existing spacing conventions
- inherit existing interaction patterns

Avoid introducing visually inconsistent UI patterns.

---

## Source of Truth

The following files are the design system source of truth:

```txt
tokens/colors.css
tokens/typography.css
```

These files must not be overridden or replaced.

---

# Source of Truth Rules

## Authentication Logic

`lib/auth.ts`

is the source of truth for:
- session configuration
- NextAuth configuration
- auth callbacks
- authorization logic

---

## Database Access

`lib/prisma.ts`

is the ONLY Prisma client entry point.

Never instantiate multiple Prisma clients.

---

## Token Logic

`lib/tokens.ts`

is the source of truth for:
- verification tokens
- password reset tokens
- token generation
- token expiration
- token invalidation

---

## Email Logic

`lib/mail.ts`

handles:
- verification emails
- reset emails
- email formatting
- email delivery logic

Never duplicate email logic across routes.

---

## Validation Rules

`lib/validations.ts`

or

`schemas/`

must contain:
- Zod schemas
- shared validation rules
- reusable auth validation logic

Never duplicate validation logic across forms and routes.

---

# Database Models

These models are the source of truth for database structure.

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

# Authentication Rules

## Password Storage

NEVER:
- store plain text passwords
- expose password hashes
- log passwords

ALWAYS:
- hash passwords using bcryptjs
- use a minimum salt round value of 12

---

## Login Behaviour

The login flow must:
- validate payloads server-side
- compare hashes securely
- create authenticated sessions safely
- reject invalid credentials safely

---

## Authentication Errors

NEVER reveal:
- whether an email exists
- whether the password was wrong
- whether an account exists

Always return:

```txt
Invalid credentials
```

---

## Session Strategy

Preferred strategy:
- JWT sessions

Reason:
- lightweight
- easier deployment
- fewer DB lookups
- simpler architecture for assessment scope

Session handling must:
- reject invalid sessions
- handle deleted cookies safely
- redirect unauthenticated users properly

---

# Verification Flow Rules

Verification tokens must:
- be cryptographically secure
- expire automatically
- be single-use only
- be deleted after successful verification

Verification links must:
- fail safely when expired
- provide resend verification flow

Unverified users must NEVER access protected routes.

---

# Password Reset Rules

Reset tokens must:
- be cryptographically secure
- expire automatically
- be invalidated after usage
- never be reusable

Password reset flows must NEVER:
- reveal whether an email exists
- expose token details
- allow expired token usage

After successful reset:
- hash new password
- delete used token
- redirect to login

---

# Route Protection Rules

Protected routes:
- `/dashboard`

Middleware must:
- validate authentication state
- validate verification state
- redirect unauthorized users
- prevent redirect loops
- safely handle invalid sessions

Unauthenticated users:
→ redirect to `/login`

Unverified users:
→ redirect to verification flow

---

# Rate Limiting Rules

Sensitive endpoints MUST be rate limited:
- login
- forgot password
- resend verification

Default rule:
- maximum 5 attempts per IP within 10 minutes

Rate limiting failures must:
- fail safely
- return generic messages
- avoid leaking system logic

---

# API Security Rules

All API routes MUST:
- validate payloads using Zod
- sanitize incoming input
- return consistent JSON responses
- use proper HTTP status codes
- avoid leaking stack traces
- fail safely under malformed requests

Never trust client-side validation alone.

All sensitive validation must occur server-side.

---

# Environment Variable Rules

Required variables:

```env
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
RESEND_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

---

# Forbidden Practices

NEVER:
- hardcode secrets
- commit `.env.local`
- expose API keys
- expose secrets in frontend code
- log secrets to console
- expose stack traces publicly

Secrets must exist only:
- in `.env.local`
- or Vercel environment variables

---

# Middleware Rules

`middleware.ts`

must remain:
- lightweight
- security-focused
- predictable

Middleware responsibilities:
- protect routes
- redirect unauthorized users
- reject invalid sessions
- prevent redirect loops

DO NOT:
- place heavy business logic inside middleware
- duplicate auth logic inside routes

---

# Frontend Rules

## Forms

All forms must:
- validate inputs
- include loading states
- prevent duplicate submissions
- display safe validation messages

---

## Password Fields

Password fields must:
- support secure input handling
- include strength indicators
- avoid exposing sensitive values

---

## Error Messaging

Avoid vague errors like:

```txt
Something went wrong
```

Prefer:

```txt
Invalid credentials
```

or:

```txt
This reset link has expired
```

---

# Email Rules

All authentication emails must:
- use secure tokenized URLs
- include expiration messaging
- avoid exposing internal implementation details

Verification and reset emails must:
- use short-lived tokens
- include secure links
- use predictable formatting

---

# Security Headers

The application must include:
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

Add headers in:
- `next.config.js`

---

# Deployment Rules

Deployment target:
- Vercel

Before deployment:
- verify all environment variables
- ensure `.env.local` is ignored
- confirm no secrets exist in GitHub
- test all auth flows end-to-end

---

# Required Manual Tests

Before completion verify:

- signup works
- login works
- logout works
- protected routes work
- email verification works
- password reset works
- expired tokens fail safely
- passwords are hashed
- sessions are protected
- rate limiting works
- no secrets are exposed
- middleware redirects correctly

---

# Code Quality Rules

All code must be:
- modular
- typed
- readable
- maintainable
- production-oriented

Avoid:
- deeply nested logic
- duplicated code
- oversized route handlers
- unnecessary abstractions
- feature creep

---

# Engineering Principles

## Murphy’s Law

Anything that can fail eventually will fail.

Build assuming worst-case scenarios.

---

## YAGNI

Do NOT add:
- OAuth
- social login
- admin dashboards
- analytics
- unrelated features

Keep scope intentionally narrow.

---

## Principle of Least Surprise

Authentication flows should behave consistently and predictably.

---

## Kerckhoffs’s Principle

Security must depend on:
- strong hashing
- secure token handling
- protected secrets

—not hidden implementation details.

---

## Defensive Programming

Validate everything.

Trust nothing.

---

# AI Agent Constraints

AI agents must NOT:
- generate insecure auth logic
- bypass validation
- expose secrets
- weaken security protections
- over-engineer architecture
- add unrelated features
- skip token expiration handling
- introduce new CSS frameworks
- override the existing design system

When uncertain:
- choose the safer implementation
- choose the simpler implementation
- explain tradeoffs clearly

Security always overrides convenience.