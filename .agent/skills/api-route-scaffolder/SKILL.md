# Skill: API Route Scaffolder

# Purpose

This skill exists to standardize how API routes and server actions are created inside SecureGate.

Authentication systems become insecure when:
- validation is inconsistent
- responses vary between endpoints
- token handling differs across routes
- middleware assumptions drift
- security protections are skipped

This skill ensures every route:
- follows the SecureGate architecture
- uses defensive programming
- matches the assessment expectations
- remains production-safe

Use this skill whenever creating:
- route handlers
- auth endpoints
- server actions
- protected mutations
- verification flows
- reset flows

---

# SecureGate API Philosophy

SecureGate routes must be:
- thin
- explicit
- predictable
- secure
- easy to audit

Authentication code should NEVER be:
- magical
- heavily abstracted
- difficult to trace
- duplicated

Security-critical logic must remain obvious during review.

---

# Route Types

SecureGate uses two backend interaction patterns:

| Type | Use Case |
|---|---|
| Server Actions | Internal form-driven mutations |
| Route Handlers | Public endpoints and auth boundaries |

---

# Use Server Actions For

Use server actions when:
- triggered directly by SecureGate forms
- internal to the application
- tied to authenticated UI flows

Examples:
- login
- signup
- forgot password
- reset password
- resend verification

---

# Use Route Handlers For

Use route handlers when:
- handling verification URLs
- exposing public auth boundaries
- supporting NextAuth callbacks
- handling externally callable endpoints

Examples:
- `/api/auth/*`
- `/verify-email/[token]`

---

# Folder Structure

## Route Handlers

```txt
app/api/<resource>/<action>/route.ts
```

Example:

```txt
app/api/auth/login/route.ts
```

---

## Server Actions

Place beside the page that owns the flow.

Example:

```txt
app/(auth)/login/actions.ts
```

---

# Required Context Before Building

Before creating any route:

1. Read `architecture.md`
2. Read `security.md`
3. Read `code-style.md`
4. Read `AGENTS.md`

Do not invent:
- new auth patterns
- new response shapes
- new validation strategies

---

# Mandatory Workflow

# Step 1. Define The Flow First

Before writing code define:
- inputs
- validation
- auth requirements
- DB reads
- DB writes
- token lifecycle
- success states
- failure states

Always define:
- what happens on retry
- what happens on expiration
- what happens on malformed input

Authentication systems fail when edge cases are undefined.

---

# Step 2. Write Validation First

All external input must use Zod.

Validation happens BEFORE:
- auth checks
- token checks
- DB access
- email delivery

Example:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Never trust:
- request bodies
- query params
- form data
- URL params

---

# Step 3. Authenticate First

Before business logic:
- validate session
- validate auth state

If auth fails:
```ts
401 Unauthorized
```

Never trust:
- hidden UI
- client-side state
- route structure

Authentication must happen server-side.

---

# Step 4. Authorize Explicitly

Authentication is NOT authorization.

After auth:
- confirm ownership
- confirm permissions
- confirm access rights

Example:

```ts
session.user.id === user.id
```

Authorization must always be explicit.

---

# Step 5. Handle Tokens Safely

Verification and reset tokens must:
- be cryptographically secure
- expire automatically
- be single-use only
- invalidate after usage

Always validate:
- existence
- ownership
- expiration

Expired tokens must fail safely.

---

# Step 6. Keep Route Logic Thin

Routes should:
- validate
- authenticate
- authorize
- call utilities
- return responses

Move reusable logic into:
```txt
lib/
```

Examples:
- token generation
- mail sending
- auth helpers
- validation helpers

Avoid oversized route handlers.

---

# Step 7. Use Transactions For Multi-Step Writes

Use:
```ts
db.$transaction()
```

when multiple writes must succeed together.

Examples:
- user creation + token creation
- password reset + token deletion

Never allow partial auth writes.

---

# Step 8. Return Consistent Responses

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

# Step 9. Use Proper Status Codes

Use:
- `200` → success
- `400` → invalid input
- `401` → unauthenticated
- `403` → unauthorized
- `404` → missing resource
- `409` → conflict
- `429` → rate limited
- `500` → server error

Never expose:
- stack traces
- Prisma errors
- raw exceptions

---

# Step 10. Add Rate Limiting

These endpoints MUST be rate limited:
- login
- forgot password
- resend verification

Default:
```txt
5 requests per IP within 10 minutes
```

Rate limiting failures must:
- fail safely
- avoid leaking implementation details

---

# Step 11. Handle Emails Properly

All auth emails must:
- use tokenized URLs
- include expiration messaging
- avoid leaking auth internals

Email logic belongs ONLY in:
```txt
lib/mail.ts
```

Never duplicate mail logic.

---

# Step 12. Secure Logging

Log:
- failures
- suspicious behaviour
- unexpected states

Never log:
- passwords
- secrets
- tokens
- auth headers

Good:

```ts
logger.error('verification.failed', {
  reason: 'expired_token',
});
```

Bad:

```ts
console.log(token);
```

---

# Step 13. Revalidate UI State

After successful mutations:
- revalidate paths
- refresh auth-sensitive UI
- prevent stale state

Especially after:
- login
- logout
- verification
- password reset

---

# Server Action Template

```ts
'use server';

import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
});

export async function action(data: unknown) {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid input',
      },
    };
  }

  try {
    return {
      ok: true,
      data: {},
    };
  } catch {
    return {
      ok: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Something went wrong',
      },
    };
  }
}
```

---

# Route Handler Template

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Invalid input',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {},
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Something went wrong',
        },
      },
      { status: 500 }
    );
  }
}
```

---

# Required Security Checklist

Before completion verify:

- [ ] Zod validation exists
- [ ] Sessions validated
- [ ] Authorization checked
- [ ] Tokens validated
- [ ] Expiration handled
- [ ] Rate limiting applied
- [ ] No secrets exposed
- [ ] No raw errors leaked
- [ ] Transactions used when needed
- [ ] Tokens invalidated after usage

---

# Required Testing Checklist

Test:
- valid requests
- missing fields
- malformed input
- expired tokens
- reused tokens
- invalid sessions
- unauthorized access
- excessive requests

Secure auth systems must fail safely.

---

# What Not To Do

- Do not bypass Zod validation
- Do not expose auth internals
- Do not hardcode secrets
- Do not duplicate auth logic
- Do not skip token expiration
- Do not build custom auth systems
- Do not bypass NextAuth.js
- Do not trust client-side validation
- Do not create oversized route handlers

SecureGate routes should remain:
- minimal
- predictable
- secure
- production-ready