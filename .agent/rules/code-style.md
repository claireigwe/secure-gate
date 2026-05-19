---
trigger: always_on
---

# Code Style Rules

These are the code-style rules for SecureGate. They exist so the codebase reads consistently no matter who — or which AI agent — wrote a file.

Consistency matters more than personal preference.

The codebase should feel like it was written by one careful engineering team.

---

# Language

TypeScript everywhere.

Do not introduce JavaScript files inside:
- `app/`
- `components/`
- `lib/`
- `schemas/`
- `types/`

Configuration files are the only exception.

Strict mode must remain enabled.

Never disable:
- `strict`
- `noImplicitAny`
- `strictNullChecks`

to silence errors.

Fix the types properly instead.

---

# Naming

## Components

Components use:
- PascalCase component names
- PascalCase filenames

Example:

```txt
LoginForm.tsx
```

exports:

```ts
LoginForm
```

---

## Hooks

Hooks:
- start with `use`
- live inside `hooks/`
- or beside the component if locally scoped

Example:

```txt
usePasswordStrength.ts
```

---

## Utilities

Utility functions:
- use camelCase
- live in camelCase files

Example:

```txt
generateResetToken.ts
```

---

## Constants

Use:
- `SCREAMING_SNAKE_CASE` for fixed constants
- `camelCase` for normal values

---

## Prisma Models

Prisma models are:
- singular
- PascalCase

Examples:
- `User`
- `VerificationToken`
- `PasswordResetToken`

Database fields remain:
- camelCase

---

## Boolean Variables

Boolean variables should read naturally as yes/no questions.

Good:
```ts
isLoading
hasError
isVerified
canAccessDashboard
```

Bad:
```ts
loading
error
verified
access
```

---

# File Organization

One component per file.

If a helper function is used only inside one component:
- keep it in the same file

If reused elsewhere:
- move it into `lib/`

---

## File Order

Inside component files use this order:

1. Imports
2. Types/interfaces
3. Constants
4. Component
5. Local helper functions

---

## Import Ordering

Imports are grouped in this order:

1. React / Next.js
2. Third-party packages
3. Internal imports (`@/`)

Separate groups using blank lines.

---

# TypeScript Rules

Prefer:
```ts
type
```

over:
```ts
interface
```

unless declaration merging is required.

Keep types close to usage.

Shared types belong in:
```txt
types/
```

or:
```txt
lib/types.ts
```

---

## Forbidden Types

Do NOT use:
```ts
any
```

If shape is unknown:
- use `unknown`
- narrow using guards

If `any` is absolutely unavoidable:
- include a comment explaining why

---

## Validation

All external data must be validated using Zod.

This includes:
- form submissions
- route handler payloads
- query params
- token payloads
- environment variables

Never trust external input.

---

# React Rules

Use:
- function components
- hooks
- server components by default

Do NOT use:
- class components

---

## Client Components

Add:
```ts
'use client'
```

ONLY when the component truly requires:
- browser APIs
- interactivity
- client-side state
- event handlers
- effects

If a component does not use:
- `useState`
- `useEffect`
- browser APIs
- click handlers

it probably should NOT be a client component.

---

## Component Size

Keep components small and focused.

If a component grows beyond ~200 lines:
- split responsibilities
- extract subcomponents
- move logic into hooks/utilities

---

# Authentication Code Rules

Authentication code must remain:
- explicit
- predictable
- defensive

Never hide security-critical logic behind excessive abstraction.

Security logic should be easy to trace during code review.

---

## Password Handling

NEVER:
- store plain text passwords
- log passwords
- expose hashes
- pass passwords unnecessarily between layers

ALWAYS:
- hash using bcryptjs
- use secure salt rounds
- validate passwords server-side

---

## Auth Error Messaging

Always return generic auth errors.

Good:
```txt
Invalid credentials
```

Bad:
```txt
Email not found
Wrong password
```

Never reveal:
- whether an account exists
- whether a password was correct
- whether an email is registered

---

# Formatting

Prettier controls formatting.

Do not manually fight formatting rules.

Formatting rules:
- two-space indentation
- single quotes
- semicolons required
- trailing commas where valid

---

# Comments

Comments explain:
- WHY
- edge cases
- security reasoning
- unexpected behaviour

Comments should NOT explain obvious code.

---

## Good Comment

```ts
// Reset tokens are deleted after use to prevent replay attacks.
```

---

## Bad Comment

```ts
// Increment counter.
```

---

# JSDoc

Use JSDoc for:
- shared utilities
- auth helpers
- token helpers
- rate limiting logic
- validation helpers

Especially document:
- side effects
- security assumptions
- expiration behaviour
- edge cases

---

# Error Handling

Use try/catch around:
- database calls
- token operations
- email delivery
- auth operations
- network requests

Never silently swallow errors.

Bad:
```ts
catch (e) {}
```

Good:
- log securely
- sanitize response
- fail safely

---

## User-Facing Errors

Never expose:
- stack traces
- Prisma errors
- raw exceptions
- internal auth logic

Clients receive:
- sanitized
- safe
- user-friendly messages only

---

# Async Code

Prefer:
```ts
async/await
```

over:
```ts
.then()
```

Do not fire promises without awaiting unless intentionally backgrounded.

If intentionally backgrounded:
- document why

---

# Imports

Use:
```ts
@/
```

alias imports.

Good:
```ts
import { LoginForm } from '@/components/auth/LoginForm';
```

Bad:
```ts
import { LoginForm } from '../../../components/auth/LoginForm';
```

---

# Dependency Direction

Dependencies flow downward only:

```txt
lib
  ↓
components
  ↓
app
```

Do NOT:
- import from `app/` into `components/`
- import from `app/` into `lib/`

---

# Styling Rules

The project uses the existing design system only.

Use:
- existing typography tokens
- existing color tokens
- existing spacing conventions
- existing CSS architecture

---

## Forbidden Styling Systems

DO NOT install:
- Tailwind CSS
- Chakra UI
- Material UI
- Bootstrap
- shadcn/ui
- styled-components

Do not introduce competing design systems.

---

## CSS Rules

Use:
- CSS Modules only

Every component should have:
```txt
ComponentName.module.css
```

co-located with the component.

---

## Design Tokens

Use CSS variables:

```css
var(--token-name)
```

Never hardcode:
- colors
- typography values
- spacing values
- border radii

---

## Design System Source of Truth

```txt
tokens/colors.css
tokens/typography.css
```

These files must not be overridden.

---

# Security Code Rules

Security-sensitive code must prioritize:
- readability
- predictability
- traceability

Avoid:
- clever abstractions
- hidden auth logic
- magic helper chains

Security code should be easy to audit.

---

# Middleware Rules

`middleware.ts`
must remain:
- lightweight
- predictable
- security-focused

Do NOT:
- place heavy business logic inside middleware
- duplicate auth logic

Middleware handles:
- redirects
- auth checks
- verification checks
- route protection

---

# API Rules

All API routes must:
- validate input using Zod
- sanitize payloads
- return structured responses
- use proper status codes
- fail safely

---

## Response Shape

Success:
```json
{
  "ok": true,
  "data": {}
}
```

Failure:
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe message"
  }
}
```

---

# Logging Rules

Do not leave:
```ts
console.log()
```

in committed code.

Use:
```txt
lib/logger.ts
```

when structured logging exists.

Never log:
- passwords
- secrets
- tokens
- auth headers

---

# Dependencies

Do NOT install packages without approval.

Every dependency increases:
- maintenance burden
- bundle size
- security surface area

Prefer platform/native solutions first.

---

# What Not To Do

- Do not add Redux
- Do not add Zustand
- Do not add GraphQL
- Do not add microservices
- Do not add Tailwind CSS
- Do not add component libraries
- Do not disable TypeScript strictness
- Do not bypass validation
- Do not bypass NextAuth.js
- Do not expose secrets
- Do not introduce unnecessary abstractions

Keep the codebase:
- secure
- modular
- predictable
- maintainable
- production-oriented