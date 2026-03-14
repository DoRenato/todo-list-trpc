"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/provider";

type TaskFormProps = {
  initialData?: {
    id: string;
    titulo: string;
    descricao?: string;
  };
};

export function TaskForm({ initialData }: TaskFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [titulo, setTitulo] = useState(initialData?.titulo ?? "");
  const [descricao, setDescricao] = useState(initialData?.descricao ?? "");

  const isEditing = Boolean(initialData);

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      router.push("/");
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      router.push("/");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tituloFormatado = titulo.trim();
    const descricaoFormatada = descricao.trim() || undefined;

    if (!tituloFormatado) {
      return;
    }

    if (isEditing && initialData) {
      updateTask.mutate({
        id: initialData.id,
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

  const isSubmitting = createTask.isPending || updateTask.isPending;
  const errorMessage = createTask.error?.message || updateTask.error?.message;

  return (
    <form onSubmit={handleSubmit}>
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
            ? isEditing
              ? "Salvando..."
              : "Criando..."
            : isEditing
              ? "Salvar edição"
              : "Criar tarefa"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      </div>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "12px" }}>
          Erro: {errorMessage}
        </p>
      )}
    </form>
  );
}