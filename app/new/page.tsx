"use client";

import { useRouter } from "next/navigation";
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
    <main className="min-h-dvh flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Nova Tarefa</CardTitle>
          <CardDescription className="text-center">
            O título é obrigatório mas a descrição é opcional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormTask
            onSubmit={handleSubmit}
            isSubmitting={createTask.isPending}
            submitLabel="Criar tarefa"
          />
          {createTask.error && (
            <p className="mt-5 text-red-500">
              Erro: {createTask.error.message}
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
