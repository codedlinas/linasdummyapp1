# Terra - SolidStart Webapp

A beautifully crafted 3-page webapp built with SolidStart, featuring warm earth tones and modern design principles.

## Features

- **Modern Framework**: Built with SolidJS and SolidStart for reactive performance
- **Warm Design System**: Carefully curated earth tone palette (terra cotta, desert clay, warm sand)
- **Responsive Layout**: Mobile-first design that adapts to all screen sizes
- **Client-side Validation**: Real-time form validation with proper error handling
- **Fast Performance**: Code splitting and optimized loading
- **SEO Optimized**: Server-side rendering for better search engine visibility

## Pages

1. **Home** - Landing page with hero section and value propositions
2. **Features** - Comprehensive feature grid showcasing capabilities
3. **Contact** - Interactive form with client-side validation

## Tech Stack

- **Framework**: SolidStart
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Routing**: File-based routing
- **Build Tool**: Vinxi

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
src/
├── routes/               # File-based routes
│   ├── index.tsx        # Landing page
│   ├── features.tsx     # Features page
│   └── contact.tsx      # Contact page
├── components/          # Reusable components
│   └── Layout.tsx       # Main layout with navigation
├── app.tsx              # App root
├── app.css              # Global styles
├── entry-client.tsx     # Client entry point
└── entry-server.tsx     # Server entry point
```

## Design System

### Colors

- **Primary**: Terra Cotta (#E07856)
- **Primary Dark**: Burnt Sienna (#C65D3B)
- **Background**: Warm Cream (#FAF7F2)
- **Surface**: Warm Sand (#F4E4D7)
- **Text**: Charcoal (#3A3632)
- **Accent**: Desert Clay (#D4A574)

### Typography

- **Font**: System font stack for optimal performance
- **Scale**: Responsive type scale from 0.875rem to 3.5rem

### Spacing

- **System**: 8px base unit with consistent scale
- **Breakpoints**: Mobile-first (768px, 1024px)

## Form Validation

The contact form includes comprehensive client-side validation:

- **Required fields**: Name, Email, Subject, Message
- **Email format**: RFC-compliant email validation
- **Character limits**: Minimum lengths enforced
- **Real-time feedback**: Errors shown on blur and submission
- **Visual indicators**: Error states with helpful messages

## License

MIT
