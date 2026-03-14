"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/provider";
import { TaskType } from "@/lib/data/tasks";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

type TaskListProps = {
  tasks: TaskType[];
};

export default function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      router.refresh();
    },
  });

  function handleDelete(id: string) {
    deleteTask.mutate({ id });
    toast("Tarefa excluída com sucesso!");
  }

  if (tasks.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <ul className="flex flex-col gap-5">
      {tasks.map((task) => (
        <li key={task.id}>
          <Card className="mx-auto w-xl min-w-sm p-4">
            <CardHeader>
              <CardAction className="flex gap-5">
                <Link
                  href={`/edit/${task.id}`}
                  className="hover:text-yellow-500"
                >
                  <Pencil />
                </Link>

                <button
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteTask.isPending}
                  className="hover:cursor-pointer hover:text-red-500"
                >
                  {deleteTask.isPending ? "Excluindo..." : <Trash />}
                </button>
              </CardAction>
              <CardTitle>{task.titulo}</CardTitle>
              <CardDescription>
                Criada em: {new Date(task.dataCriacao).toLocaleString("pt-BR")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {task.descricao && <p>{task.descricao}</p>}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
