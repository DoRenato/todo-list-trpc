import Link from "next/link";
import TaskList from "@/components/task-list";
import { trpcServer } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tasks = await trpcServer.task.list();

  return (
    <main className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="pt-10 text-2xl">Lista de tarefas</h1>

        <Link href="/new" className="text-blue-500">
          Nova tarefa
        </Link>

        <TaskList tasks={tasks} />
      </div>
    </main>
  );
}
