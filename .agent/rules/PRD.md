---
trigger: always_on
---

# SecureGate — Product Requirements Document (PRD)

---

# 1. Product Overview

SecureGate is a standalone authentication and security application designed to demonstrate production-ready identity and access management using modern full-stack engineering practices.

The application focuses entirely on authentication architecture, defensive programming, secure user management, and production-safe authentication flows.

Instead of building a full SaaS product, SecureGate isolates the authentication layer commonly found in real-world applications and treats it as the core product.

The system enables users to:

* Create accounts securely
* Verify their email addresses
* Log into protected sessions
* Reset forgotten passwords
* Access protected routes safely
* Log out securely

The application focuses on:

* Authentication security
* Defensive programming
* Session management
* Route protection
* Token security
* Production-grade engineering principles

Unique Value Proposition

“Production-ready authentication architecture built with secure engineering principles.”

---

# 2. Objectives

## Primary Objectives

* Build a secure standalone authentication system
* Demonstrate production-grade authentication architecture
* Implement safe session handling and route protection
* Prevent common authentication vulnerabilities
* Demonstrate understanding of software engineering principles

---

## Secondary Objectives

* Showcase clean full-stack architecture
* Demonstrate defensive programming techniques
* Ensure maintainable and modular code structure
* Provide secure and user-friendly authentication flows
* Deploy a production-ready application to Vercel

---

# 3. Target Users

## Primary Users

* Bootcamp evaluators
* Technical reviewers
* Developers learning authentication architecture
* Product engineers

---

## User Characteristics

* Security-conscious
* Familiar with web authentication flows
* Expect reliable and predictable behaviour
* Expect modern responsive interfaces
* Expect secure session handling

---

# 4. Core Features

## User Registration System

* User sign up form
* Full form validation using Zod
* Password confirmation validation
* Password strength indicator
* Secure password hashing using bcryptjs
* Generic validation messaging

---

## Authentication System

* User login with email and password
* Session creation using NextAuth.js
* JWT or database session strategy
* Generic invalid credential messaging
* Secure logout flow
* Session destruction on logout

---

## Email Verification System

* Verification email delivery using Resend
* Secure verification token generation
* Verification token expiration handling
* Email verification route
* Verified user database updates
* Resend verification flow for expired tokens

---

## Password Recovery System

* Forgot password flow
* Password reset email delivery
* Secure reset token generation
* Password reset route
* Reset token expiration handling
* Token invalidation after use
* Password rehashing after reset

---

## Protected Dashboard System

* Middleware-based route protection
* Redirect unauthenticated users to login
* Restrict unverified users from dashboard access
* Prevent unauthorized route access
* Prevent redirect loops

---

## Rate Limiting & Security Hardening

* Login endpoint rate limiting
* Forgot password endpoint rate limiting
* Generic API error responses
* HTTP security headers
* Environment variable protection
* Input sanitization

---

# 5. User Flow

## Primary Registration Flow

1. User opens the app
2. User navigates to Sign Up page
3. User enters:

   * Name
   * Email
   * Password
4. System validates form input
5. Password is hashed securely
6. User record is created
7. Verification token is generated
8. Verification email is sent
9. User clicks verification link
10. System validates token
11. User account is verified
12. User gains access to protected dashboard

---

## Login Flow

1. User navigates to Login page
2. User enters email and password
3. System validates credentials
4. Password hash comparison occurs
5. Session is created securely
6. User is redirected to dashboard

If credentials fail:

* Display “Invalid credentials”
* Do not reveal whether email or password was incorrect

---

## Forgot Password Flow

1. User clicks “Forgot Password”
2. User enters email address
3. System generates reset token
4. Reset email is sent
5. User clicks reset link
6. System validates token and expiration
7. User enters new password
8. New password is hashed
9. Token is deleted after successful usage
10. User is redirected to login

---

## Protected Route Flow

1. User attempts to access dashboard
2. Middleware checks authentication state
3. Middleware checks email verification status
4. Unauthorized users are redirected
5. Authorized users gain access

---

## Logout Flow

1. User clicks logout
2. Session is destroyed
3. Authentication cookies are invalidated
4. User is redirected to login page

---

## Error Flow

* Missing input → show validation message
* Expired token → show expiration message
* Invalid credentials → show generic auth message
* Excessive login attempts → temporarily block access
* Unauthorized dashboard access → redirect to login

---

# 6. Data Models / Schemas

## User

* id
* name
* email
* password
* emailVerified
* createdAt

---

## VerificationToken

* identifier
* token
* expires

---

## PasswordResetToken

* email
* token
* expires

---

## Session (Optional Depending on Strategy)

* sessionToken
* userId
* expires

---

# 7. System Behavior

* System must never store plain text passwords
* System must reject invalid form submissions
* System must prevent unauthorized dashboard access
* System must expire verification tokens
* System must expire password reset tokens
* System must invalidate tokens after usage
* System must prevent brute-force login attempts
* System must avoid leaking sensitive authentication information
* System must fail safely under invalid or malicious behaviour
* System must maintain predictable authentication flows

---

# 8. API Behaviour Standards

All API routes must:

* Validate incoming payloads using Zod
* Return consistent JSON responses
* Use appropriate HTTP status codes
* Fail gracefully under invalid input
* Avoid leaking stack traces or internal implementation details
* Prioritize security over verbosity

Authentication endpoints must:

* Use generic auth error messages
* Avoid exposing whether emails exist
* Handle expired tokens safely
* Reject malformed payloads

---

# 9. Middleware Responsibilities

Middleware must:

* Protect dashboard routes
* Detect missing or invalid sessions
* Redirect unauthenticated users to login
* Restrict unverified users from protected pages
* Prevent authenticated users from revisiting auth pages unnecessarily
* Prevent redirect loops
* Handle invalid session cookies safely

---

# 10. Security & Compliance

## Authentication Security

* Hash passwords using bcryptjs with secure salt rounds
* Use cryptographically secure token generation
* Validate all user input server-side
* Sanitize incoming payloads
* Prevent credential leakage
* Protect authentication endpoints with rate limiting

---

## Environment Variable Protection

Sensitive values must be stored using environment variables:

* DATABASE_URL
* NEXTAUTH_SECRET
* NEXTAUTH_URL
* RESEND_API_KEY
* UPSTASH_REDIS_REST_URL
* UPSTASH_REDIS_REST_TOKEN

Environment variables must:

* Exist only in `.env.local` during development
* Be configured in the Vercel dashboard for production
* Never be committed to GitHub

---

## HTTP Security Requirements

Add security headers including:

* X-Frame-Options
* X-Content-Type-Options
* Referrer-Policy

---

## Data Protection

* Never expose secrets publicly
* Never store passwords unencrypted
* Never leak internal implementation details
* Avoid revealing account existence during authentication flows

---

# 11. Engineering Principles

## Murphy’s Law

Assume:

* users will make mistakes
* attackers will abuse endpoints
* tokens will expire
* sessions will fail

The system must behave safely under worst-case conditions.

---

## YAGNI

The product intentionally excludes:

* social login
* OAuth providers
* payment systems
* multi-factor authentication
* admin dashboards
* analytics systems
* unrelated SaaS functionality

Only features required for secure authentication should exist.

---

## Defensive Programming

* Validate all input
* Handle invalid states safely
* Never trust client-side validation alone
* Fail predictably under bad conditions

---

## Principle of Least Surprise

Authentication flows and error messages should behave predictably and consistently.

---

## Kerckhoffs’s Principle

Security must depend on:

* strong hashing
* secure token handling
* protected secrets

Security must never depend on hidden implementation.

---

# 12. UX / UI Requirements

The UI should be:

* clean
* minimal
* responsive
* accessible
* modern
* flat in design style

---

## Form Requirements

All forms must include:

* accessible labels
* validation messaging
* loading states
* disabled states during submission
* meaningful user feedback

---

## Password Strength Requirements

The password field must include:

* Weak indicator
* Fair indicator
* Strong indicator

Strength should be calculated using:

* length
* character variety
* complexity

---

# 13. Testing Expectations

The application should be manually testable against:

* wrong passwords
* expired verification tokens
* expired reset tokens
* reused tokens
* missing form fields
* invalid sessions
* unauthorized route access
* excessive login attempts
* deleted cookies
* invalid authentication payloads

The system must fail safely and predictably in all scenarios.

---

# 14. Deployment Requirements

## Deployment Platform

* Vercel

---

## Repository Requirements

The GitHub repository must:

* Include REFLECTION.md
* Exclude `.env.local`
* Exclude secrets
* Contain clean commit history
* Maintain organized project structure

---

## Live Deployment Requirements

The deployed app must successfully support:

* sign up
* email verification
* login
* protected routes
* forgot password
* reset password
* logout
* rate limiting

---

# 15. Documentation Requirements

The project must include a REFLECTION.md file.

The document should:

* Explain engineering decisions
* Reference real code paths
* Explain tradeoffs
* Discuss engineering principles
* Describe technical debt
* Explain security decisions

The codebase should be structured in a way that makes implementation decisions easy to explain during technical review.

---

# 16. Folder Structure Guidance

Recommended structure:

src/
├── app/
│    ├── api/
│    ├── login/
│    ├── signup/
│    ├── dashboard/
│    ├── verify-email/
│    ├── forgot-password/
│    └── reset-password/
│
├── components/
│
├── lib/
│    ├── prisma.ts
│    ├── auth.ts
│    ├── mail.ts
│    ├── tokens.ts
│    └── rate-limit.ts
│
├── schemas/
│
├── actions/
│
├── prisma/
│
└── middleware.ts

Keep responsibilities modular and clearly separated.

---

# 17. Technical Constraints

Do not:

* Over-engineer abstractions
* Add unnecessary packages
* Add unrelated features
* Build beyond the assessment scope
* Introduce unnecessary architectural complexity

Focus on:

* correctness
* security
* maintainability
* production-readiness

---

# 18. Success Metrics (KPIs)

## Functional Metrics

* Successful signup completion rate
* Successful email verification rate
* Successful login rate
* Successful password reset completion rate
* Protected route enforcement accuracy

---

## Security Metrics

* Zero plain text password storage
* Successful rate limiting enforcement
* Successful token expiration handling
* Zero leaked secrets
* Safe handling of invalid requests


These features are intentionally excluded from the current scope under YAGNI principles.
