"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/provider";

export default function Home() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const {
    data: tasks,
    isLoading,
    error,
  } = trpc.task.list.useQuery();

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      resetForm();
      await utils.task.list.invalidate();
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
      resetForm();
      await utils.task.list.invalidate();
    },
  });

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      if (editingTaskId) {
        const deletedTaskStillExists = tasks?.some((task) => task.id === editingTaskId);

        if (!deletedTaskStillExists) {
          resetForm();
        }
      }

      await utils.task.list.invalidate();
    },
  });

  function resetForm() {
    setTitulo("");
    setDescricao("");
    setEditingTaskId(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tituloFormatado = titulo.trim();
    const descricaoFormatada = descricao.trim() || undefined;

    if (!tituloFormatado) {
      return;
    }

    if (editingTaskId) {
      updateTask.mutate({
        id: editingTaskId,
        titulo: tituloFormatado,
        descricao: descricaoFormatada,
      });

      return;
    }

    createTask.mutate({
      titulo: tituloFormatado,
      descricao: descricaoFormatada,
    });
  }

  function handleDelete(id: string) {
    deleteTask.mutate({ id });
  }

  function handleEdit(task: {
    id: string;
    titulo: string;
    descricao?: string;
  }) {
    setEditingTaskId(task.id);
    setTitulo(task.titulo);
    setDescricao(task.descricao ?? "");
  }

  const isSubmitting = createTask.isPending || updateTask.isPending;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Lista de tarefas</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "16px", marginBottom: "24px" }}
      >
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="titulo">Título</label>
          <br />
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título da tarefa"
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="descricao">Descrição</label>
          <br />
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição da tarefa"
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? editingTaskId
                ? "Salvando..."
                : "Criando..."
              : editingTaskId
              ? "Salvar edição"
              : "Criar tarefa"}
          </button>

          {editingTaskId && (
            <button type="button" onClick={resetForm} disabled={isSubmitting}>
              Cancelar edição
            </button>
          )}
        </div>

        {createTask.error && (
          <p style={{ color: "red", marginTop: "12px" }}>
            Erro ao criar: {createTask.error.message}
          </p>
        )}

        {updateTask.error && (
          <p style={{ color: "red", marginTop: "12px" }}>
            Erro ao editar: {updateTask.error.message}
          </p>
        )}
      </form>

      {isLoading && <p>Carregando...</p>}

      {error && <p>Erro ao carregar tarefas: {error.message}</p>}

      {!isLoading && !error && tasks?.length === 0 && (
        <p>Nenhuma tarefa cadastrada.</p>
      )}

      {!isLoading && !error && tasks && tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "16px" }}>
              <strong>{task.titulo}</strong>

              {task.descricao && <p>{task.descricao}</p>}

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleEdit(task)}
                  disabled={isSubmitting || deleteTask.isPending}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteTask.isPending || isSubmitting}
                >
                  {deleteTask.isPending ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleteTask.error && (
        <p style={{ color: "red", marginTop: "12px" }}>
          Erro ao excluir: {deleteTask.error.message}
        </p>
      )}
    </div>
  );
}