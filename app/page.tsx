import Link from "next/link";
import { trpcServer } from "@/lib/trpc/server";
import TaskListInfinite from "@/components/task-list-infinite";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialTasks = await trpcServer.task.list({
    limit: 5,
  });

  return (
    <main className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="pt-10 text-2xl">Lista de tarefas</h1>

        <Link href="/new" className="text-blue-500">
          Nova tarefa
        </Link>

        <TaskListInfinite initialData={initialTasks} />
      </div>
    </main>
  );
}
