---
trigger: always_on
---

# Rule: Design System

These rules define the SecureGate design system architecture.

All UI generated in this project must follow these rules exactly.

Consistency is more important than creativity.

The existing design system is the source of truth.

Do not introduce competing visual systems.

---

# Token Files Are the Source of Truth

The project already contains design token files.

The agent must NEVER modify these files directly:

```txt
tokens/colors.css
tokens/typography.css
```

These files define:
- colors
- typography
- spacing conventions
- font weights
- line heights
- font families
- visual hierarchy

They are globally available through CSS custom properties.

---

# Mandatory: Use CSS Variables, Never Raw Values

The agent must NEVER hardcode:
- colors
- font sizes
- font families
- spacing values
- border radii
- shadows

---

## Wrong

```css
color: #1a1a1a;
font-size: 16px;
font-family: 'Inter', sans-serif;
background: #f5f5f5;
border-radius: 12px;
```

---

## Correct

```css
color: var(--color-text-primary);
font-size: var(--font-size-base);
font-family: var(--font-family-base);
background: var(--color-surface);
border-radius: var(--radius-input);
```

---

Before writing any style value:
1. Check the token files
2. Reuse existing variables
3. Ask before inventing new values

Never introduce arbitrary visual values.

---

# Design Philosophy

SecureGate is:
- minimal
- modern
- clean
- security-focused
- utility-oriented

The UI should communicate:
- trust
- clarity
- simplicity
- reliability

Avoid:
- decorative UI
- unnecessary animation
- flashy gradients
- excessive shadows
- visual clutter

This is an authentication product, not a marketing website.

---

# Styling Method

The project uses:
- CSS Modules only

Each component should have:
```txt
ComponentName.module.css
```

co-located with the component.

---

## Forbidden Styling Systems

DO NOT install:
- Tailwind CSS
- Chakra UI
- Material UI
- Bootstrap
- shadcn/ui
- styled-components
- Emotion
- inline utility frameworks

Do not introduce competing design systems.

---

## Inline Styles

Do NOT use:
```tsx
style={{}}
```

except for truly dynamic values that cannot be expressed cleanly in CSS.

Example allowed:
- dynamic progress width
- runtime transform values

Example NOT allowed:
- colors
- typography
- spacing
- layout styling

---

# Layout Rules

Layouts should:
- prioritize readability
- minimize visual noise
- maintain predictable spacing
- support responsive behaviour

Avoid:
- deeply nested containers
- inconsistent spacing
- oversized cards
- complex dashboard layouts

---

# Spacing Scale

Use a consistent spacing scale.

Spacing must follow multiples of 4px.

Allowed values:
- 4px
- 8px
- 12px
- 16px
- 20px
- 24px
- 32px
- 40px
- 48px
- 64px

Use spacing tokens when available.

Do NOT invent arbitrary spacing values.

---

# Border Radius Rules

Use consistent border radii only.

## Small Elements
Use for:
- badges
- tags
- pills

Value:
```css
4px
```

---

## Inputs & Buttons

Use for:
- form inputs
- buttons
- auth actions

Value:
```css
12px
```

---

## Cards & Modals

Use for:
- auth cards
- dialogs
- modal containers

Value:
```css
24px
```

---

# Typography Rules

Typography should:
- prioritize readability
- support accessibility
- maintain strong hierarchy
- remain visually calm

Use ONLY typography tokens.

Do NOT:
- hardcode font sizes
- introduce new font families
- create inconsistent heading scales

---

# Component Design Rules

Components must:
- remain visually consistent
- reuse existing design primitives
- inherit spacing conventions
- inherit typography conventions

Avoid:
- unique one-off component styling
- inconsistent interaction patterns
- over-designed UI components

---

# Form Design Rules

Authentication forms are the core UI.

All forms must include:
- clear labels
- accessible input states
- loading states
- validation feedback
- disabled states
- focus states
- error messaging

Forms should feel:
- safe
- trustworthy
- predictable

---

# Input Rules

Inputs must:
- be easy to scan
- support keyboard accessibility
- maintain consistent sizing
- maintain consistent spacing

Password fields must support:
- hidden/visible toggle
- strength indicators
- secure interaction patterns

---

# Button Rules

Buttons should:
- have clear hierarchy
- maintain consistent sizing
- use token-based colors
- include disabled states
- include loading states

Avoid:
- overly decorative buttons
- inconsistent sizing
- excessive hover effects

---

# Mobile-First Rules

SecureGate must be built mobile-first.

Default styles target mobile devices first.

Desktop enhancements should layer on progressively.

Use:
```css
@media (min-width: 768px)
```

for desktop adaptations.

---

# Mobile Requirements

The authentication experience must:
- work comfortably on small screens
- support thumb-friendly interaction
- avoid horizontal scrolling
- remain readable at 375px width

Touch targets should be at least:
```txt
44px
```

tall.

---

# Dashboard Rules

The dashboard is intentionally simple.

Do NOT:
- create analytics-heavy layouts
- introduce complex widgets
- build unnecessary admin patterns

The dashboard exists only to:
- confirm protected access
- demonstrate route protection
- validate session behaviour

---

# Accessibility Rules

All UI must support:
- keyboard navigation
- visible focus states
- semantic HTML
- accessible labels
- readable contrast ratios

Never remove focus outlines without replacement styles.

---

# Loading States

Every async interaction must include:
- loading indicators
- disabled interaction states
- predictable feedback

Avoid:
- frozen UI states
- ambiguous loading behaviour

---

# Error State Design

Error messages should:
- be clear
- be concise
- avoid technical jargon
- avoid leaking sensitive information

Good:
```txt
Invalid credentials
```

Bad:
```txt
Password mismatch for existing account
```

---

# Animation Rules

Animations should be:
- subtle
- fast
- purposeful

Avoid:
- large motion effects
- parallax
- distracting transitions
- marketing-style animations

Authentication UI should feel stable and predictable.

---

# What Not To Do

- Do not install Tailwind CSS
- Do not install component libraries
- Do not override token files
- Do not hardcode colors
- Do not hardcode typography values
- Do not invent inconsistent spacing
- Do not create visually inconsistent components
- Do not introduce flashy UI patterns
- Do not build decorative interfaces

The UI should feel:
- trustworthy
- minimal
- secure
- production-ready