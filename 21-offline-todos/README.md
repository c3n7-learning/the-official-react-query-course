# 21. Offline Todos

## Overview
In this challenge, you will apply React Query offline support patterns to a todo app with optimistic updates.

You will practice:
- detecting paused network state
- configuring `networkMode` for resilient offline behavior
- preventing redundant invalidations during concurrent mutations

## Setup
Use pnpm in either folder:

```bash
cd "Challenges/21. Offline Todos/starter"
pnpm install
pnpm dev
```

## Tasks
1. Show a clear offline/paused indicator when the todos query is paused.
2. Configure the todos query to work better when connectivity is flaky.
3. Implement optimistic toggle behavior with rollback on error.
4. Prevent duplicate invalidations when many toggle mutations overlap.

## Hints
1. `fetchStatus === "paused"` is distinct from `status`.
2. `networkMode: "offlineFirst"` is useful when cached data exists.
3. Use `onMutate` to snapshot + optimistically update, and `onError` to rollback.
4. In `onSettled`, guard invalidation using `queryClient.isMutating({ mutationKey })`.

## Stretch Goal
Add a small "Go Offline/Go Online" simulation button that disables writes in-memory and verify rollback still behaves as expected.

## Solution
See `Challenges/21. Offline Todos/solution`.
