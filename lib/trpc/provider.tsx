"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/lib/trpc/routers/_app";
import { useState } from "react";
import SuperJSON from "superjson";

// Cria o client React do tRPC tipado com seu AppRouter
export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {

  // React Query precisa de um QueryClient.
  // Usamos useState para garantir que ele seja criado apenas uma vez.
  const [queryClient] = useState(() => new QueryClient());

  // Cria o cliente do tRPC que vai conversar com /api/trpc
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: SuperJSON,
        }),
      ],
    })
  );

  return (
    // Provider do tRPC
    <trpc.Provider client={trpcClient} queryClient={queryClient}>

      {/* Provider do React Query */}
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>

    </trpc.Provider>
  );
}