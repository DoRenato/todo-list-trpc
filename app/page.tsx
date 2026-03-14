"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/provider";
import { TaskList } from "@/components/task-list";

export default function HomePage() {
  const { data, isLoading, error } = trpc.task.list.useQuery();

  return (
    <main style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1>Lista de tarefas</h1>
        <Link href="/new">Nova tarefa</Link>
      </div>

      {isLoading && <p>Carregando...</p>}

      {error && <p style={{ color: "red" }}>Erro: {error.message}</p>}

      {!isLoading && !error && data && <TaskList tasks={data} />}
    </main>
  );
}