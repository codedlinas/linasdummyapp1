# Terra App Improvements

## 1. Add meta description tags to each route for better SEO ✅

**Status:** DONE

**Files changed:**
- `src/routes/index.tsx`
- `src/routes/features.tsx`
- `src/routes/contact.tsx`

**Changes made:**
- Imported `Meta` from `@solidjs/meta` in each route
- Added `<Meta name="description" content="..." />` tags with relevant descriptions for each page

---

## 2. Add underline hover effect to footer links

**Status:** Pending

**Files to change:**
- `src/components/Layout.tsx` or associated CSS module

**What to do:**
- Footer links currently only change opacity on hover
- Add an underline on hover to make them more clearly identifiable as clickable links

---

## 3. Add a "Back to Top" button on the Features page

**Status:** Pending

**Files to change:**
- `src/routes/features.tsx`
- `src/routes/features.module.css`

**What to do:**
- The Features page is long with 6 cards + a CTA section
- Add a floating "Back to Top" button that appears when scrolling down
- Implement smooth-scroll behavior when clicked
