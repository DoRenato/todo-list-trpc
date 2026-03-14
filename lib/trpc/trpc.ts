// Importa a função que inicializa o tRPC no backend.
import { initTRPC } from "@trpc/server";

// Importa o superjson, que melhora a serialização de dados.
// Isso ajuda principalmente com tipos como Date, Map etc.
import superjson from "superjson";

// Base do tRPC. Onde vai gerar routers e procedures.
const t = initTRPC.create({
  // Diz ao tRPC para usar superjson na transformação dos dados.
  transformer: superjson,
});

// Exporta uma função/helper para criar routers.
// Router = agrupador de procedures.
export const router = t.router;

// Exporta uma função/helper para criar procedures públicas.
// Procedure = uma operação da API, como list, create, update...
export const publicProcedure = t.procedure;

// Exporta uma função/helper para criar callers.
// Caller = cliente para chamar procedures do servidor.
export const createCallerFactory = t.createCallerFactory;