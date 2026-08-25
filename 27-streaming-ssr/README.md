# 27. Streaming SSR

## Overview
In this challenge, you will enable streaming SSR with React Query and Suspense in Next.js.

You will practice:
- non-blocking server prefetch (no `await`)
- client `useSuspenseQuery`
- `React.Suspense` fallback streaming
- dehydrating pending queries via `shouldDehydrateQuery`

## Setup
```bash
cd "Challenges/27. Streaming SSR/starter"
pnpm install
pnpm dev
```

## Tasks
1. Remove blocking behavior from server prefetch.
2. Switch data component to `useSuspenseQuery`.
3. Wrap with `React.Suspense` and a skeleton fallback.
4. Configure dehydration so pending queries are included.

## Hints
1. Pending queries are skipped by default in `dehydrate`.
2. Use `defaultShouldDehydrateQuery(query) || query.state.status === "pending"`.
3. Keep a static header/footer visible while the data section streams.

## Stretch Goal
Try `@tanstack/react-query-next-experimental` and compare boilerplate.

## Solution
See `Challenges/27. Streaming SSR/solution`.
