"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/provider";

type TaskListProps = {
  tasks: Array<{
    id: string;
    titulo: string;
    descricao?: string;
  }>;
};

export function TaskList({ tasks }: TaskListProps) {
  const utils = trpc.useUtils();

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
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
        <li key={task.id} style={{ marginBottom: "16px" }}>
          <strong>{task.titulo}</strong>

          {task.descricao && <p>{task.descricao}</p>}
          <p>ID: {task.id}</p>

          <div style={{ display: "flex", gap: "8px" }}>
            <Link href={`/edit/${task.id}`}>Editar</Link>

            <button
              type="button"
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