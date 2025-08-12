// Reference: https://medium.com/@ecarina.gonzalez/react-query-integration-with-next-js-are-you-ready-7433568356f2

"use client";

import { useState } from "react";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
