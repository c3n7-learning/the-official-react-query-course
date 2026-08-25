# 22. Persisting a Blog

## Overview
In this challenge, you will persist React Query cache data so blog pages can hydrate instantly on reload.

You will practice:
- app-level persistence with `PersistQueryClientProvider`
- localStorage persisters
- per-query persistence with `experimental_createPersister`

## Setup
```bash
cd "Challenges/22. Persisting a Blog/starter"
pnpm install
pnpm dev
```

## Tasks
1. Add a client persister with localStorage and wire `PersistQueryClientProvider`.
2. Keep the post list query persisted across reloads.
3. Move post detail persistence to per-query `persister` usage.
4. Add a cache buster value so old data is invalidated after a schema change.

## Hints
1. Use `createSyncStoragePersister({ storage: window.localStorage })`.
2. `PersistQueryClientProvider` accepts `client` and `persistOptions`.
3. `experimental_createQueryPersister` can be passed on individual queries.
4. Use `persistOptions: { persister, buster: "v1" }`.

## Stretch Goal
Use `maxAge` to expire stale persisted data after a short time window.

## Solution
See `Challenges/22. Persisting a Blog/solution`.
