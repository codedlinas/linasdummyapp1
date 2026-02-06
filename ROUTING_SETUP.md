# SolidStart Routing Setup

## Overview

SolidStart uses **file-based routing** similar to Next.js and SvelteKit. Routes are automatically created based on the file structure in the `src/routes/` directory.

## Route Configuration

### Route Mapping

| URL Path    | File Path                | Component | Description           |
|-------------|-------------------------|-----------|----------------------|
| `/`         | `src/routes/index.tsx`  | Landing   | Home/Landing page    |
| `/features` | `src/routes/features.tsx`| Features  | Features showcase    |
| `/contact`  | `src/routes/contact.tsx` | Contact   | Contact form         |

## File-Based Routing Details

### How It Works

1. **Automatic Route Generation**
   - Files in `src/routes/` automatically become routes
   - `index.tsx` maps to the root of its directory
   - Named files map to their filename

2. **Route Components**
   - Each route file exports a default component
   - Components are automatically code-split
   - Server-side rendered by default

### Route File Structure

#### `src/routes/index.tsx` - Landing Page
```typescript
import { Component } from 'solid-js';
import Layout from '~/components/layout/Layout';
import Hero from '~/components/home/Hero';

const Home: Component = () => {
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default Home;
```

#### `src/routes/features.tsx` - Features Page
```typescript
import { Component } from 'solid-js';
import Layout from '~/components/layout/Layout';
import FeatureGrid from '~/components/features/FeatureGrid';

const Features: Component = () => {
  return (
    <Layout>
      <section class="features-page">
        <div class="container">
          <h1>Our Features</h1>
          <p class="subtitle">
            Discover what makes our platform exceptional
          </p>
          <FeatureGrid />
        </div>
      </section>
    </Layout>
  );
};

export default Features;
```

#### `src/routes/contact.tsx` - Contact Page
```typescript
import { Component } from 'solid-js';
import Layout from '~/components/layout/Layout';
import ContactForm from '~/components/contact/ContactForm';

const Contact: Component = () => {
  return (
    <Layout>
      <section class="contact-page">
        <div class="container">
          <h1>Get in Touch</h1>
          <p class="subtitle">
            We'd love to hear from you
          </p>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
```

## Navigation

### Using the `<A>` Component

SolidStart provides the `<A>` component from `@solidjs/router` for client-side navigation:

```typescript
import { A } from '@solidjs/router';

// Basic usage
<A href="/">Home</A>
<A href="/features">Features</A>
<A href="/contact">Contact</A>

// With active class
<A href="/features" activeClass="active">Features</A>

// With end prop (exact match)
<A href="/" end activeClass="active">Home</A>
```

### Header Component Navigation

```typescript
// src/components/layout/Header.tsx
import { A } from '@solidjs/router';
import { Component } from 'solid-js';

const Header: Component = () => {
  return (
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
  );
};

export default Header;
```

## Programmatic Navigation

### Using `useNavigate`

```typescript
import { useNavigate } from '@solidjs/router';

const ContactForm: Component = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // ... form handling
    
    // Navigate after successful submission
    navigate('/');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

## Route Features

### Server-Side Rendering (SSR)

All routes are server-rendered by default:
- Faster initial page load
- Better SEO
- JavaScript hydration on client

### Code Splitting

Each route is automatically code-split:
- Reduces initial bundle size
- Loads route code on demand
- Improves performance

### Data Loading

For future enhancements, routes can load data:

```typescript
import { RouteDataFunc, useRouteData } from '@solidjs/router';

// Define data loader
export const routeData: RouteDataFunc = () => {
  return createAsync(() => fetchFeatures());
};

// Use in component
const Features: Component = () => {
  const features = useRouteData<typeof routeData>();
  // ...
};
```

## Route Guards & Protection

For future authentication:

```typescript
// Example protected route pattern
const ProtectedRoute: Component = (props) => {
  const user = useAuth();
  
  if (!user()) {
    return <Navigate href="/login" />;
  }
  
  return <>{props.children}</>;
};
```

## Active Route Styling

### CSS for Active Links

```css
/* global.css or Header.module.css */
.nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav a:hover {
  color: var(--color-primary);
}

.nav a.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
```

## Route Transitions

For smooth page transitions (optional enhancement):

```typescript
// app.tsx or root.tsx
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';

export default function App() {
  return (
    <Router>
      <FileRoutes />
    </Router>
  );
}
```

Add CSS transitions:

```css
/* Global transition styles */
.page-transition-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s, transform 0.3s;
}
```

## URL Parameters & Query Strings

Not needed for current routes, but available for future use:

```typescript
// Dynamic route: src/routes/features/[id].tsx
import { useParams } from '@solidjs/router';

const FeatureDetail = () => {
  const params = useParams();
  return <div>Feature ID: {params.id}</div>;
};

// Query parameters
import { useSearchParams } from '@solidjs/router';

const Features = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.category;
};
```

## 404 Not Found

SolidStart handles 404s automatically. For custom 404 page:

```typescript
// src/routes/[...404].tsx
const NotFound = () => {
  return (
    <Layout>
      <div class="not-found">
        <h1>404 - Page Not Found</h1>
        <A href="/">Go Home</A>
      </div>
    </Layout>
  );
};
```

## Meta Tags & SEO

Add meta tags per route:

```typescript
import { Title, Meta } from '@solidjs/meta';

const Features = () => {
  return (
    <>
      <Title>Features - MyApp</Title>
      <Meta name="description" content="Explore our amazing features" />
      <Layout>
        {/* page content */}
      </Layout>
    </>
  );
};
```

## Route Preloading

Links can preload on hover:

```typescript
<A href="/features" preload>Features</A>
```

## Route Configuration Summary

### Current Routes (MVP)
1. **Home** - `/` - Landing page with hero
2. **Features** - `/features` - Feature grid showcase
3. **Contact** - `/contact` - Contact form

### Navigation Flow
```
┌─────────┐
│  Home   │ ──CTA Button──> Contact
│    /    │
└────┬────┘
     │
     ├──────> Features (/features)
     │
     └──────> Contact (/contact)
```

### User Journey
1. User lands on `/` (Home)
2. Sees hero with CTA
3. Can navigate to `/features` to learn more
4. Can navigate to `/contact` to reach out
5. Can navigate back to `/` from any page

## Best Practices

1. **Always use `<A>` component** for internal links (not `<a>`)
2. **Use `end` prop** on home link to prevent always-active state
3. **Add `activeClass`** for visual feedback
4. **Keep routes simple** - one component per route
5. **Use Layout component** for consistent structure
6. **Add meta tags** for SEO
7. **Code split heavy components** if needed
8. **Test navigation** on all devices

## Testing Routes

### Manual Testing Checklist
- [ ] All routes load correctly
- [ ] Navigation between pages works
- [ ] Active states display correctly
- [ ] Back/forward browser buttons work
- [ ] Direct URL access works for all routes
- [ ] 404 page displays for invalid routes
- [ ] Meta tags are correct per page
- [ ] Routes are server-rendered (view source)

### Automated Testing
```typescript
// Future: Test route accessibility
import { render } from '@solidjs/testing-library';
import { Router } from '@solidjs/router';

test('navigates to features page', async () => {
  const { getByText } = render(() => (
    <Router>
      <App />
    </Router>
  ));
  
  const link = getByText('Features');
  link.click();
  // Assert page content
});
```

## Performance Optimization

1. **Lazy Loading**: Routes auto-split by SolidStart
2. **Prefetching**: Use `preload` on likely-clicked links
3. **SSR**: All routes server-rendered by default
4. **Minimal JS**: Only hydrate interactive components
5. **Route Transitions**: Keep animations lightweight

## Summary

This SolidStart webapp uses a clean, file-based routing system:
- 3 routes in `src/routes/`
- Client-side navigation with `<A>` component
- Automatic code splitting
- Server-side rendering
- SEO-friendly
- Simple and maintainable
