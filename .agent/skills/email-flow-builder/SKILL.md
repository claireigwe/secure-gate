# Skill: Email Flow Builder

# Purpose

This skill standardizes how authentication emails are:
- generated
- formatted
- secured
- delivered

inside SecureGate.

Authentication emails are security-critical infrastructure.

Poor email implementation can:
- leak tokens
- expose auth internals
- create phishing-like UX
- break verification flows
- weaken password reset security

This skill ensures email flows remain:
- secure
- predictable
- minimal
- production-ready

Use this skill whenever building:
- verification emails
- password reset emails
- resend verification flows
- tokenized auth emails

---

# SecureGate Email Philosophy

Authentication emails are:
- transactional
- security-focused
- utility-driven

They are NOT:
- marketing emails
- onboarding sequences
- promotional content

The email experience should communicate:
- trust
- clarity
- urgency
- safety

Avoid:
- decorative complexity
- excessive branding
- unclear messaging

---

# Email Architecture

All email logic belongs ONLY in:

```txt
lib/mail.ts
```

Never:
- duplicate email logic
- send emails inline from routes
- scatter template logic across the app

Email handling must remain centralized.

---

# Supported Email Flows

SecureGate supports ONLY:

1. Verification emails
2. Password reset emails

---

# Explicitly Out Of Scope

DO NOT add:
- newsletters
- marketing campaigns
- onboarding sequences
- notifications
- admin alerts
- promotional emails

Keep email scope intentionally narrow.

---

# Email Provider

SecureGate uses:
- Resend

Do NOT introduce:
- Nodemailer
- SendGrid
- Mailgun
- custom SMTP systems

Resend is the source of truth.

---

# Required Environment Variables

```env
RESEND_API_KEY
NEXTAUTH_URL
```

These must:
- exist in `.env.local`
- exist in Vercel env vars
- never be hardcoded

---

# Verification Email Flow

# Required Flow

1. User signs up
2. Verification token generated
3. Token stored in DB
4. Verification email sent
5. User clicks tokenized link
6. Token validated
7. Verification completed
8. Token invalidated

---

# Verification Email Rules

Verification emails must:
- include tokenized URLs
- include expiration messaging
- clearly explain the action
- remain concise

Verification tokens must:
- expire automatically
- be single-use only
- fail safely when expired

---

# Password Reset Email Flow

# Required Flow

1. User requests password reset
2. Reset token generated
3. Token stored in DB
4. Reset email sent
5. User clicks reset link
6. Token validated
7. Password updated
8. Token invalidated

---

# Password Reset Email Rules

Reset emails must:
- avoid exposing auth internals
- include expiration messaging
- include secure reset URLs
- remain concise

Reset tokens must:
- expire automatically
- be single-use only
- invalidate after usage

---

# Email Security Rules

Authentication emails must NEVER:
- expose passwords
- expose auth internals
- reveal account existence
- expose raw DB identifiers
- leak implementation details

---

# Secure Link Rules

All auth links must use:
```txt
https://
```

Never:
- send insecure HTTP links
- use localhost URLs in production
- expose unsafe protocols

---

# Token URL Rules

Good:

```txt
https://securegate.com/verify-email/<token>
```

Bad:

```txt
https://securegate.com/verify?email=user@example.com
```

Avoid exposing sensitive identifiers in URLs.

---

# Expiration Messaging

Verification and reset emails must clearly communicate:
- links expire
- expired links are invalid
- new links can be requested

Good:

```txt
This link expires in 1 hour.
```

Avoid vague messaging.

---

# Email Tone

Emails should feel:
- professional
- trustworthy
- calm
- security-focused

Avoid:
- marketing language
- hype language
- decorative copywriting

This is a security product.

---

# HTML Structure Rules

Emails should remain:
- lightweight
- readable
- responsive
- accessible

Avoid:
- overly complex layouts
- heavy image usage
- decorative email templates

---

# Required Email Sections

Verification emails should include:
- clear heading
- short explanation
- action button/link
- expiration message

Password reset emails should include:
- reset explanation
- reset button/link
- expiration warning
- ignore-if-not-you message

---

# Ignore Message Requirement

Password reset emails must include:

```txt
If you did not request this password reset, you can safely ignore this email.
```

This reduces user panic and confusion.

---

# Email Component Rules

If reusable email components exist:
- keep them minimal
- keep them accessible
- avoid over-abstraction

Authentication email templates should remain:
- easy to audit
- easy to modify
- easy to understand

---

# Logging Rules

Log:
- delivery failures
- provider failures
- retry failures

Never log:
- tokens
- secrets
- auth headers
- email payloads containing sensitive data

---

# Error Handling Rules

If email delivery fails:
- fail safely
- return sanitized messages
- avoid exposing provider internals

Good:

```txt
Unable to send verification email
```

Bad:

```txt
Resend API request failed with 403
```

---

# Retry Rules

Allow safe resend flows for:
- expired verification links
- failed delivery attempts

Do NOT:
- spam resend attempts
- bypass rate limiting
- reuse old tokens

---

# Rate Limiting Rules

Rate limit:
- resend verification
- forgot password

Default:
```txt
5 requests per IP within 10 minutes
```

Prevent email abuse.

---

# Email Template Styling Rules

Emails should:
- use existing brand colors carefully
- prioritize readability
- remain accessible
- support mobile devices

Avoid:
- flashy gradients
- marketing-heavy visuals
- oversized graphics

---

# Mobile Email Rules

Emails must remain readable on:
- small mobile screens

Buttons should:
- remain touch-friendly
- remain readable
- avoid tiny text

---

# Accessibility Rules

Emails must:
- use semantic structure
- support readable contrast
- avoid inaccessible color combinations

Links should:
- be clearly identifiable
- remain readable without styling

---

# Testing Checklist

Before completion verify:

- [ ] Verification emails send correctly
- [ ] Password reset emails send correctly
- [ ] Tokens work correctly
- [ ] Expired tokens fail safely
- [ ] Tokens invalidate after use
- [ ] Resend verification works
- [ ] Links use HTTPS
- [ ] No secrets exposed
- [ ] No sensitive logs created
- [ ] Mobile readability works

---

# Reflection.md Alignment

Email flows should support discussion around:
- Defensive Programming
- Principle of Least Surprise
- Murphy’s Law
- Kerckhoffs’s Principle

Authentication emails are security-sensitive UX.

Implementations should be easy to explain during review.

---

# What Not To Do

- Do not expose auth internals
- Do not leak account existence
- Do not reuse tokens
- Do not send insecure links
- Do not hardcode secrets
- Do not build marketing email systems
- Do not bypass expiration handling
- Do not create decorative email templates
- Do not duplicate mail logic

SecureGate email flows should remain:
- secure
- minimal
- predictable
- production-ready