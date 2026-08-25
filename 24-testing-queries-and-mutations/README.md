# 24. Testing Queries and Mutations

## Overview
In this challenge, you will test React Query query/mutation flows with Vitest and Testing Library.

You will practice:
- creating a per-test `QueryClientProvider` wrapper
- testing loading/data/error states
- testing mutation behavior and optimistic updates

## Setup
```bash
cd "Challenges/24. Testing Queries and Mutations/starter"
pnpm install
pnpm test
```

## Tasks
1. Build a `renderWithClient` helper with a fresh QueryClient per test.
2. Add a query test that waits for initial todos to render.
3. Add a mutation test for adding a todo item.
4. Add an error-path test where API rejection displays an error message.

## Hints
1. Disable retries in tests (`retry: false`) for deterministic failures.
2. Use `screen.findBy...` for async query/mutation assertions.
3. Prefer user interactions with `@testing-library/user-event`.

## Stretch Goal
Assert that `queryClient.invalidateQueries` is called after successful mutations.

## Solution
See `Challenges/24. Testing Queries and Mutations/solution`.
