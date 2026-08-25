"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }) {
  const clientRef = React.useRef();
  if (!clientRef.current) {
    clientRef.current = new QueryClient();
  }

  return <QueryClientProvider client={clientRef.current}>{children}</QueryClientProvider>;
}
