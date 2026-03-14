"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/provider";
import type { FormValues } from "@/features/schema";
import FormTask from "@/widgets/FormTask";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const utils = trpc.useUtils();

  const id = params.id as string;

  const {
    data: task,
    isLoading,
    error,
  } = trpc.task.getById.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      await utils.task.getById.invalidate({ id });
      router.push("/");
    },
  });

  function handleSubmit(data: FormValues) {
    updateTask.mutate({
      id,
      titulo: data.titulo,
      descricao: data.descricao,
    });
  }

  if (isLoading) {
    return (
      <main style={{ padding: "24px" }}>
        <p>Carregando tarefa...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Editar tarefa</h1>
        <p style={{ color: "red" }}>Erro: {error.message}</p>
      </main>
    );
  }

  if (!task) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Editar tarefa</h1>
        <p>Tarefa não encontrada.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Editar tarefa</h1>

      <FormTask
        initialData={{
          titulo: task.titulo,
          descricao: task.descricao ?? "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateTask.isPending}
        submitLabel="Salvar edição"
      />

      {updateTask.error && (
        <p style={{ color: "red", marginTop: "12px" }}>
          Erro: {updateTask.error.message}
        </p>
      )}
    </main>
  );
}
