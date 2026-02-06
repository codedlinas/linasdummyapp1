# SolidStart Webapp - Detailed File Structure

## Complete Directory Tree

```
/workspace/
│
├── public/                          # Static assets
│   └── favicon.ico
│
├── src/                             # Source code
│   │
│   ├── routes/                      # File-based routing (SolidStart convention)
│   │   ├── index.tsx                # Route: / (Landing page)
│   │   ├── features.tsx             # Route: /features (Features page)
│   │   └── contact.tsx              # Route: /contact (Contact page)
│   │
│   ├── components/                  # Reusable UI components
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx           # Top navigation bar
│   │   │   ├── Footer.tsx           # Bottom footer
│   │   │   └── Layout.tsx           # Main layout wrapper (includes Header + Footer)
│   │   │
│   │   ├── home/                    # Landing page specific components
│   │   │   └── Hero.tsx             # Hero section with headline, subheadline, CTA
│   │   │
│   │   ├── features/                # Features page specific components
│   │   │   ├── FeatureCard.tsx      # Single feature card component
│   │   │   └── FeatureGrid.tsx      # Grid container for feature cards
│   │   │
│   │   └── contact/                 # Contact page specific components
│   │       ├── ContactForm.tsx      # Form component with validation logic
│   │       └── FormField.tsx        # Reusable form field with label/error
│   │
│   ├── styles/                      # Styling
│   │   ├── global.css               # Global styles, reset, base typography
│   │   └── theme.css                # CSS custom properties (color palette, spacing)
│   │
│   ├── utils/                       # Utility functions
│   │   └── validation.ts            # Form validation functions
│   │
│   ├── types/                       # TypeScript definitions
│   │   └── index.ts                 # Shared types and interfaces
│   │
│   ├── app.tsx                      # App component (routes container)
│   ├── entry-client.tsx             # Client-side entry point
│   ├── entry-server.tsx             # Server-side entry point
│   └── root.tsx                     # Root component with HTML structure
│
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
├── ARCHITECTURE.md                  # Architecture documentation (this file structure)
├── FILE_STRUCTURE.md                # Detailed file breakdown
└── README.md                        # Project overview and setup instructions
```

## File Responsibilities

### Routes (Pages)

#### `src/routes/index.tsx`
- Landing page component
- Imports and renders Hero component
- Wrapped by Layout

#### `src/routes/features.tsx`
- Features page component
- Imports and renders FeatureGrid
- Wrapped by Layout

#### `src/routes/contact.tsx`
- Contact page component
- Imports and renders ContactForm
- Wrapped by Layout

### Components

#### Layout Components

**`src/components/layout/Header.tsx`**
- Site navigation
- Logo/brand name
- Links to all pages (Home, Features, Contact)
- Uses SolidStart `<A>` component for routing
- Sticky/fixed positioning
- Mobile responsive

**`src/components/layout/Footer.tsx`**
- Copyright information
- Optional: social links, site map
- Consistent across all pages

**`src/components/layout/Layout.tsx`**
- Wrapper component
- Renders: Header + children + Footer
- Provides consistent page structure

#### Home Components

**`src/components/home/Hero.tsx`**
- Main headline (h1)
- Subheadline (p)
- CTA button linking to /contact
- Background styling
- Centered content layout

#### Features Components

**`src/components/features/FeatureCard.tsx`**
Props:
- `icon`: SVG icon component
- `title`: string
- `description`: string

Renders:
- Icon at the top
- Title (h3)
- Description text
- Card styling with hover effects

**`src/components/features/FeatureGrid.tsx`**
- Container for 6 FeatureCard components
- CSS Grid layout
- Responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Gap spacing between cards

#### Contact Components

**`src/components/contact/ContactForm.tsx`**
State:
- Form values (name, email, message)
- Validation errors
- Submission status

Functions:
- `handleInputChange`: Updates form state
- `handleBlur`: Triggers validation
- `handleSubmit`: Validates and processes form
- Form validation using utils/validation.ts

Renders:
- Three FormField components
- Submit button
- Success/error messages

**`src/components/contact/FormField.tsx`**
Props:
- `label`: string
- `name`: string
- `type`: "text" | "email" | "textarea"
- `value`: string
- `error`: string | undefined
- `onChange`: function
- `onBlur`: function

Renders:
- Label element
- Input or Textarea
- Error message (if present)
- Proper ARIA attributes

### Styles

**`src/styles/theme.css`**
CSS Custom Properties:
```css
:root {
  /* Colors */
  --color-primary: #D97757;
  --color-secondary: #E8B17A;
  --color-accent: #C46B3E;
  --color-background: #FAF7F2;
  --color-surface: #FFFFFF;
  --color-text-primary: #2D2520;
  --color-text-secondary: #6B5A52;
  --color-success: #7A9E7E;
  --color-error: #C85450;
  
  /* Spacing */
  --space-1: 0.5rem;   /* 8px */
  --space-2: 1rem;     /* 16px */
  --space-3: 1.5rem;   /* 24px */
  --space-4: 2rem;     /* 32px */
  --space-6: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-12: 6rem;    /* 96px */
  
  /* Typography */
  --font-body: 'Inter', system-ui, sans-serif;
  --font-heading: system-ui, sans-serif;
  
  /* Breakpoints referenced in media queries */
  --breakpoint-sm: 640px;
  --breakpoint-md: 1024px;
}
```

**`src/styles/global.css`**
- CSS reset/normalize
- Base typography styles
- Default link styles
- Focus states
- Common utility classes

### Utils

**`src/utils/validation.ts`**
Exports:
```typescript
validateName(name: string): string | undefined
validateEmail(email: string): string | undefined
validateMessage(message: string): string | undefined
validateForm(values: FormValues): ValidationErrors
```

### Types

**`src/types/index.ts`**
```typescript
export interface FeatureData {
  icon: Component;
  title: string;
  description: string;
}

export interface FormValues {
  name: string;
  email: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'textarea';
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}
```

### Configuration Files

**`package.json`**
Dependencies:
- solid-js
- @solidjs/start
- @solidjs/router
- vinxi

Dev Dependencies:
- typescript
- vite
- @types/node

Scripts:
- `dev`: Start development server
- `build`: Build for production
- `start`: Start production server

**`tsconfig.json`**
- Strict mode enabled
- JSX preserve for SolidJS
- Module resolution: bundler
- Target: ES2020+

**`vite.config.ts`**
- SolidStart plugin configuration
- Build optimizations
- Dev server settings

## Component Import Flow

### Landing Page (/)
```
index.tsx
  → Layout
    → Header
    → Hero (page content)
    → Footer
```

### Features Page (/features)
```
features.tsx
  → Layout
    → Header
    → FeatureGrid (page content)
      → FeatureCard × 6
    → Footer
```

### Contact Page (/contact)
```
contact.tsx
  → Layout
    → Header
    → ContactForm (page content)
      → FormField (name)
      → FormField (email)
      → FormField (message)
    → Footer
```

## Data Flow

### Contact Form
1. User types in FormField → `onChange` updates ContactForm state
2. User leaves field → `onBlur` triggers validation
3. Validation function from `utils/validation.ts` returns error or undefined
4. Error state updates → FormField displays error message
5. User submits → All fields validated
6. If valid → Success message displayed
7. If invalid → Focus first error field

## Styling Strategy

### Approach
- Plain CSS with CSS Modules (or scoped styles)
- CSS custom properties for theming
- Mobile-first responsive design
- No CSS frameworks (Tailwind, Bootstrap, etc.)
- Minimal, semantic class names

### File Naming
- Component styles can be co-located: `Hero.tsx` + `Hero.module.css`
- Or use inline styles for small components
- Global theme variables in `theme.css`

## Build Output

When built for production:
```
dist/
├── client/              # Client-side assets
│   ├── assets/          # JS and CSS bundles
│   └── index.html       # HTML shell
└── server/              # Server-side code
    └── index.mjs        # SSR server
```

## Development Workflow

1. `npm install` - Install dependencies
2. `npm run dev` - Start dev server at http://localhost:3000
3. Edit files - HMR updates automatically
4. `npm run build` - Build for production
5. `npm start` - Run production build locally
