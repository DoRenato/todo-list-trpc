"use client";

import { useEffect, useRef } from "react";
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

type TaskListInfiniteProps = {
  initialData: {
    items: TaskType[];
    nextCursor: number | null;
  };
};

export default function TaskListInfinite({
  initialData,
}: TaskListInfiniteProps) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const utils = trpc.useUtils();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    trpc.task.list.useInfiniteQuery(
      { limit: 5 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialData: {
          pages: [initialData],
          pageParams: [undefined],
        },
      },
    );

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      router.refresh();
    },
  });

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const tasks = data?.pages.flatMap((page) => page.items) ?? [];

  function handleDelete(id: string) {
    deleteTask.mutate({ id });
    toast("Tarefa excluída com sucesso!");
  }

  //   if (status === "pending") {  // Possivel erro de execução
  //     return <p>Carregando tarefas...</p>;
  //   }

  if (status === "error") {
    return <p className="text-red-500">Erro ao carregar tarefas.</p>;
  }

  if (tasks.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <div className="w-full max-w-xl">
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
                  Criada em:{" "}
                  {new Date(task.dataCriacao).toLocaleString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {task.descricao ? (
                  <p>{task.descricao}</p>
                ) : (
                  <p>Sem descrição</p>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div ref={loadMoreRef} className="flex h-10 items-center justify-center">
        {isFetchingNextPage && <p>Carregando mais...</p>}
        {!hasNextPage && <p>Você chegou ao fim.</p>}
      </div>
    </div>
  );
}
