# Skill: Auth Flow Builder

# Purpose

This skill standardizes authentication flow implementation across SecureGate.

Authentication is the core of this assessment.

Most grading criteria evaluate:
- authentication architecture
- defensive programming
- session handling
- token security
- route protection
- predictable auth behaviour

This skill exists to ensure every authentication flow:
- behaves consistently
- remains secure
- matches the SecureGate architecture
- follows production-safe patterns
- supports the REFLECTION.md discussion points

Use this skill whenever building:
- signup flows
- login flows
- logout flows
- verification flows
- password reset flows
- protected route flows
- session logic

---

# Core Authentication Philosophy

Authentication systems must be:
- predictable
- explicit
- traceable
- defensive
- easy to audit

Security-critical logic should NEVER feel magical.

Avoid:
- hidden auth wrappers
- unclear abstractions
- duplicated token logic
- scattered auth checks

Authentication code must remain understandable during review.

---

# SecureGate Authentication Scope

SecureGate supports ONLY:

- email/password signup
- email/password login
- email verification
- forgot password
- password reset
- protected sessions
- logout

---

# Explicitly Out Of Scope

DO NOT add:
- OAuth
- Google login
- GitHub login
- social authentication
- magic links
- multi-factor authentication
- role-based auth
- admin auth systems
- SSO

These violate:
```txt
YAGNI
```

and exceed assessment scope.

---

# Authentication Architecture

Authentication uses:
- NextAuth.js
- Credentials Provider
- JWT session strategy

Configuration lives in:
```txt
lib/auth.ts
```

This file is the source of truth for:
- auth configuration
- callbacks
- session handling
- auth validation
- route protection logic

Do not duplicate auth configuration elsewhere.

---

# Required Authentication Flows

SecureGate requires:

1. Signup Flow
2. Login Flow
3. Logout Flow
4. Email Verification Flow
5. Forgot Password Flow
6. Reset Password Flow
7. Protected Dashboard Flow

Every implementation must follow this skill.

---

# Signup Flow

# Required Flow

1. User submits:
   - name
   - email
   - password

2. Validate input using Zod

3. Check for existing user

4. Hash password using bcryptjs

5. Create user

6. Generate verification token

7. Store verification token

8. Send verification email

9. Redirect user appropriately

---

# Signup Security Rules

Passwords must:
- never be stored in plain text
- never be logged
- be hashed before persistence

Verification tokens must:
- expire automatically
- be single-use only
- be cryptographically secure

---

# Existing User Behaviour

If the email already exists:
- fail safely
- avoid leaking sensitive details

Good:
```txt
Unable to create account
```

Bad:
```txt
Email already exists
```

Prevent authentication enumeration attacks.

---

# Login Flow

# Required Flow

1. User submits:
   - email
   - password

2. Validate input

3. Find user

4. Compare password hash

5. Reject invalid credentials safely

6. Create session

7. Redirect to dashboard

---

# Login Security Rules

Never reveal:
- whether email exists
- whether password is incorrect

Always return:

```txt
Invalid credentials
```

Sessions must:
- use secure cookies
- reject invalid JWTs
- reject expired sessions

---

# Session Strategy

Preferred strategy:
```txt
JWT
```

Reason:
- lightweight
- fewer DB queries
- simpler deployment
- appropriate for assessment scope

---

# Protected Dashboard Flow

Protected routes:
```txt
/dashboard
```

must:
- validate auth state
- validate verification state
- reject unauthorized access

Protection occurs:
- server-side
- inside middleware

Never rely solely on:
- hidden UI
- client-side redirects

---

# Unauthenticated Behaviour

Unauthenticated users:
→ redirect to `/login`

Unverified users:
→ redirect to verification flow

---

# Logout Flow

# Required Flow

1. User clicks logout
2. Session invalidated
3. Auth cookies removed
4. User redirected to login

Logout must:
- invalidate safely
- clear protected state
- refresh auth-sensitive UI

---

# Email Verification Flow

# Required Flow

1. Verification email sent
2. User clicks tokenized link
3. Token validated
4. Expiration checked
5. Verification state updated
6. Token invalidated
7. User redirected safely

---

# Verification Token Rules

Verification tokens must:
- be cryptographically secure
- expire automatically
- be single-use only
- be deleted after successful usage

Expired tokens must fail safely.

---

# Resend Verification Flow

If verification token expires:
- allow resend flow
- generate new token
- invalidate old token

Never reuse verification tokens.

---

# Forgot Password Flow

# Required Flow

1. User submits email
2. Generate reset token
3. Store token with expiration
4. Send reset email

---

# Forgot Password Security Rules

Never reveal:
- whether email exists
- whether account exists

Always fail safely.

---

# Reset Password Flow

# Required Flow

1. User clicks reset link
2. Validate token
3. Validate expiration
4. User submits new password
5. Hash new password
6. Update password
7. Delete reset token
8. Redirect to login

---

# Reset Token Rules

Reset tokens must:
- expire automatically
- be single-use only
- be cryptographically secure
- invalidate after usage

Never allow:
- token reuse
- expired token usage

---

# Middleware Integration

Protected auth state is enforced in:
```txt
middleware.ts
```

Middleware responsibilities:
- validate auth state
- validate verification state
- redirect unauthorized users
- prevent redirect loops

Middleware should remain:
- lightweight
- predictable
- security-focused

---

# Zod Validation Rules

All auth flows require:
- server-side validation
- shared validation schemas

Validation belongs in:
```txt
schemas/
```

or:
```txt
lib/validations.ts
```

Never duplicate validation logic.

---

# Token Architecture

Token utilities belong ONLY in:
```txt
lib/tokens.ts
```

Never:
- duplicate token generation
- generate tokens inline repeatedly
- scatter expiration logic

---

# Email Architecture

Email logic belongs ONLY in:
```txt
lib/mail.ts
```

Supported emails:
- verification emails
- password reset emails

Emails must:
- use tokenized URLs
- include expiration messaging
- avoid exposing implementation details

---

# Route Protection Rules

Never trust:
- hidden UI
- client state
- route visibility

Protected data must always be validated:
- server-side
- before rendering

---

# Authentication UI Rules

Authentication UI should feel:
- stable
- minimal
- trustworthy
- predictable

Avoid:
- flashy auth screens
- excessive animation
- decorative complexity

This is an authentication product — not a marketing website.

---

# Required Auth States

Every auth flow must support:
- loading states
- success states
- validation states
- disabled states
- expiration states
- error states

---

# Required Error Messages

Good:
```txt
Invalid credentials
This verification link has expired
This reset link has expired
```

Bad:
```txt
Email not found
Wrong password
User does not exist
```

Never leak sensitive auth details.

---

# Security Requirements

Authentication flows must:
- validate all input server-side
- sanitize incoming payloads
- rate limit sensitive endpoints
- protect secrets using env vars
- reject malformed requests safely

---

# Required Rate Limiting

Apply rate limiting to:
- login
- forgot password
- resend verification

Default:
```txt
5 attempts per IP within 10 minutes
```

---

# Logging Rules

Never log:
- passwords
- secrets
- reset tokens
- verification tokens
- auth cookies

Safe logging only.

---

# Required Testing Checklist

Before completion verify:

- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] Verification works
- [ ] Password reset works
- [ ] Expired tokens fail safely
- [ ] Tokens invalidate after usage
- [ ] Middleware redirects correctly
- [ ] Sessions are protected
- [ ] Rate limiting works
- [ ] No secrets are exposed

---

# Reflection.md Alignment

Authentication implementations should naturally support discussion around:
- Murphy’s Law
- Defensive Programming
- YAGNI
- Kerckhoffs’s Principle
- Principle of Least Surprise
- Technical Debt

Avoid implementations that are difficult to explain during review.

---

# What Not To Do

- Do not build custom auth systems
- Do not bypass NextAuth.js
- Do not bypass Zod validation
- Do not expose auth internals
- Do not skip token expiration
- Do not trust client-side validation
- Do not add OAuth providers
- Do not add social auth
- Do not add unnecessary abstractions

SecureGate auth flows should remain:
- secure
- explicit
- predictable
- production-ready