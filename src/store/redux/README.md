# Redux Toolkit — intentionally not used

The brief allows Redux Toolkit **"only if there is a clear need for complex
app-wide slices."**

This app's client state is small and cleanly separable:

- **Auth/session** → `store/zustand/authStore.ts`
- **Cart** → `store/zustand/cartStore.ts`
- **Transient UI (snackbars)** → `store/zustand/uiStore.ts`
- **All server data** (products, orders, quotes, deliveries, notifications,
  profile) → **TanStack Query** cache, not client state.

Zustand + TanStack Query cover every requirement with far less boilerplate, so
adding Redux would introduce unused indirection. This folder is a placeholder
that documents the deliberate architectural decision.

If a future feature needs normalized, cross-cutting, middleware-heavy state
(e.g. an offline mutation queue with optimistic reconciliation), add a
`configureStore` here and wrap the app in a `<Provider>` at
`src/app/_layout.tsx`.
