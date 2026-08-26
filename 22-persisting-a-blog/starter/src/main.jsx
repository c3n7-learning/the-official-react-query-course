import React from "react";
import ReactDOM from "react-dom/client";
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import App from "./App";
import "./styles.css";
import { PersistQueryClientProvider, removeOldestQuery } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  }
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'offline_todos',
  throttleTime: 0,
  retry: removeOldestQuery,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* TODO: replace with PersistQueryClientProvider */}
    <PersistQueryClientProvider client={queryClient}
      persistOptions={{
        persister: persister,
        buster: 'v3',
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: (query) => {
          return defaultShouldDehydrateQuery() && query.meta.persist == true;
        }
      }}>
      <App />

      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
