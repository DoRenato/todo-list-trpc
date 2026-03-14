"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/provider";
import type { FormValues } from "@/features/schema";
import FormTask from "@/widgets/FormTask";

export default function NewTaskPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      router.push("/");
    },
  });

  function handleSubmit(data: FormValues) {
    createTask.mutate({
      titulo: data.titulo,
      descricao: data.descricao || undefined,
    });
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Nova tarefa</h1>

      <FormTask
        onSubmit={handleSubmit}
        isSubmitting={createTask.isPending}
        submitLabel="Criar tarefa"
      />

      {createTask.error && (
        <p style={{ color: "red", marginTop: "12px" }}>
          Erro: {createTask.error.message}
        </p>
      )}
    </main>
  );
}