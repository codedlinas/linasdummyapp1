# SolidStart Webapp Architecture Plan

## Overview
A modern 3-page SolidStart webapp with warm earth tones design system.

## Tech Stack
- **Framework**: SolidStart (SolidJS meta-framework)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons (or similar lightweight icon library)
- **Form Validation**: Native SolidJS reactive primitives
- **TypeScript**: For type safety

---

## File Structure

```
/workspace
├── src/
│   ├── routes/
│   │   ├── index.tsx                 # Landing page (/)
│   │   ├── features.tsx              # Features page (/features)
│   │   └── contact.tsx               # Contact page (/contact)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── Footer.tsx            # Footer component
│   │   │   └── Layout.tsx            # Main layout wrapper
│   │   ├── landing/
│   │   │   ├── Hero.tsx              # Hero section with headline, subheadline, CTA
│   │   │   └── CTAButton.tsx         # Call-to-action button component
│   │   ├── features/
│   │   │   ├── FeatureCard.tsx       # Individual feature card
│   │   │   └── FeatureGrid.tsx       # 6-card grid container
│   │   └── contact/
│   │       ├── ContactForm.tsx       # Form with validation
│   │       └── FormField.tsx         # Reusable form input component
│   ├── lib/
│   │   ├── validation.ts             # Form validation utilities
│   │   └── constants.ts              # App constants (features data, etc.)
│   ├── styles/
│   │   └── global.css                # Global styles and Tailwind imports
│   └── root.tsx                      # Root component with providers
├── public/
│   └── favicon.ico
├── tailwind.config.js                # Tailwind configuration with earth tones
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## Component Hierarchy

### Page Components

#### 1. Landing Page (`/`)
```
routes/index.tsx
└── Layout
    └── Hero
        ├── Headline (h1)
        ├── Subheadline (p)
        └── CTAButton → navigates to /features
```

#### 2. Features Page (`/features`)
```
routes/features.tsx
└── Layout
    ├── Page Header (h1)
    └── FeatureGrid
        └── FeatureCard × 6
            ├── Icon
            ├── Title (h3)
            └── Description (p)
```

#### 3. Contact Page (`/contact`)
```
routes/contact.tsx
└── Layout
    ├── Page Header (h1)
    └── ContactForm
        ├── FormField (name)
        ├── FormField (email)
        ├── FormField (message - textarea)
        ├── Validation Messages
        └── Submit Button
```

### Shared Components

#### Layout (`components/layout/Layout.tsx`)
```
Layout
├── Header
│   └── Navigation Links (Home, Features, Contact)
├── main (children/page content)
└── Footer
    └── Copyright/info
```

---

## Routing Setup

SolidStart uses file-based routing in the `src/routes/` directory:

| Route       | File                  | Component      |
|-------------|-----------------------|----------------|
| `/`         | `routes/index.tsx`    | Landing Page   |
| `/features` | `routes/features.tsx` | Features Page  |
| `/contact`  | `routes/contact.tsx`  | Contact Page   |

**Navigation**: Implemented using `<A>` component from `@solidjs/router` for client-side navigation.

---

## Design System

### Color Palette (Warm Earth Tones)

```css
/* Primary Colors */
--terra-cotta: #E07856      /* Main CTA, accents */
--burnt-sienna: #C65D3B     /* Hover states, active */
--warm-sand: #F4E4D7        /* Light backgrounds */
--desert-clay: #D4A574      /* Secondary accents */

/* Neutral Colors */
--warm-cream: #FAF7F2       /* Page background */
--soft-beige: #E8DFD0       /* Card backgrounds */
--warm-gray: #A89B8F        /* Secondary text */
--charcoal: #3A3632         /* Primary text */

/* Semantic Colors */
--success-sage: #8B9D77     /* Success messages */
--warning-amber: #E8A44C    /* Warning states */
--error-rust: #B85042       /* Error states */
```

### Typography

```
Font Family: Inter (or similar modern sans-serif)

Headings:
- h1: 3.5rem (56px), font-weight: 700, line-height: 1.1
- h2: 2.5rem (40px), font-weight: 700, line-height: 1.2
- h3: 1.5rem (24px), font-weight: 600, line-height: 1.3

Body:
- Base: 1rem (16px), font-weight: 400, line-height: 1.6
- Large: 1.125rem (18px), font-weight: 400, line-height: 1.7
```

### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Component Styles

#### CTAButton
```
Background: terra-cotta (#E07856)
Text: warm-cream (#FAF7F2)
Padding: 1rem 2rem
Border-radius: 0.5rem
Font-size: 1.125rem
Font-weight: 600
Hover: burnt-sienna (#C65D3B)
Transition: all 200ms ease
```

#### FeatureCard
```
Background: soft-beige (#E8DFD0)
Border: 1px solid desert-clay (#D4A574)
Border-radius: 1rem
Padding: 2rem
Shadow: soft warm shadow
Hover: slight lift effect
Icon size: 3rem
Icon color: terra-cotta (#E07856)
```

#### FormField
```
Input background: warm-cream (#FAF7F2)
Border: 1px solid warm-gray (#A89B8F)
Border-radius: 0.5rem
Padding: 0.75rem 1rem
Focus border: terra-cotta (#E07856)
Error border: error-rust (#B85042)
```

---

## Features Data

### 6 Feature Cards

1. **Fast Performance**
   - Icon: Zap/Lightning
   - Description: "Built with SolidJS for lightning-fast reactivity and optimal performance"

2. **Modern Stack**
   - Icon: Code
   - Description: "Leveraging cutting-edge web technologies for a robust development experience"

3. **Type Safety**
   - Icon: Shield
   - Description: "Full TypeScript support ensuring code reliability and developer confidence"

4. **Responsive Design**
   - Icon: Smartphone
   - Description: "Beautiful on all devices with mobile-first responsive design principles"

5. **Developer Experience**
   - Icon: Heart
   - Description: "Intuitive APIs and excellent tooling for a delightful development workflow"

6. **SEO Optimized**
   - Icon: Search
   - Description: "Server-side rendering and meta tags for excellent search engine visibility"

---

## Form Validation Rules

### ContactForm Validation

**Name Field:**
- Required: ✓
- Min length: 2 characters
- Max length: 50 characters
- Pattern: Letters, spaces, hyphens only
- Error messages:
  - "Name is required"
  - "Name must be at least 2 characters"
  - "Name can only contain letters, spaces, and hyphens"

**Email Field:**
- Required: ✓
- Pattern: Valid email format (RFC 5322 simplified)
- Error messages:
  - "Email is required"
  - "Please enter a valid email address"

**Message Field:**
- Required: ✓
- Min length: 10 characters
- Max length: 500 characters
- Error messages:
  - "Message is required"
  - "Message must be at least 10 characters"
  - "Message cannot exceed 500 characters"

**Validation Behavior:**
- Real-time validation on blur
- Submit button disabled when form invalid
- Error messages display below fields in error-rust color
- Success state shows success message in success-sage color

---

## Responsive Breakpoints

```
Mobile:     < 640px   (sm)
Tablet:     640px+    (md: 768px+)
Desktop:    1024px+   (lg)
Wide:       1280px+   (xl)
```

### Responsive Behavior

**Hero Section:**
- Mobile: Stack vertically, centered text
- Desktop: Centered with max-width constraint

**Feature Grid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Contact Form:**
- Mobile: Full width with padding
- Desktop: Max-width 600px, centered

---

## Navigation Structure

**Header Navigation:**
- Logo/Brand (left) → links to `/`
- Navigation Links (right):
  - Home → `/`
  - Features → `/features`
  - Contact → `/contact`

**Mobile Navigation:**
- Hamburger menu on mobile
- Full-width overlay menu

---

## Implementation Notes

### SolidJS Specific

1. **Reactive Primitives:**
   - Use `createSignal` for form state
   - Use `createMemo` for computed validation states
   - Use `createEffect` for side effects

2. **Route Components:**
   - Each route exports a default component
   - Use `<Title>` from `@solidjs/meta` for page titles

3. **Form Handling:**
   - Client-side validation only (no server action required)
   - Use SolidJS event handlers (`onSubmit`, `onBlur`, `onInput`)

### Performance Optimizations

- Lazy load routes with `lazy()` if needed
- Optimize icon imports (tree-shaking)
- Use CSS containment for feature cards
- Minimize bundle size with proper tree-shaking

### Accessibility

- Semantic HTML5 elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management in forms
- Proper color contrast ratios (WCAG AA)

---

## Package Dependencies

```json
{
  "dependencies": {
    "solid-js": "^1.8.0",
    "@solidjs/router": "^0.13.0",
    "@solidjs/start": "^1.0.0",
    "vinxi": "latest"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Optional Dependencies
- `lucide-solid`: For icons
- `@solidjs/meta`: For meta tags and titles (likely included with SolidStart)

---

## Tailwind Configuration

```js
// tailwind.config.js
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'terra-cotta': '#E07856',
        'burnt-sienna': '#C65D3B',
        'warm-sand': '#F4E4D7',
        'desert-clay': '#D4A574',
        'warm-cream': '#FAF7F2',
        'soft-beige': '#E8DFD0',
        'warm-gray': '#A89B8F',
        'charcoal': '#3A3632',
        'success-sage': '#8B9D77',
        'warning-amber': '#E8A44C',
        'error-rust': '#B85042',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Development Workflow

1. **Setup:**
   ```bash
   npm create solid@latest
   # Select "SolidStart" template
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Development:**
   ```bash
   npm run dev
   ```

3. **Build:**
   ```bash
   npm run build
   ```

---

## State Management

### ContactForm State
```typescript
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface FormState {
  data: FormData;
  errors: FormErrors;
  touched: Set<keyof FormData>;
  isSubmitting: boolean;
  submitSuccess: boolean;
}
```

---

## User Interactions

### Landing Page
1. User lands on hero section
2. Reads headline and subheadline
3. Clicks CTA button → navigates to `/features`

### Features Page
1. User views 6 feature cards in grid
2. Can hover over cards (visual feedback)
3. Can navigate to contact page

### Contact Page
1. User fills out form fields
2. Real-time validation on blur
3. Submit button enables when valid
4. On submit: show success message
5. Form resets after successful submission

---

## Summary

This architecture provides:
- ✅ Clean file structure with separation of concerns
- ✅ Component-based architecture for reusability
- ✅ File-based routing with SolidStart conventions
- ✅ Warm earth tones design system
- ✅ Comprehensive validation strategy
- ✅ Responsive design patterns
- ✅ Type-safe TypeScript implementation
- ✅ Accessibility considerations
- ✅ Performance optimizations

The design moves away from typical blue/purple AI aesthetics toward warm, inviting earth tones that create a more organic and approachable user experience.
