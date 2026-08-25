# 25. Suspense Search and Pagination

## Overview
In this challenge, you will refactor classic loading-state query code to Suspense.

You will practice:
- `useSuspenseQuery`
- `React.Suspense` fallbacks
- `react-error-boundary` + `QueryErrorResetBoundary`
- transitions for pagination/sort changes

## Setup
```bash
cd "Challenges/25. Suspense Search and Pagination/starter"
pnpm install
pnpm dev
```

## Tasks
1. Convert repo query hooks from `useQuery` to `useSuspenseQuery`.
2. Wrap suspending components in `React.Suspense` with useful fallbacks.
3. Add an app-level error boundary reset flow.
4. Use `useTransition` when changing sort/page to keep previous content visible.

## Hints
1. `useSuspenseQuery` removes pending branches where Suspense is present.
2. Use `QueryErrorResetBoundary` to connect retry/reset behavior.
3. `startTransition` marks state updates as non-urgent.

## Stretch Goal
Split fallback UI into skeleton components and keep stale content dimmed while transitions are pending.

## Solution
See `Challenges/25. Suspense Search and Pagination/solution`.
