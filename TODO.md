# Terra App Improvements

## Completed

### 1. Add meta description tags to all route pages
- [x] Added `Meta` import from `@solidjs/meta` to all route files
- [x] Added meta description to Home page (`src/routes/index.tsx`)
- [x] Added meta description to Features page (`src/routes/features.tsx`)
- [x] Added meta description to Contact page (`src/routes/contact.tsx`)

## Pending

### 2. Add hover underline to footer links
- [ ] Edit `src/components/Layout.module.css`
- [ ] Add `text-decoration: underline` on hover state for footer links

### 3. Add a "Back to Top" button on Features page
- [ ] Add scroll listener to track scroll position
- [ ] Create "Back to Top" button component in `src/routes/features.tsx`
- [ ] Add corresponding styles in `src/routes/features.module.css`
- [ ] Button should appear when scrolled down and smoothly scroll to top on click
