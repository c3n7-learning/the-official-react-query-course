# 26. SSR Repo Card

## Overview
In this challenge, you will implement React Query with Next.js App Router Server Components.

You will practice:
- creating a client-side provider (`QueryClientProvider`)
- server prefetch + `dehydrate`
- client hydration with `HydrationBoundary`

## Setup
```bash
cd "Challenges/26. SSR Repo Card/starter"
pnpm install
pnpm dev
```

## Tasks
1. Create a client provider component that initializes a QueryClient once.
2. Mount that provider in `app/layout.jsx`.
3. In `app/page.jsx`, prefetch repo data on the server.
4. Wrap the client component with `HydrationBoundary` using `dehydrate` output.

## Hints
1. Use `React.useRef` in the client provider.
2. Use `await queryClient.prefetchQuery(...)` in the server page.
3. Keep query keys consistent between prefetch and client `useQuery`.

## Stretch Goal
Try replacing dehydrate/hydrate with `initialData` and compare behavior when route params change dynamically.

## Solution
See `Challenges/26. SSR Repo Card/solution`.
