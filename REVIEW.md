# Code Review: Contact Form setTimeout Cleanup

**Commit:** `ed79216` - "Fix: Add cleanup for setTimeout in contact form success message"  
**File Changed:** `src/routes/contact.tsx`  
**Reviewer:** Code Review Agent  
**Date:** Feb 18, 2026

---

## Summary

The change adds cleanup handling for a `setTimeout` in the contact form to prevent memory leaks. While the intent is correct, the implementation has a critical issue with how SolidJS's `onCleanup` is being used.

---

## Changes Reviewed

```diff
-import { createSignal, createEffect, Component, Show } from "solid-js";
+import { createSignal, createEffect, Component, Show, onCleanup } from "solid-js";

// Inside handleSubmit async function:
-      setTimeout(() => {
+      const timeoutId = setTimeout(() => {
         setSubmitSuccess(false);
       }, 5000);
+      
+      onCleanup(() => clearTimeout(timeoutId));
```

---

## Issues Found

### Issue 1: `onCleanup` Called Outside Tracking Scope (Critical)

**Location:** Line 158 in `src/routes/contact.tsx`

**Problem:** The `onCleanup` function is being called inside the `handleSubmit` event handler, which is **not a tracking scope**. In SolidJS, `onCleanup` must be called within:
- The component function body (root level)
- Inside a reactive computation (`createEffect`, `createMemo`, `createRenderEffect`)
- Inside `onMount`

When called inside an async event handler, `onCleanup` has no reactive context to attach to, meaning **the cleanup callback will never be executed** when the component unmounts.

**Current (Incorrect) Code:**
```typescript
const handleSubmit = async (e: Event) => {
  // ... form handling code ...
  
  const timeoutId = setTimeout(() => {
    setSubmitSuccess(false);
  }, 5000);
  
  onCleanup(() => clearTimeout(timeoutId));  // ❌ Won't work - no tracking scope
};
```

**Recommended Fix:**
```typescript
export default function Contact() {
  // ... existing signals ...
  
  // Store timeout ID at component level
  let successTimeoutId: ReturnType<typeof setTimeout> | null = null;
  
  // Register cleanup at component level (tracking scope)
  onCleanup(() => {
    if (successTimeoutId) {
      clearTimeout(successTimeoutId);
    }
  });
  
  const handleSubmit = async (e: Event) => {
    // ... form handling code ...
    
    // Clear any existing timeout first
    if (successTimeoutId) {
      clearTimeout(successTimeoutId);
    }
    
    // Set new timeout
    successTimeoutId = setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };
  
  // ... rest of component
}
```

---

## Code Quality Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Intent | ✅ Good | Correctly identifies need for cleanup |
| Implementation | ❌ Incorrect | `onCleanup` in wrong scope |
| Testing | ⚠️ Unknown | No tests included |
| Documentation | ✅ Good | Commit message explains reasoning |

---

## Verdict

**NEEDS_FIXES**

The implementation will not work as intended due to the incorrect placement of `onCleanup`. The cleanup function will never execute because it's not registered within a proper SolidJS tracking scope. The timeout ID variable and the `onCleanup` call must be moved to the component's root level for proper lifecycle management.

---

## Action Items

1. Move the `timeoutId` variable declaration to component scope (outside `handleSubmit`)
2. Move the `onCleanup` call to the component body (root level, outside any event handlers)
3. Clear existing timeout before setting a new one (in case of rapid form resubmission)
4. Consider adding a test to verify cleanup behavior on unmount
