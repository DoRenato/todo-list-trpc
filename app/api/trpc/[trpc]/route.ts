// Importa o adaptador do tRPC para trabalhar com o padrão fetch do Next/App Router.
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// Importa o router principal da aplicação.
import { appRouter } from "@/lib/trpc/routers/_app";

// Cria uma função handler que vai processar as requisições que chegarem na rota /api/trpc.
const handler = (req: Request) =>
  fetchRequestHandler({
    // Define o endpoint base do tRPC.
    endpoint: "/api/trpc",

    // Passa a requisição recebida pelo Next.
    req,

    // Passa o router principal que contém todas as procedures da aplicação.
    router: appRouter,
  });

// Exporta o mesmo handler para GET e POST.
// O tRPC usa essas requisições para processar queries e mutations.
export { handler as GET, handler as POST };