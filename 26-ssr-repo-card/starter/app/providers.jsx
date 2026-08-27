"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

export default function Providers({ children }) {
  const queryClient = new QueryClient();
  const queryClientRef = useRef();

  if (!queryClientRef.current) {
    queryClientRef.current = queryClient;
  }

  return <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>;
}
