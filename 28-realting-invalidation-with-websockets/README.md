# 28. Realtime Invalidation with WebSockets

## Overview
In this challenge, you will use WebSocket events to invalidate React Query caches in real time.

You will practice:
- subscribing to websocket messages in an effect
- invalidating affected query keys with `queryClient.invalidateQueries`
- combining push invalidation with `staleTime: Infinity`

## Setup
Terminal 1:
```bash
cd "Challenges/28. Realtime Invalidation with WebSockets/starter"
pnpm install
pnpm server
```

Terminal 2:
```bash
cd "Challenges/28. Realtime Invalidation with WebSockets/starter"
pnpm dev
```

## Tasks
1. Implement `useWebsocketQueryInvalidate` to listen to socket messages.
2. Parse incoming `queryKey` payloads and invalidate matching queries.
3. Ensure listener cleanup on unmount.
4. Set query `staleTime` to `Infinity` for websocket-driven freshness.

## Hints
1. Use `useQueryClient` inside the custom hook.
2. Add/remove `message` listeners in the effect.
3. Server messages are JSON arrays (e.g. `["todos"]`).

## Stretch Goal
Add a second event type that includes direct query data and update cache via `setQueryData`.

## Solution
See `Challenges/28. Realtime Invalidation with WebSockets/solution`.
