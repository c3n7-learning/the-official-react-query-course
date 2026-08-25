# 23. Building a jQuery Adapter

## Overview
In this challenge, you will build a tiny query adapter for jQuery using `@tanstack/query-core`.

You will practice:
- creating a `QueryObserver`
- wiring widget lifecycle (`_create`, `_destroy`, `_setOption`)
- subscribing to cache updates and triggering UI events

## Setup
This project is static and uses CDN scripts.

Open `starter/index.html` in your browser.

## Tasks
1. Create a `QueryClient` and mount it.
2. Implement `_create` to construct `QueryObserver` and subscribe.
3. Trigger `update` callbacks with `getCurrentResult()`.
4. Use `trackResult` before calling `_trigger` for tracked-property behavior.
5. Implement `_setOption` so changing `queryOptions` calls `observer.setOptions`.
6. Implement `_destroy` to unsubscribe and unmount.

## Hints
1. `this.options` contains `queryClient`, `queryOptions`, and `update` callback.
2. `subscribe` returns a cleanup function.
3. `this._trigger("update", null, payload)` forwards data to the caller.
4. Remember to call `this._super(key, value)` in `_setOption`.

## Stretch Goal
Add a dropdown that swaps query keys and query functions dynamically via `$("#app").useQuery("option", "queryOptions", nextOptions)`.

## Solution
See `Challenges/23. Building a jQuery Adapter/solution`.
