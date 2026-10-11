# Mr Heat HVAC — B2B Ordering & Delivery App

A production-quality **React Native (Expo)** mobile app for the Mr Heat HVAC B2B
platform. It replaces manual, text-message-based ordering and delivery
coordination with two polished, role-aware experiences:

- **Contractors** browse HVAC equipment, request quotes for specialized gear,
  submit delivery requests, track deliveries in real time, and manage orders.
- **Drivers** receive delivery assignments, update ETAs, capture photo proof of
  delivery, add notes, and report issues.

There is **no admin panel** — this is the mobile frontend for contractors and
drivers only, backed by a fully-featured in-app **mock API** that is trivial to
swap for a real backend.

---

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | React Native + Expo (SDK 51) |
| Language | TypeScript (strict) |
| Routing | Expo Router (file-based) + React Navigation (tabs/stacks) |
| Styling | NativeWind (Tailwind) + React Native Paper (accessible primitives) |
| Animation | React Native Reanimated + Gesture Handler |
| Server state | TanStack Query (caching, retries, loading/error states) |
| Client state | Zustand (auth, cart, checkout, UI) |
| Persistence | React Native MMKV (with graceful in-memory fallback) |
| Forms | React Hook Form + Zod |
| Networking | Fetch-based API client (mock ↔ real via one env var) |
| Monitoring | Sentry (placeholder, DSN-gated) |
| Testing | Jest + React Native Testing Library |

> **Note on state management:** Redux Toolkit was intentionally **not** used —
> Zustand + TanStack Query cover every requirement with less boilerplate. See
> [`src/store/redux/README.md`](src/store/redux/README.md) for the rationale.

---

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env

# 3. Start the dev server
npx expo start
```

Then press **i** (iOS simulator), **a** (Android emulator), or scan the QR code
with **Expo Go** on a physical device.

> **Storage backends:** the storage layer ([`src/lib/storage.ts`](src/lib/storage.ts))
> auto-selects the best available backend behind one synchronous API:
> **MMKV** (native, fastest — dev/production builds) → **SQLite** via
> `expo-sqlite` (persists in **Expo Go**, no dev build needed) → in-memory
> (web fallback). So login sessions and the cart persist across reloads in Expo
> Go, and you get native MMKV speed in a dev/production build automatically.

### Demo credentials

The mock API accepts **any** email and password. Pick a role on the login
screen (Contractor or Driver) to explore that side of the app.

---

## Environment Variables

Copy `.env.example` → `.env`:

```bash
# Base URL of the backend API. Leave blank to use the built-in mock API.
EXPO_PUBLIC_API_URL=

# Sentry DSN for error monitoring. Leave blank to disable Sentry.
EXPO_PUBLIC_SENTRY_DSN=

# Force the mock API even when EXPO_PUBLIC_API_URL is set.
EXPO_PUBLIC_USE_MOCK_API=true
```

When `EXPO_PUBLIC_API_URL` is empty (or `EXPO_PUBLIC_USE_MOCK_API=true`), the app
uses the in-app mock server in [`src/services/api/mockDb.ts`](src/services/api/mockDb.ts).

---

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Start on Android
npm run ios        # Start on iOS
npm test           # Run the Jest test suite
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
```

---

## Folder Structure

```
src/
  app/                     # Expo Router routes (file-based navigation)
    _layout.tsx            # Root providers + auth guard/redirects
    index.tsx              # Entry redirect based on auth + role
    (auth)/                # welcome, login, register, forgot password
    (contractor)/          # contractor stack
      (tabs)/              # Home · Catalog · Quotes · Orders · Profile
      product/[id].tsx     # + category, cart, delivery-request, order-review,
      ...                  #   order/track/quote details, addresses, support…
    (driver)/              # driver stack
      (tabs)/              # Today · Deliveries · History · Profile
      delivery/[id].tsx    # + eta-update, proof-of-delivery, delivery-issue…
  components/              # Reusable UI (design system)
    ui/  cards/  forms/  layout/  feedback/
  features/                # Cross-role feature views (notifications, profile,
                           #   support, delivery widgets)
  services/
    api/                   # API client, endpoints, mock DB, DTOs
    queries/               # TanStack Query hooks (useProducts, useOrders…)
    mutations/             # Mutation hooks (useLogin, useCreateOrder…)
  store/zustand/           # auth, cart, checkout, UI (snackbar) stores
  hooks/                   # useDebounce, useRefreshByUser
  constants/  theme/  utils/  types/  validation/  mocks/  lib/
tests/                     # Jest + RNTL tests
```

Architecture is **feature-based and modular**: reusable components do the heavy
lifting so screens stay small and consistent, all server data flows through
TanStack Query, and the API layer is the single seam between mock and real
backends.

---

## App Flows

### Contractor
- **Home dashboard** — quick actions, live stats, active deliveries, pending
  quotes, recent orders, support card.
- **Catalog** — search, category chips, sort, product grid, availability badges.
- **Product details** — full specs, add to cart, request delivery, request quote.
- **Cart → Delivery request → Review → Confirmation** — validated multi-step
  checkout with saved job-site prefill, delivery options, liftgate, notes.
- **Quotes** — request specialized equipment, filterable list, details with
  supplier response, accept / request changes.
- **Orders** — filter + search, status timeline, driver contact, proof of
  delivery, track delivery.
- **Profile** — company info, saved job sites (CRUD), notification prefs,
  support, logout.

### Driver
- **Today** — availability toggle, route summary, active delivery, stats.
- **Deliveries** — today's assignments with quick start.
- **Delivery details** — navigate, contact, items, status progression
  (Accept → En Route → Arrived → Delivered).
- **ETA update** (modal), **Proof of delivery** (photos + recipient +
  signature), **Report issue** (typed + notes + photos).
- **History** — completed & issue deliveries with filters.
- **Profile** — vehicle, stats, settings, logout.

Every screen includes loading, error, and empty states, form validation,
disabled/loading buttons, pull-to-refresh where useful, skeleton loaders,
snackbar feedback, safe-area handling, and keyboard-aware forms.

---

## State Management

- **TanStack Query** — all server data (products, orders, quotes, deliveries,
  notifications, profile). Handles caching, retries, background refetch,
  loading/error, and cache invalidation on mutations.
- **Zustand** — lightweight client state: `authStore` (session/role/token),
  `cartStore`, `checkoutStore`, `uiStore` (snackbars). Auth and cart persist via
  MMKV.
- **Persistence** — auth token, user, role, cart, and notification preferences
  persist via the auto-selected storage backend (MMKV → SQLite → in-memory).

---

## Mock API → Real Backend

The mock server ([`src/services/api/mockDb.ts`](src/services/api/mockDb.ts))
simulates realistic latency and mutations against seeded HVAC data
([`src/mocks/data.ts`](src/mocks/data.ts)). The domain API surface lives in
[`src/services/api/index.ts`](src/services/api/index.ts) and routes each call to
**either** the mock server **or** the real HTTP client based on
`EXPO_PUBLIC_API_URL`.

To integrate a real backend:

1. Set `EXPO_PUBLIC_API_URL` in `.env`.
2. Ensure your endpoints match [`src/services/api/endpoints.ts`](src/services/api/endpoints.ts)
   (or edit the paths there).
3. That's it — no call sites change. Query/mutation hooks are backend-agnostic.

---

## Testing

```bash
npm test
```

Covers `AppButton` rendering & interaction, login/register/quote **Zod
validation**, `OrderCard` rendering, the Zustand **auth store**, and utility
functions. Jest is configured with `jest-expo` and mocks for MMKV, Reanimated,
Sentry, Haptics, and Expo modules ([`jest.setup.ts`](jest.setup.ts)).

---

## Error Monitoring

Sentry is wired in [`src/lib/sentry.ts`](src/lib/sentry.ts) and initialized at
app start. It stays disabled until you provide `EXPO_PUBLIC_SENTRY_DSN`, so no
real DSN is required for development.

---

## Design

Dark, premium, industrial HVAC theme: deep navy/charcoal surfaces, orange/amber
heating accents, soft shadows, rounded cards, and high-contrast typography
tuned for outdoor/field and in-vehicle readability. Theme tokens are shared
between NativeWind (`tailwind.config.js`) and imperative code (`src/theme`).
"# HVAC" 
#   H a v a - F r o n t e n d  
 