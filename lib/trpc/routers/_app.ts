// Importa o helper para criar o router principal.
import { router } from "../trpc";

// Importa o router de tarefas.
import { taskRouter } from "./task";

// Cria o router principal da aplicação.
// Ele agrupa todos os routers menores do sistema.
export const appRouter = router({
  // Aqui está registrando o grupo "task".
  // Isso significa que no frontend existirão chamadas dentro de "task".
  task: taskRouter,
});

// Exporta o tipo do router principal.
// Isso é muito importante porque o frontend usa esse tipo
// para saber exatamente quais rotas existem e quais tipos elas aceitam/retornam.
export type AppRouter = typeof appRouter;




// Esse código define essa aplicação terá um grupo de rotas chamado task.
// No futuro, por exemplo, vai existir algo como:

// task.create
// task.list
// task.update
// task.delete