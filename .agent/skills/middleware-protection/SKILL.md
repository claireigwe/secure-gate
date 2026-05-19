# Skill: Middleware Protection

# Purpose

This skill standardizes how route protection and authentication middleware are implemented inside SecureGate.

Middleware is one of the most security-critical parts of the application.

Broken middleware can:
- expose protected routes
- create redirect loops
- leak protected UI
- break session validation
- bypass verification checks

This skill ensures middleware remains:
- secure
- predictable
- lightweight
- production-safe

Use this skill whenever working on:
- `middleware.ts`
- route protection
- auth redirects
- session validation
- verification enforcement
- protected route handling

---

# SecureGate Middleware Philosophy

Middleware exists ONLY to:
- validate access
- redirect safely
- protect routes
- enforce authentication state

Middleware is NOT:
- a business-logic layer
- a data-fetching layer
- a rendering system

Keep middleware:
- minimal
- explicit
- predictable

---

# Middleware Source Of Truth

All route protection logic belongs ONLY in:

```txt
middleware.ts
```

Do NOT duplicate middleware behaviour:
- inside components
- inside layouts
- inside client-side redirects

Middleware is the primary route protection boundary.

---

# Protected Routes

The primary protected route is:

```txt
/dashboard
```

Protected routes must:
- require authentication
- require verified email state
- reject invalid sessions

---

# Authentication Strategy

SecureGate uses:
- NextAuth.js
- JWT session strategy

Middleware should validate:
- auth state
- token validity
- verification state

Do NOT:
- build custom auth middleware systems
- manually parse auth cookies
- bypass NextAuth.js

---

# Middleware Responsibilities

Middleware must:

- validate session state
- protect authenticated routes
- protect verified-only routes
- redirect unauthorized users
- prevent redirect loops
- safely handle invalid sessions

---

# Middleware Should NOT

Middleware should NOT:
- query large datasets
- perform business workflows
- fetch dashboard data
- mutate application state
- send emails
- execute heavy DB logic

Keep middleware lightweight.

---

# Required Redirect Behaviour

## Unauthenticated Users

If a user accesses:
```txt
/dashboard
```

without authentication:

→ redirect to:
```txt
/login
```

---

## Unverified Users

If a user is authenticated but unverified:

→ redirect to:
```txt
/verify-email
```

---

## Authenticated Users Visiting Auth Pages

If authenticated users visit:
- `/login`
- `/signup`

redirect them appropriately.

Prevent unnecessary auth loops.

---

# Redirect Loop Prevention

Middleware MUST prevent:
- infinite redirects
- circular auth flows
- verification redirect loops

Always validate:
- current pathname
- destination pathname

before redirecting.

---

# Session Validation Rules

Middleware must:
- reject invalid JWTs
- reject expired sessions
- safely handle missing cookies
- safely handle malformed tokens

Never trust:
- client-side auth state
- hidden UI
- localStorage

---

# Middleware Matchers

Protect ONLY the required routes.

Example:

```ts
export const config = {
  matcher: ['/dashboard/:path*'],
};
```

Avoid:
- global middleware protection
- protecting unnecessary assets
- protecting public files

---

# Public Routes

These routes remain public:

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

Do NOT accidentally protect public auth flows.

---

# Verification Rules

Protected routes require:
```txt
emailVerified === true
```

Unverified users must NEVER access:
- dashboard routes
- protected pages
- authenticated app state

---

# Secure Redirect Rules

Always use:
- safe internal redirects

Never trust:
- user-provided redirect params
- external redirect URLs
- unvalidated query redirects

Avoid open redirect vulnerabilities.

---

# Safe Redirect Example

Good:

```ts
return NextResponse.redirect(
  new URL('/login', request.url)
);
```

Bad:

```ts
return redirect(userProvidedUrl);
```

---

# Middleware Logging Rules

Log:
- invalid session attempts
- suspicious auth failures
- unexpected middleware states

Never log:
- JWT tokens
- cookies
- secrets
- auth headers

---

# Performance Rules

Middleware runs frequently.

Keep middleware:
- fast
- synchronous when possible
- lightweight

Avoid:
- large DB queries
- heavy parsing
- unnecessary async chains

---

# Edge Runtime Rules

Middleware executes in the Edge Runtime.

Avoid:
- Node-only APIs
- unsupported packages
- filesystem operations

Middleware must remain Edge-compatible.

---

# Middleware Error Handling

Middleware must fail safely.

If session validation fails:
- treat user as unauthenticated
- redirect safely

Never:
- crash middleware
- expose auth internals
- expose stack traces

---

# Required Middleware Structure

Middleware should follow this order:

1. Parse request
2. Validate auth state
3. Validate verification state
4. Check route access
5. Redirect if necessary
6. Continue request safely

Keep the flow easy to audit.

---

# Middleware UI Protection

Middleware protects:
- routes
- navigation access

Server components still validate:
- auth state
- protected data access

Never rely ONLY on middleware.

Defense in depth matters.

---

# Authentication UX Rules

Redirects should feel:
- predictable
- stable
- understandable

Avoid:
- confusing redirect chains
- flashing protected UI
- inconsistent auth state

Users should never briefly see protected content before redirect.

---

# Required Testing Checklist

Before completion verify:

- [ ] Unauthenticated users redirect correctly
- [ ] Verified users access dashboard
- [ ] Unverified users redirect safely
- [ ] Invalid sessions fail safely
- [ ] Expired sessions fail safely
- [ ] Redirect loops do not occur
- [ ] Public routes remain accessible
- [ ] Protected routes remain protected
- [ ] Middleware works in production
- [ ] No auth internals leak publicly

---

# Reflection.md Alignment

Middleware implementation should support discussion around:
- Defensive Programming
- Murphy’s Law
- Principle of Least Surprise
- Kerckhoffs’s Principle

Middleware is a major part of the assessment’s security architecture evaluation.

Keep implementation easy to explain during review.

---

# Common Middleware Mistakes

Avoid:
- overloading middleware
- redirect loops
- trusting client state
- protecting public auth routes
- exposing redirect vulnerabilities
- relying solely on client redirects
- bypassing server validation

---

# What Not To Do

- Do not build custom auth middleware systems
- Do not bypass NextAuth.js
- Do not trust client-side auth state
- Do not create redirect loops
- Do not expose protected UI
- Do not log sensitive auth data
- Do not fetch large datasets
- Do not place business logic in middleware
- Do not trust user-provided redirect URLs

SecureGate middleware should remain:
- minimal
- secure
- predictable
- production-ready