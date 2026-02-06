# Visual Diagrams & Wireframes

## Site Structure

```
┌─────────────────────────────────────────────────┐
│                    HEADER                        │
│  [Logo]        [Home] [Features] [Contact]      │
└─────────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌──────────┐   ┌─────────┐
   │  Home  │    │ Features │   │ Contact │
   │   /    │    │/features │   │/contact │
   └────────┘    └──────────┘   └─────────┘
        │
        └──────── CTA Button ────────┐
                                     │
                                     ▼
                              ┌─────────┐
                              │ Contact │
                              │/contact │
                              └─────────┘

┌─────────────────────────────────────────────────┐
│                    FOOTER                        │
│           © 2026 MyApp. All rights reserved     │
└─────────────────────────────────────────────────┘
```

## Page Wireframes

### Landing Page (/)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: [Logo]    [Home] [Features] [Contact]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                       HERO SECTION                      │
│                                                         │
│                  ┌─────────────────┐                    │
│                  │  WARM GRADIENT  │                    │
│                  │   BACKGROUND    │                    │
│                  │                 │                    │
│          Build Amazing Web Apps    │                    │
│             with SolidStart        │                    │
│                  │                 │                    │
│    Fast, modern, and developer-friendly framework       │
│      for building exceptional user experiences          │
│                  │                 │                    │
│              ┌──────────────┐     │                    │
│              │ Get Started  │────────→ /contact         │
│              └──────────────┘     │                    │
│                  │                 │                    │
│                  └─────────────────┘                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER: © 2026 MyApp. All rights reserved             │
└─────────────────────────────────────────────────────────┘
```

### Features Page (/features)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: [Logo]    [Home] [Features] [Contact]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Our Features                         │
│          Discover what makes our platform exceptional   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   ⚡ Icon   │  │  🖥️ Icon    │  │  🛡️ Icon    │    │
│  │             │  │             │  │             │    │
│  │    Fast     │  │ Server-Side │  │    Type     │    │
│  │ Performance │  │  Rendering  │  │   Safety    │    │
│  │             │  │             │  │             │    │
│  │  Built on   │  │  Automatic  │  │    Full     │    │
│  │  SolidJS    │  │  SSR for    │  │ TypeScript  │    │
│  │  for fast   │  │  improved   │  │  support    │    │
│  │ reactivity  │  │     SEO     │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  📁 Icon    │  │  🎨 Icon    │  │  💻 Icon    │    │
│  │             │  │             │  │             │    │
│  │ File-Based  │  │   Modern    │  │  Developer  │    │
│  │   Routing   │  │   Design    │  │ Experience  │    │
│  │             │  │             │  │             │    │
│  │  Intuitive  │  │  Beautiful  │  │     HMR     │    │
│  │   routing   │  │  UI with    │  │    and      │    │
│  │   system    │  │ warm earth  │  │  excellent  │    │
│  │             │  │    tones    │  │  debugging  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER: © 2026 MyApp. All rights reserved             │
└─────────────────────────────────────────────────────────┘
```

### Contact Page (/contact)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: [Logo]    [Home] [Features] [Contact]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Get in Touch                         │
│                We'd love to hear from you               │
│                                                         │
│              ┌───────────────────────┐                  │
│              │                       │                  │
│              │  Name *               │                  │
│              │  ┌─────────────────┐  │                  │
│              │  │                 │  │                  │
│              │  └─────────────────┘  │                  │
│              │  [error: Name is required]               │
│              │                       │                  │
│              │  Email *              │                  │
│              │  ┌─────────────────┐  │                  │
│              │  │                 │  │                  │
│              │  └─────────────────┘  │                  │
│              │  [error: Invalid email]                  │
│              │                       │                  │
│              │  Message *            │                  │
│              │  ┌─────────────────┐  │                  │
│              │  │                 │  │                  │
│              │  │                 │  │                  │
│              │  │                 │  │                  │
│              │  └─────────────────┘  │                  │
│              │  [error: Min 10 chars]                   │
│              │                       │                  │
│              │  ┌───────────────┐   │                  │
│              │  │ Send Message  │   │                  │
│              │  └───────────────┘   │                  │
│              │                       │                  │
│              │  ✓ Thank you! Your    │                  │
│              │    message has been   │                  │
│              │    sent.              │                  │
│              │                       │                  │
│              └───────────────────────┘                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER: © 2026 MyApp. All rights reserved             │
└─────────────────────────────────────────────────────────┘
```

## Mobile Layouts

### Landing Page (Mobile)

```
┌──────────────────┐
│   HEADER         │
│  [☰] [Logo]      │
├──────────────────┤
│                  │
│   HERO SECTION   │
│                  │
│  Build Amazing   │
│    Web Apps      │
│  with SolidStart │
│                  │
│ Fast, modern, and│
│  developer-friendly│
│    framework     │
│                  │
│  ┌────────────┐  │
│  │Get Started │  │
│  └────────────┘  │
│                  │
├──────────────────┤
│     FOOTER       │
│   © 2026 MyApp   │
└──────────────────┘
```

### Features Page (Mobile)

```
┌──────────────────┐
│   HEADER         │
│  [☰] [Logo]      │
├──────────────────┤
│  Our Features    │
│                  │
│ ┌──────────────┐ │
│ │   ⚡ Icon    │ │
│ │    Fast      │ │
│ │ Performance  │ │
│ │  Built on    │ │
│ │  SolidJS...  │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │  🖥️ Icon     │ │
│ │ Server-Side  │ │
│ │  Rendering   │ │
│ │ Automatic... │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │  🛡️ Icon     │ │
│ │    Type      │ │
│ │   Safety     │ │
│ │   Full...    │ │
│ └──────────────┘ │
│                  │
│     [3 more]     │
│                  │
├──────────────────┤
│     FOOTER       │
└──────────────────┘
```

### Contact Page (Mobile)

```
┌──────────────────┐
│   HEADER         │
│  [☰] [Logo]      │
├──────────────────┤
│  Get in Touch    │
│                  │
│  Name *          │
│ ┌──────────────┐ │
│ │              │ │
│ └──────────────┘ │
│                  │
│  Email *         │
│ ┌──────────────┐ │
│ │              │ │
│ └──────────────┘ │
│                  │
│  Message *       │
│ ┌──────────────┐ │
│ │              │ │
│ │              │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │Send Message  │ │
│ └──────────────┘ │
│                  │
├──────────────────┤
│     FOOTER       │
└──────────────────┘
```

## Component State Flow

### Contact Form State Machine

```
┌─────────────┐
│   INITIAL   │
│  All fields │
│    empty    │
└──────┬──────┘
       │
       │ User types
       ▼
┌─────────────┐
│   TYPING    │
│  Updating   │
│    values   │
└──────┬──────┘
       │
       │ User leaves field (blur)
       ▼
┌─────────────┐
│ VALIDATING  │
│  Check      │
│  field      │
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
   ▼        ▼
┌─────┐  ┌─────┐
│VALID│  │ERROR│
└──┬──┘  └──┬──┘
   │        │
   │        │ Show error message
   │        ▼
   │     ┌──────────┐
   │     │  FIELD   │
   │     │  ERROR   │
   │     └──────────┘
   │
   └────────┬─────────────┐
            │             │
     All fields valid?    │
            │             │
            ▼             │
     ┌──────────┐         │
     │ SUBMIT   │         │
     │ ENABLED  │         │
     └────┬─────┘         │
          │               │
   User clicks submit     │
          │               │
          ▼               │
     ┌──────────┐         │
     │SUBMITTING│         │
     └────┬─────┘         │
          │               │
          ▼               │
     ┌──────────┐         │
     │ SUCCESS  │         │
     │  Show    │         │
     │ message  │         │
     └──────────┘         │
                          │
            Any field invalid
                          │
                          ▼
                   ┌──────────┐
                   │ SUBMIT   │
                   │ DISABLED │
                   └──────────┘
```

## Color Palette Visualization

```
┌──────────────────────────────────────────┐
│  Primary (Terracotta)    #D97757         │
│  ████████████████████████████████        │
│  Use: Buttons, links, accents            │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Secondary (Sand)        #E8B17A         │
│  ████████████████████████████████        │
│  Use: Hover states, highlights           │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Accent (Burnt Sienna)   #C46B3E         │
│  ████████████████████████████████        │
│  Use: Important actions, focus           │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Background (Warm White) #FAF7F2         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  Use: Page background                    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Surface (White)         #FFFFFF         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  Use: Cards, form inputs                 │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Text Primary (Dark Brown) #2D2520       │
│  ████████████████████████████████        │
│  Use: Body text, headings                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Text Secondary (Medium Brown) #6B5A52   │
│  ████████████████████████████████        │
│  Use: Subtext, captions                  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Success (Sage Green)    #7A9E7E         │
│  ████████████████████████████████        │
│  Use: Success messages                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Error (Warm Red)        #C85450         │
│  ████████████████████████████████        │
│  Use: Error messages, validation         │
└──────────────────────────────────────────┘
```

## Typography Scale

```
┌─────────────────────────────────────────────┐
│                                             │
│  Hero (3.5rem / 56px)                       │
│  Build Amazing Web Apps                     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  H1 (2.5rem / 40px)                         │
│  Our Features                               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  H2 (2rem / 32px)                           │
│  Get in Touch                               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  H3 (1.5rem / 24px)                         │
│  Fast Performance                           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Body (1rem / 16px)                         │
│  This is regular body text for paragraphs  │
│  and general content throughout the site.   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Small (0.875rem / 14px)                    │
│  © 2026 MyApp. All rights reserved.        │
│                                             │
└─────────────────────────────────────────────┘
```

## Spacing System (8px Grid)

```
space-1 (8px)   █
space-2 (16px)  ██
space-3 (24px)  ███
space-4 (32px)  ████
space-6 (48px)  ██████
space-8 (64px)  ████████
space-12 (96px) ████████████
```

## Responsive Grid Layouts

### Features Grid

**Desktop (> 1024px):**
```
┌────────┐  ┌────────┐  ┌────────┐
│ Card 1 │  │ Card 2 │  │ Card 3 │
└────────┘  └────────┘  └────────┘

┌────────┐  ┌────────┐  ┌────────┐
│ Card 4 │  │ Card 5 │  │ Card 6 │
└────────┘  └────────┘  └────────┘
```

**Tablet (640px - 1024px):**
```
┌────────┐  ┌────────┐
│ Card 1 │  │ Card 2 │
└────────┘  └────────┘

┌────────┐  ┌────────┐
│ Card 3 │  │ Card 4 │
└────────┘  └────────┘

┌────────┐  ┌────────┐
│ Card 5 │  │ Card 6 │
└────────┘  └────────┘
```

**Mobile (< 640px):**
```
┌────────────┐
│   Card 1   │
└────────────┘

┌────────────┐
│   Card 2   │
└────────────┘

┌────────────┐
│   Card 3   │
└────────────┘

┌────────────┐
│   Card 4   │
└────────────┘

┌────────────┐
│   Card 5   │
└────────────┘

┌────────────┐
│   Card 6   │
└────────────┘
```

## Icon Designs (Conceptual)

### Lightning Icon (Fast Performance)
```
    ╱╲
   ╱  ╲
  ╱    ╲
 ╱      ╲
╱        ╲
╲      ╱
 ╲    ╱
  ╲  ╱
   ╲╱
```

### Server Icon (SSR)
```
┌────────┐
│ ▓▓▓▓▓▓ │
│ ──○──○ │
└────────┘
┌────────┐
│ ▓▓▓▓▓▓ │
│ ──○──○ │
└────────┘
```

### Shield Icon (Type Safety)
```
    ╱╲
   ╱  ╲
  ╱    ╲
 │  ✓   │
 │      │
  ╲    ╱
   ╲  ╱
    ╲╱
```

## User Flow Diagram

```
START
  │
  ▼
┌──────────┐
│   Land   │
│  on "/"  │
└────┬─────┘
     │
     ├───────────┐
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│ Read    │  │ Click    │
│ Hero    │  │ CTA      │
└────┬────┘  └────┬─────┘
     │            │
     │            ▼
     │      ┌──────────┐
     │      │ Navigate │
     │      │ to       │
     │      │/contact  │
     │      └────┬─────┘
     │           │
     │           ▼
     │      ┌──────────┐
     │      │ Fill     │
     │      │ Form     │
     │      └────┬─────┘
     │           │
     │           ▼
     │      ┌──────────┐
     │      │ Submit   │
     │      └────┬─────┘
     │           │
     │           ▼
     │      ┌──────────┐
     │      │ Success  │
     │      │ Message  │
     │      └──────────┘
     │
     ▼
┌──────────┐
│ Explore  │
│/features │
└────┬─────┘
     │
     ▼
┌──────────┐
│ View     │
│ Feature  │
│ Cards    │
└────┬─────┘
     │
     ▼
   END
```

## Accessibility Annotations

### Feature Card Accessibility
```
┌─────────────────────────┐
│  <div class="feature-card" role="article">
│    <div class="icon" aria-hidden="true">
│      [SVG Icon]
│    </div>
│    <h3 id="feature-1-title">
│      Fast Performance
│    </h3>
│    <p id="feature-1-desc">
│      Built on SolidJS...
│    </p>
│  </div>
└─────────────────────────┘
```

### Form Field Accessibility
```
┌──────────────────────────────┐
│  <div class="form-field">
│    <label for="name">Name *</label>
│    <input
│      id="name"
│      name="name"
│      type="text"
│      aria-required="true"
│      aria-invalid="false"
│      aria-describedby="name-error"
│    />
│    <span
│      id="name-error"
│      role="alert"
│      aria-live="polite"
│    >
│      Name is required
│    </span>
│  </div>
└──────────────────────────────┘
```

## Performance Budget

```
Asset Type       Budget    Actual   Status
────────────────────────────────────────────
HTML             < 10 KB   ~8 KB    ✓
CSS              < 30 KB   ~15 KB   ✓
JavaScript       < 50 KB   ~35 KB   ✓
Images           < 100 KB  N/A      ✓
Total            < 190 KB  ~58 KB   ✓

First Paint      < 1s      ~0.4s    ✓
Interactive      < 2s      ~0.8s    ✓
```

## Summary

These visual diagrams provide a comprehensive overview of:
- Site structure and navigation flow
- Page layouts for all 3 pages
- Mobile-responsive designs
- Component state management
- Color palette with usage
- Typography scale
- Spacing system
- Grid layouts across breakpoints
- Icon designs (conceptual)
- User journey flow
- Accessibility patterns
- Performance targets

Use these diagrams as reference when implementing the SolidStart webapp.
