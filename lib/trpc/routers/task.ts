import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Importa os helpers criados no arquivo base do tRPC.
import { router, publicProcedure } from "../trpc";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/data/tasks";

// Cria o router de tarefas.
export const taskRouter = router({
  // Procedure para listar todas as tarefas.
  // Usando query pois não altera dados, apenas busca.
  list: publicProcedure.query(() => {
    return getTasks();
  }),

  // Procedure para criar uma tarefa.
  // Usando mutation pois altera dados.
  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().trim().min(1, "O título é obrigatório"),
        descricao: z.string().trim().optional(),
      })
    )
    .mutation(({ input }) => {
      return createTask(input.titulo, input.descricao);
    }),

  // Procedure para atualizar uma tarefa.
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().trim().min(1, "O título é obrigatório").optional(),
        descricao: z.string().trim().optional(),
      })
    )
    .mutation(({ input }) => {
      try {
        return updateTask(input.id, input.titulo, input.descricao);
      } catch (error) {
        // Se lançar um erro (provavelmente "Tarefa não encontrada") converte o erro num TRPCError com código NOT_FOUND.
        // Apenas pra padronizar o formato de erro da api.
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Erro ao atualizar tarefa",
        });
      }
    }),

  // Procedure para deletar uma tarefa.
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      try {
        return deleteTask(input.id);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Erro ao deletar tarefa",
        });
      }
    }),
});