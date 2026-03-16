"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/provider";
import type { FormValues } from "@/features/schema";
import FormTask from "@/widgets/FormTask";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const {
    data: task,
    isLoading,
    error,
  } = trpc.task.getById.useQuery(
    { id },
    {
      enabled: !!id, // Só roda a query se o id existir
    },
  );

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
    //   await utils.task.list.invalidate();
    //   await utils.task.getById.invalidate({ id });
      router.replace("/");
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

  if (!task) { // Porque mesmo sem erro, a tarefa pode realmente não existir.
    return (
      <main style={{ padding: "24px" }}>
        <h1>Editar tarefa</h1>
        <p>Tarefa não encontrada.</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Editar Tarefa</CardTitle>
          <CardDescription className="text-center">
            O título é obrigatório mas a descrição é opcional.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        <p className="mt-5 text-red-500">
          Erro: {updateTask.error.message}
        </p>
      )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
