# Terra SolidStart Webapp - Implementation Plan

This document outlines the analysis of the current codebase and provides a prioritized plan for improvements that subsequent agents can implement.

## Current State Analysis

### Architecture
- **Framework**: SolidStart with file-based routing
- **Styling**: CSS Modules with CSS custom properties (design tokens)
- **Pages**: Home, Features, Contact (3 pages)
- **Components**: Layout component with header/nav/footer

### Strengths
1. Well-structured design system with warm earth tones
2. Responsive design with mobile-first approach
3. Complete form validation with real-time feedback
4. Good TypeScript typing
5. Proper cleanup for async operations (setTimeout cleanup)

### Areas for Improvement

## Priority 1: Critical Improvements

### 1.1 Mobile Navigation Menu
**Current Issue**: The navigation uses a horizontal list that doesn't adapt well to small screens.

**Implementation Tasks**:
- Add a hamburger menu button for mobile viewports
- Create a mobile drawer/overlay navigation
- Add proper transitions and animations
- Ensure keyboard accessibility (escape to close, focus trap)

**Files to modify**:
- `src/components/Layout.tsx`
- `src/components/Layout.module.css`

**Estimated complexity**: Medium

### 1.2 Accessibility Improvements
**Current Issues**:
- Form fields lack proper ARIA attributes for error states
- No skip-to-content link
- Footer links use `#` placeholder hrefs
- No focus visible indicators beyond browser defaults

**Implementation Tasks**:
- Add `aria-invalid` and `aria-describedby` to form inputs
- Add skip-to-content link for keyboard users
- Add screen reader announcements for form errors
- Improve focus visible styles
- Add proper roles and landmarks where missing

**Files to modify**:
- `src/routes/contact.tsx`
- `src/components/Layout.tsx`
- `src/app.css`

**Estimated complexity**: Medium

## Priority 2: Enhancement Features

### 2.1 Testing Infrastructure
**Current Issue**: No tests exist in the project.

**Implementation Tasks**:
- Add Vitest for unit testing
- Add testing-library/solid for component testing
- Create tests for:
  - Form validation logic
  - Component rendering
  - Navigation behavior
- Add Playwright for E2E testing (optional)

**New files to create**:
- `vitest.config.ts`
- `src/routes/__tests__/contact.test.tsx`
- `src/components/__tests__/Layout.test.tsx`

**Package additions**:
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@solidjs/testing-library": "^0.8.0",
    "jsdom": "^23.0.0"
  }
}
```

**Estimated complexity**: Medium-High

### 2.2 Error Boundary Implementation
**Current Issue**: No error boundaries to handle runtime errors gracefully.

**Implementation Tasks**:
- Create an ErrorBoundary component using Solid's `ErrorBoundary`
- Add fallback UI for error states
- Implement error logging (console or external service)
- Wrap route components with error boundaries

**New files to create**:
- `src/components/ErrorBoundary.tsx`
- `src/components/ErrorBoundary.module.css`

**Files to modify**:
- `src/app.tsx`

**Estimated complexity**: Low-Medium

### 2.3 SEO Enhancements
**Current Issue**: Basic meta tags only via `<Title>` component.

**Implementation Tasks**:
- Add OpenGraph meta tags for social sharing
- Add Twitter Card meta tags
- Add structured data (JSON-LD) for organization/contact
- Add canonical URLs
- Create a proper sitemap

**Files to modify**:
- `src/routes/index.tsx`
- `src/routes/features.tsx`
- `src/routes/contact.tsx`

**New files to create**:
- `src/components/SEO.tsx` (reusable SEO component)

**Estimated complexity**: Low

## Priority 3: Nice-to-Have Features

### 3.1 Loading States & Skeleton Loaders
**Implementation Tasks**:
- Add skeleton loader components
- Implement suspense boundaries with loading fallbacks
- Add page transition animations

**Estimated complexity**: Medium

### 3.2 Dark Mode Support
**Implementation Tasks**:
- Add dark mode color tokens
- Create theme toggle component
- Persist preference to localStorage
- Respect system preference

**Files to modify**:
- `src/app.css` (add dark mode variables)
- `src/components/Layout.tsx` (add toggle)

**Estimated complexity**: Medium

### 3.3 Contact Form Backend Integration
**Current Issue**: Form submission is simulated with setTimeout.

**Implementation Tasks**:
- Create server action for form handling
- Add proper error handling for submission failures
- Integrate with email service (SendGrid, Resend, etc.)
- Add rate limiting

**Files to modify**:
- `src/routes/contact.tsx`

**New files to create**:
- `src/server/contact.ts` (server action)

**Estimated complexity**: Medium-High

### 3.4 Animation & Micro-interactions
**Implementation Tasks**:
- Add page transition animations
- Add hover animations on cards
- Add scroll-triggered animations for sections
- Add success animation for form submission

**Estimated complexity**: Medium

## Implementation Order Recommendation

For subsequent agents in the pipeline, here is the recommended order:

### Agent 2: Mobile Navigation & Basic Accessibility
1. Implement hamburger menu for mobile
2. Add skip-to-content link
3. Add ARIA attributes to form

### Agent 3: Error Handling & SEO
1. Implement ErrorBoundary component
2. Create SEO component with OpenGraph tags
3. Update all pages with proper meta tags

### Agent 4: Testing & Polish
1. Set up Vitest configuration
2. Write unit tests for form validation
3. Write component tests for Layout
4. Final accessibility audit and fixes

## Code Snippets for Reference

### Mobile Menu Toggle (Layout.tsx)
```tsx
const [menuOpen, setMenuOpen] = createSignal(false);

// In JSX:
<button 
  class={styles.menuToggle}
  onClick={() => setMenuOpen(!menuOpen())}
  aria-expanded={menuOpen()}
  aria-label={menuOpen() ? "Close menu" : "Open menu"}
>
  <span class={styles.menuIcon}></span>
</button>
```

### ARIA Error Handling (contact.tsx)
```tsx
<input
  id="email"
  aria-invalid={!!errors().email}
  aria-describedby={errors().email ? "email-error" : undefined}
  // ... other props
/>
<Show when={errors().email}>
  <span id="email-error" class={styles.errorMessage} role="alert">
    {errors().email}
  </span>
</Show>
```

### Error Boundary Component
```tsx
import { ErrorBoundary as SolidErrorBoundary, Component, JSX } from "solid-js";

const ErrorFallback: Component<{ error: Error; reset: () => void }> = (props) => (
  <div class="error-container">
    <h2>Something went wrong</h2>
    <p>{props.error.message}</p>
    <button onClick={props.reset}>Try again</button>
  </div>
);

export const AppErrorBoundary: Component<{ children: JSX.Element }> = (props) => (
  <SolidErrorBoundary fallback={(err, reset) => <ErrorFallback error={err} reset={reset} />}>
    {props.children}
  </SolidErrorBoundary>
);
```

## Testing Notes

When implementing tests, focus on:
1. **Form Validation**: Test email regex, required fields, character limits
2. **Component Rendering**: Verify correct elements are rendered
3. **Navigation**: Test active states, link destinations
4. **Accessibility**: Use testing-library queries that enforce a11y

## Summary

The Terra webapp is well-built with a solid foundation. The main areas for improvement are:
1. Mobile navigation experience
2. Accessibility compliance
3. Testing coverage
4. Error handling resilience

Each subsequent agent should focus on their assigned priority level and commit changes incrementally with clear commit messages.
