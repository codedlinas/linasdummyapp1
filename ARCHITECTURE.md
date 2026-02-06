# SolidStart Webapp Architecture

## Overview
A modern 3-page SolidStart web application featuring warm earth tone design aesthetics, responsive layouts, and client-side form validation.

## Design System

### Color Palette (Warm Earth Tones)
- **Primary**: `#D97757` (Terracotta)
- **Secondary**: `#E8B17A` (Sand)
- **Accent**: `#C46B3E` (Burnt Sienna)
- **Background**: `#FAF7F2` (Warm White)
- **Surface**: `#FFFFFF` (White)
- **Text Primary**: `#2D2520` (Dark Brown)
- **Text Secondary**: `#6B5A52` (Medium Brown)
- **Success**: `#7A9E7E` (Sage Green)
- **Error**: `#C85450` (Warm Red)

### Typography
- **Headings**: System font stack with fallback to sans-serif
- **Body**: Inter, system-ui, sans-serif
- **Font Sizes**:
  - Hero: 3.5rem (mobile: 2.5rem)
  - H1: 2.5rem (mobile: 2rem)
  - H2: 2rem (mobile: 1.5rem)
  - H3: 1.5rem (mobile: 1.25rem)
  - Body: 1rem
  - Small: 0.875rem

### Spacing
- Base unit: 8px (0.5rem)
- Scale: 8, 16, 24, 32, 48, 64, 96px

## File Structure

```
/workspace
├── src/
│   ├── routes/
│   │   ├── index.tsx              # Landing page (/)
│   │   ├── features.tsx           # Features page (/features)
│   │   └── contact.tsx            # Contact page (/contact)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Navigation header
│   │   │   ├── Footer.tsx         # Site footer
│   │   │   └── Layout.tsx         # Main layout wrapper
│   │   ├── home/
│   │   │   └── Hero.tsx           # Hero section component
│   │   ├── features/
│   │   │   ├── FeatureCard.tsx    # Individual feature card
│   │   │   └── FeatureGrid.tsx    # Grid container for features
│   │   └── contact/
│   │       ├── ContactForm.tsx    # Contact form with validation
│   │       └── FormField.tsx      # Reusable form field component
│   ├── styles/
│   │   ├── global.css             # Global styles and CSS reset
│   │   └── theme.css              # Design system variables
│   ├── utils/
│   │   └── validation.ts          # Form validation utilities
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── app.tsx                    # App root component
│   ├── entry-client.tsx           # Client entry point
│   ├── entry-server.tsx           # Server entry point
│   └── root.tsx                   # Root component with providers
├── public/
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Component Hierarchy

### Page: Landing (/)
```
Layout
└── Hero
    ├── Headline (h1)
    ├── Subheadline (p)
    └── CTA Button (link to /contact)
```

### Page: Features (/features)
```
Layout
└── FeatureGrid
    └── FeatureCard (x6)
        ├── Icon (SVG)
        ├── Title (h3)
        └── Description (p)
```

### Page: Contact (/contact)
```
Layout
└── ContactForm
    ├── FormField (name)
    │   ├── Label
    │   ├── Input
    │   └── Error Message
    ├── FormField (email)
    │   ├── Label
    │   ├── Input
    │   └── Error Message
    ├── FormField (message)
    │   ├── Label
    │   ├── Textarea
    │   └── Error Message
    └── Submit Button
```

### Shared Components
```
Layout
├── Header
│   ├── Logo/Brand
│   └── Navigation
│       ├── Home Link
│       ├── Features Link
│       └── Contact Link
└── Footer
    └── Copyright Text
```

## Routing Setup

SolidStart uses file-based routing in the `src/routes/` directory:

- `/` → `src/routes/index.tsx` (Landing page)
- `/features` → `src/routes/features.tsx` (Features page)
- `/contact` → `src/routes/contact.tsx` (Contact page)

Navigation is handled through SolidStart's `<A>` component for client-side routing.

## Features List (6 Cards)

1. **Fast Performance**
   - Icon: Lightning bolt
   - Description: Built on SolidJS for blazing-fast reactivity and optimal performance

2. **Server-Side Rendering**
   - Icon: Server
   - Description: Automatic SSR for improved SEO and faster initial page loads

3. **Type Safety**
   - Icon: Shield with checkmark
   - Description: Full TypeScript support for catching errors before they happen

4. **File-Based Routing**
   - Icon: Folder tree
   - Description: Intuitive routing system that mirrors your file structure

5. **Modern Design**
   - Icon: Palette
   - Description: Beautiful UI with warm earth tones and responsive layouts

6. **Developer Experience**
   - Icon: Code brackets
   - Description: Hot module replacement and excellent debugging tools

## Form Validation Rules

### Contact Form
- **Name Field**:
  - Required
  - Minimum length: 2 characters
  - Maximum length: 50 characters
  - Pattern: Letters, spaces, hyphens only

- **Email Field**:
  - Required
  - Valid email format (RFC 5322 simplified)
  - Maximum length: 100 characters

- **Message Field**:
  - Required
  - Minimum length: 10 characters
  - Maximum length: 500 characters

### Validation Strategy
- Real-time validation on blur
- Show errors only after field interaction
- Disable submit button when form is invalid
- Clear, descriptive error messages
- Success state after submission

## Technology Stack

- **Framework**: SolidStart (latest)
- **Language**: TypeScript
- **Styling**: CSS Modules / Plain CSS
- **Build Tool**: Vite
- **Icons**: Inline SVG components
- **Validation**: Custom validation utilities

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
- Stack layouts vertically on mobile
- 2-column grid on tablet (features)
- 3-column grid on desktop (features)
- Hamburger menu for mobile navigation (optional enhancement)
- Touch-friendly button sizes (min 44px)

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast ratio ≥ 4.5:1
- Form labels properly associated
- Error messages linked to inputs

## Performance Considerations

- Minimal JavaScript bundle
- CSS loaded inline for critical styles
- Lazy loading for non-critical components
- Optimized images (if added later)
- No external dependencies for UI components

## Future Enhancements

- Dark mode toggle
- Form submission to backend API
- Success/confirmation page after contact
- Animated transitions between routes
- More detailed feature pages
- Blog or resources section
- Testimonials section on landing page
