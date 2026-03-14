"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/provider";
import { TaskType } from "@/lib/data/tasks";

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
  }

  if (tasks.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} style={{ marginBottom: "20px" }}>
          <strong>{task.titulo}</strong>

          {task.descricao && <p>{task.descricao}</p>}

          <small>
            Criada em: {new Date(task.dataCriacao).toLocaleString("pt-BR")}
          </small>

          <div>
            <Link href={`/edit/${task.id}`}>Editar</Link>

            <button
              onClick={() => handleDelete(task.id)}
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
