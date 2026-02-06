# Component Hierarchy

## Visual Component Tree

```
App Root (root.tsx)
│
├── Router (@solidjs/router)
│   │
│   └── FileRoutes
│       │
│       ├── Route: / (index.tsx)
│       │   └── Layout
│       │       ├── Header
│       │       │   ├── Brand/Logo
│       │       │   └── Navigation
│       │       │       ├── <A href="/">Home</A>
│       │       │       ├── <A href="/features">Features</A>
│       │       │       └── <A href="/contact">Contact</A>
│       │       │
│       │       ├── [Page Content: Hero]
│       │       │   ├── <h1> Headline
│       │       │   ├── <p> Subheadline
│       │       │   └── <A> CTA Button → /contact
│       │       │
│       │       └── Footer
│       │           └── Copyright Text
│       │
│       ├── Route: /features (features.tsx)
│       │   └── Layout
│       │       ├── Header
│       │       │   └── [same as above]
│       │       │
│       │       ├── [Page Content: FeatureGrid]
│       │       │   ├── FeatureCard #1 (Fast Performance)
│       │       │   │   ├── Icon (SVG: Lightning)
│       │       │   │   ├── Title (h3)
│       │       │   │   └── Description (p)
│       │       │   │
│       │       │   ├── FeatureCard #2 (Server-Side Rendering)
│       │       │   │   ├── Icon (SVG: Server)
│       │       │   │   ├── Title (h3)
│       │       │   │   └── Description (p)
│       │       │   │
│       │       │   ├── FeatureCard #3 (Type Safety)
│       │       │   │   ├── Icon (SVG: Shield)
│       │       │   │   ├── Title (h3)
│       │       │   │   └── Description (p)
│       │       │   │
│       │       │   ├── FeatureCard #4 (File-Based Routing)
│       │       │   │   ├── Icon (SVG: Folder)
│       │       │   │   ├── Title (h3)
│       │       │   │   └── Description (p)
│       │       │   │
│       │       │   ├── FeatureCard #5 (Modern Design)
│       │       │   │   ├── Icon (SVG: Palette)
│       │       │   │   ├── Title (h3)
│       │       │   │   └── Description (p)
│       │       │   │
│       │       │   └── FeatureCard #6 (Developer Experience)
│       │       │       ├── Icon (SVG: Code)
│       │       │       ├── Title (h3)
│       │       │       └── Description (p)
│       │       │
│       │       └── Footer
│       │           └── [same as above]
│       │
│       └── Route: /contact (contact.tsx)
│           └── Layout
│               ├── Header
│               │   └── [same as above]
│               │
│               ├── [Page Content: ContactForm]
│               │   ├── <form>
│               │   │   ├── FormField (name)
│               │   │   │   ├── <label for="name">
│               │   │   │   ├── <input type="text">
│               │   │   │   └── <span class="error"> [conditional]
│               │   │   │
│               │   │   ├── FormField (email)
│               │   │   │   ├── <label for="email">
│               │   │   │   ├── <input type="email">
│               │   │   │   └── <span class="error"> [conditional]
│               │   │   │
│               │   │   ├── FormField (message)
│               │   │   │   ├── <label for="message">
│               │   │   │   ├── <textarea>
│               │   │   │   └── <span class="error"> [conditional]
│               │   │   │
│               │   │   └── <button type="submit">
│               │   │
│               │   └── <div class="success-message"> [conditional]
│               │
│               └── Footer
│                   └── [same as above]
```

## Component Details

### Shared Components (Used Across All Pages)

#### Layout Component
**File**: `src/components/layout/Layout.tsx`

**Purpose**: Provides consistent page structure

**Props**:
```typescript
interface LayoutProps {
  children: JSX.Element;
}
```

**Structure**:
```tsx
<div class="layout">
  <Header />
  <main class="main-content">
    {children}
  </main>
  <Footer />
</div>
```

**Responsibilities**:
- Wraps all page content
- Ensures Header and Footer appear on every page
- Provides main content container
- Sets up page-level styling

---

#### Header Component
**File**: `src/components/layout/Header.tsx`

**Purpose**: Site navigation

**Props**: None

**State**: None (stateless)

**Structure**:
```tsx
<header class="header">
  <div class="container">
    <div class="brand">
      <A href="/">MyApp</A>
    </div>
    <nav class="nav">
      <A href="/" end activeClass="active">Home</A>
      <A href="/features" activeClass="active">Features</A>
      <A href="/contact" activeClass="active">Contact</A>
    </nav>
  </div>
</header>
```

**Responsibilities**:
- Brand/logo display
- Navigation links
- Active route highlighting
- Responsive menu (mobile-friendly)

---

#### Footer Component
**File**: `src/components/layout/Footer.tsx`

**Purpose**: Site footer

**Props**: None

**Structure**:
```tsx
<footer class="footer">
  <div class="container">
    <p>&copy; 2026 MyApp. All rights reserved.</p>
  </div>
</footer>
```

**Responsibilities**:
- Copyright notice
- Consistent footer across pages
- Optional: social links, sitemap

---

### Landing Page Components

#### Hero Component
**File**: `src/components/home/Hero.tsx`

**Purpose**: Main call-to-action section on landing page

**Props**: None

**Structure**:
```tsx
<section class="hero">
  <div class="hero-content">
    <h1 class="hero-headline">
      Build Amazing Web Apps with SolidStart
    </h1>
    <p class="hero-subheadline">
      Fast, modern, and developer-friendly framework
      for building exceptional user experiences
    </p>
    <A href="/contact" class="cta-button">
      Get Started
    </A>
  </div>
</section>
```

**Responsibilities**:
- Eye-catching headline
- Compelling subheadline
- Primary CTA button
- Hero section styling
- Responsive text sizing

---

### Features Page Components

#### FeatureGrid Component
**File**: `src/components/features/FeatureGrid.tsx`

**Purpose**: Container for feature cards

**Props**: None

**State**: Manages array of feature data

**Structure**:
```tsx
<div class="feature-grid">
  <For each={features()}>
    {(feature) => (
      <FeatureCard
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    )}
  </For>
</div>
```

**Data**:
```typescript
const features = [
  {
    icon: LightningIcon,
    title: "Fast Performance",
    description: "Built on SolidJS for blazing-fast reactivity"
  },
  // ... 5 more features
];
```

**Responsibilities**:
- Manages feature data
- Renders 6 FeatureCard components
- Grid layout (responsive)
- Consistent spacing

---

#### FeatureCard Component
**File**: `src/components/features/FeatureCard.tsx`

**Purpose**: Single feature display card

**Props**:
```typescript
interface FeatureCardProps {
  icon: Component;
  title: string;
  description: string;
}
```

**Structure**:
```tsx
<div class="feature-card">
  <div class="feature-icon">
    {props.icon}
  </div>
  <h3 class="feature-title">{props.title}</h3>
  <p class="feature-description">{props.description}</p>
</div>
```

**Responsibilities**:
- Display icon
- Show title
- Show description
- Card styling
- Hover effects

---

### Contact Page Components

#### ContactForm Component
**File**: `src/components/contact/ContactForm.tsx`

**Purpose**: Form with validation

**Props**: None

**State**:
```typescript
const [formValues, setFormValues] = createSignal({
  name: '',
  email: '',
  message: ''
});

const [errors, setErrors] = createSignal({
  name: undefined,
  email: undefined,
  message: undefined
});

const [touched, setTouched] = createSignal({
  name: false,
  email: false,
  message: false
});

const [submitted, setSubmitted] = createSignal(false);
```

**Methods**:
```typescript
handleChange(field: string, value: string): void
handleBlur(field: string): void
handleSubmit(e: Event): void
```

**Structure**:
```tsx
<form class="contact-form" onSubmit={handleSubmit}>
  <FormField
    label="Name"
    name="name"
    type="text"
    value={formValues().name}
    error={touched().name ? errors().name : undefined}
    onChange={(val) => handleChange('name', val)}
    onBlur={() => handleBlur('name')}
  />
  
  <FormField
    label="Email"
    name="email"
    type="email"
    value={formValues().email}
    error={touched().email ? errors().email : undefined}
    onChange={(val) => handleChange('email', val)}
    onBlur={() => handleBlur('email')}
  />
  
  <FormField
    label="Message"
    name="message"
    type="textarea"
    value={formValues().message}
    error={touched().message ? errors().message : undefined}
    onChange={(val) => handleChange('message', val)}
    onBlur={() => handleBlur('message')}
  />
  
  <button 
    type="submit" 
    class="submit-button"
    disabled={!isValid()}
  >
    Send Message
  </button>
  
  <Show when={submitted()}>
    <div class="success-message">
      Thank you! Your message has been sent.
    </div>
  </Show>
</form>
```

**Responsibilities**:
- Form state management
- Validation logic
- Error handling
- Submit handling
- Success message display

---

#### FormField Component
**File**: `src/components/contact/FormField.tsx`

**Purpose**: Reusable form input with label and error

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'textarea';
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
}
```

**Structure**:
```tsx
<div class="form-field" classList={{ 'has-error': !!props.error }}>
  <label for={props.name} class="form-label">
    {props.label}
  </label>
  
  <Show
    when={props.type === 'textarea'}
    fallback={
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        class="form-input"
        aria-invalid={!!props.error}
        aria-describedby={props.error ? `${props.name}-error` : undefined}
      />
    }
  >
    <textarea
      id={props.name}
      name={props.name}
      value={props.value}
      onInput={(e) => props.onChange(e.currentTarget.value)}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
      class="form-textarea"
      rows={5}
      aria-invalid={!!props.error}
      aria-describedby={props.error ? `${props.name}-error` : undefined}
    />
  </Show>
  
  <Show when={props.error}>
    <span id={`${props.name}-error`} class="form-error" role="alert">
      {props.error}
    </span>
  </Show>
</div>
```

**Responsibilities**:
- Render label
- Render input or textarea
- Show error messages
- Handle input/blur events
- Accessibility attributes
- Conditional styling

---

## Component Reusability

### Highly Reusable
- **Layout**: Used on all 3 pages
- **Header**: Used on all 3 pages (via Layout)
- **Footer**: Used on all 3 pages (via Layout)
- **FormField**: Used 3 times in ContactForm
- **FeatureCard**: Used 6 times in FeatureGrid

### Page-Specific
- **Hero**: Only on landing page
- **FeatureGrid**: Only on features page
- **ContactForm**: Only on contact page

## Data Flow Patterns

### Top-Down (Props)
```
Layout → children (page content)
FeatureGrid → FeatureCard (icon, title, description)
ContactForm → FormField (value, error, handlers)
```

### Bottom-Up (Events)
```
FormField → onChange/onBlur → ContactForm (updates state)
Header → <A> click → Router (navigation)
Hero → CTA click → Router (navigation to /contact)
```

### Sibling Communication
No direct sibling communication in this architecture. All communication goes through parent components.

## State Management

### Local Component State
- **ContactForm**: Form values, errors, touched fields, submission status
- **FeatureGrid**: Feature data array (could be static)

### No Global State
This simple app doesn't require:
- Redux/Zustand
- Context providers
- Global stores

All state is localized to components that need it.

## Component Composition Patterns

### Container/Presentational

**Container (Smart Components)**:
- ContactForm (manages form state and logic)
- FeatureGrid (manages feature data)

**Presentational (Dumb Components)**:
- FormField (receives props, renders UI)
- FeatureCard (receives props, renders UI)
- Hero (static content, no logic)
- Header (static navigation)
- Footer (static content)

### Layout Components
- Layout (wraps page content)
- Header (shared navigation)
- Footer (shared footer)

## Icon Components

SVG icons as components:

```typescript
// Can be inline in FeatureGrid or separate files
const LightningIcon: Component = () => (
  <svg width="48" height="48" viewBox="0 0 24 24">
    <path d="..." fill="currentColor" />
  </svg>
);
```

Icons needed:
1. Lightning (Fast Performance)
2. Server (SSR)
3. Shield (Type Safety)
4. Folder/Tree (Routing)
5. Palette (Design)
6. Code (DX)

## Accessibility Considerations

### Semantic HTML
- `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`
- Proper heading hierarchy (h1 → h2 → h3)

### ARIA Attributes
- `aria-invalid` on form inputs with errors
- `aria-describedby` linking errors to inputs
- `role="alert"` on error messages

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order

### Labels
- All inputs have associated labels
- Labels use `for` attribute matching input `id`

## Performance Optimization

### Code Splitting
- Each route automatically split by SolidStart
- Components lazy-loaded when route accessed

### Minimal Re-renders
- SolidJS fine-grained reactivity
- Only affected DOM nodes update
- No virtual DOM diffing

### Static Content
- Hero, Header, Footer are mostly static
- Minimal JavaScript for these components

## Testing Strategy

### Unit Tests
- Validation functions (utils/validation.ts)
- FormField component rendering
- FeatureCard prop handling

### Integration Tests
- ContactForm validation flow
- Navigation between routes
- Form submission

### E2E Tests
- Complete user journeys
- Cross-browser testing
- Accessibility audits

## Summary

This architecture features:
- **12 components** total
- **3 layout components** (shared)
- **1 landing component** (Hero)
- **2 features components** (Grid + Card)
- **2 contact components** (Form + Field)
- **Clear separation** of concerns
- **Reusable** patterns
- **Accessible** by default
- **Performant** design
