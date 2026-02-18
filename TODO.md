# Terra App - Improvement Tasks

## 1. Add meta description tags to each route for better SEO
**Status:** DONE

Add `<Meta name="description" content="..." />` to each route for better SEO and social sharing.

**Files changed:**
- `src/routes/index.tsx` - Added meta description for home page
- `src/routes/features.tsx` - Added meta description for features page
- `src/routes/contact.tsx` - Added meta description for contact page

---

## 2. Add underline hover effect to footer links
**Status:** Pending

The footer links currently only change opacity on hover, making them hard to identify as clickable. Add an underline hover effect for better UX.

**Files to change:**
- `src/components/Layout.module.css`

---

## 3. Add a "Back to Top" button on the Features page
**Status:** Pending

The Features page is long with 6 cards + a CTA section. Add a smooth-scroll "Back to Top" button for better navigation.

**Files to change:**
- `src/routes/features.tsx`
- `src/routes/features.module.css`
