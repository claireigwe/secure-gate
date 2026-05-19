# Skill: Component Builder

# Purpose

This skill standardizes how React components are built inside SecureGate.

SecureGate is an authentication-first product.

The UI must feel:
- secure
- predictable
- minimal
- trustworthy
- production-ready

This skill ensures every component:
- follows the existing design system
- respects accessibility requirements
- matches the SecureGate architecture
- remains maintainable
- behaves consistently across auth flows

Use this skill whenever creating:
- UI primitives
- auth forms
- dashboard components
- shared UI
- auth feedback states
- loading states
- protected-route UI

---

# SecureGate UI Philosophy

SecureGate is NOT:
- a marketing website
- a flashy SaaS dashboard
- a highly animated experience

The UI exists to support:
- authentication clarity
- safe interactions
- predictable behaviour
- accessibility
- trust

The interface should feel:
- calm
- stable
- readable
- professional

Avoid:
- excessive decoration
- visual noise
- unnecessary complexity

---

# Before You Touch Any File

# Step 1. Check Whether The Component Already Exists

Before creating a component:
- search `components/`
- search `_components/`
- search existing auth primitives

If a similar component exists:
- extend it
- add variants
- add props

Avoid duplicate primitives.

Two different button systems create long-term UI inconsistency.

---

# Step 2. Decide Where It Belongs

## Primitive UI Components

Examples:
- Button
- Input
- Card
- Spinner
- Badge

Location:
```txt
components/ui/
```

---

## Authentication Components

Examples:
- LoginForm
- SignupForm
- PasswordStrength
- VerificationBanner

Location:
```txt
components/auth/
```

---

## Shared Components

Examples:
- EmptyState
- ErrorMessage
- LoadingState

Location:
```txt
components/shared/
```

---

## Page-Specific Components

Used once and tightly coupled to a page.

Location:
```txt
app/.../_components/
```

Do not globalize prematurely.

---

# Step 3. Load Context First

Before building:
1. `design-system.md`
2. `code-style.md`
3. `architecture.md`
4. `AGENTS.md`

These define:
- styling rules
- component expectations
- accessibility requirements
- design token rules
- TypeScript conventions

Do not invent new UI patterns.

---

# Component Template

Use this structure:

```tsx
import styles from './ComponentName.module.css';

import { cn } from '@/lib/utils';

type ComponentNameProps = {
  className?: string;
};

export function ComponentName({
  className,
}: ComponentNameProps) {
  return (
    <div className={cn(styles.root, className)}>
      Content
    </div>
  );
}
```

---

# Server vs Client Components

Default to:
- server components

Add:
```ts
'use client';
```

ONLY when needed.

Client components are required for:
- state
- effects
- browser APIs
- event handlers
- interactivity

If unsure:
- start as a server component first

Do not overuse client components.

---

# Styling Rules

SecureGate uses:
- CSS Modules only

Each component must include:
```txt
ComponentName.module.css
```

beside the component file.

---

# Forbidden Styling Systems

DO NOT install:
- Tailwind CSS
- Chakra UI
- Material UI
- Bootstrap
- shadcn/ui
- styled-components
- Emotion

The existing design system is the only source of truth.

---

# Design Token Rules

All visual values must use CSS variables.

Use:
```css
var(--token-name)
```

Never hardcode:
- colors
- typography
- spacing
- border radii

---

## Wrong

```css
color: #1a1a1a;
font-size: 16px;
```

---

## Correct

```css
color: var(--color-text-primary);
font-size: var(--font-size-base);
```

---

# Design System Source Of Truth

Do NOT modify:
```txt
tokens/colors.css
tokens/typography.css
```

These files define:
- typography
- colors
- visual hierarchy
- spacing conventions

---

# Layout Rules

Layouts should:
- prioritize readability
- reduce visual noise
- remain responsive
- support auth clarity

Avoid:
- deeply nested wrappers
- oversized cards
- dashboard complexity
- cluttered layouts

---

# Mobile-First Rules

SecureGate must be mobile-first.

Default styles target:
- small screens first

Use:
```css
@media (min-width: 768px)
```

for desktop enhancements.

The auth experience must remain fully usable at:
```txt
375px
```

width.

---

# Accessibility Rules

Accessibility is mandatory.

All interactive components must support:
- keyboard navigation
- visible focus states
- semantic HTML
- readable contrast
- screen reader compatibility

---

# Button Accessibility

Buttons must:
- support keyboard focus
- expose disabled states
- expose loading states

Icon-only buttons require:
```tsx
aria-label
```

---

# Input Accessibility

Inputs must:
- have labels
- support keyboard navigation
- expose validation states
- maintain visible focus states

Password fields must support:
- visibility toggles
- password strength indicators

---

# Focus State Rules

Every interactive component requires:
```css
:focus-visible
```

styles.

Example:

```css
outline: 2px solid var(--color-primary);
```

Never remove focus indicators.

---

# Authentication UX Rules

Authentication UI should communicate:
- trust
- clarity
- security
- predictability

Avoid:
- decorative auth patterns
- distracting animation
- marketing-heavy visuals

This is an authentication product.

---

# Loading State Rules

Every async interaction must support:
- loading states
- disabled states
- safe interaction locking

Avoid:
- frozen UI
- double submissions
- ambiguous loading behaviour

---

# Error State Rules

Error messaging must:
- remain concise
- remain safe
- avoid technical jargon
- avoid auth leakage

Good:
```txt
Invalid credentials
```

Bad:
```txt
Password incorrect for existing account
```

---

# Form Rules

Authentication forms must:
- validate safely
- expose validation feedback
- disable during submission
- handle errors predictably

Never expose:
- stack traces
- auth internals
- sensitive system details

---

# Password Component Rules

Password inputs must:
- support secure input handling
- include strength indicators
- avoid exposing sensitive state

Do not:
- log passwords
- expose passwords in errors
- pass passwords unnecessarily between layers

---

# Component Size Rules

Keep components:
- focused
- readable
- modular

If a component exceeds ~200 lines:
- split responsibilities
- extract subcomponents
- move logic into hooks/utilities

Avoid giant auth components.

---

# Variant Rules

If components support:
- sizes
- states
- variants

use predictable composition.

Avoid:
- deeply nested ternaries
- duplicated markup
- unreadable conditional styling

Variants should remain:
- explicit
- maintainable
- readable

---

# Dashboard Rules

The dashboard exists ONLY to:
- confirm protected access
- validate auth state
- demonstrate middleware protection

Do NOT:
- build analytics dashboards
- add charts
- add widgets
- add unnecessary complexity

Keep dashboard UI intentionally simple.

---

# Manual Verification Checklist

Before completion verify:

- [ ] Component works at 375px width
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] No hardcoded values
- [ ] Uses CSS Modules only
- [ ] Uses design tokens only
- [ ] No unnecessary client component usage
- [ ] No console.log left behind
- [ ] Loading states work
- [ ] Error states work

---

# Reflection.md Alignment

Components should naturally support discussion around:
- Principle of Least Surprise
- Defensive Programming
- YAGNI
- Technical Debt

Avoid UI patterns that are difficult to justify during review.

---

# What Not To Do

- Do not install Tailwind CSS
- Do not install component libraries
- Do not hardcode visual values
- Do not duplicate primitives
- Do not over-abstract components
- Do not build decorative auth UI
- Do not bypass accessibility requirements
- Do not create inconsistent interaction patterns

SecureGate components should feel:
- minimal
- secure
- predictable
- production-ready