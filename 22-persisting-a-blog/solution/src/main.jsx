import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient();
const persister = createSyncStoragePersister({ storage: window.localStorage });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, buster: "v1" }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
