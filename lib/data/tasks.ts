import { taskStore } from "./task-store";

// Define o formato de uma tarefa dentro da aplicação.
export type TaskType = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

// Retorna todas as tarefas.
export function getTasks() {
  return taskStore.tasks;
}

// Busca uma tarefa pelo id.
export function getTaskById(id: string) {
  return taskStore.tasks.find((task) => task.id === id);
}

// Cria uma nova tarefa e adiciona no array.
export function createTask(titulo: string, descricao?: string) {
  const newTask: TaskType = {
    id: crypto.randomUUID(),
    titulo,
    descricao,
    dataCriacao: Date.now(),
  };

  taskStore.tasks.push(newTask);
  return newTask;
}

// Atualiza uma tarefa existente.
export function updateTask(id: string, titulo?: string, descricao?: string) {
  const task = taskStore.tasks.find((t) => t.id === id);

  if (!task) {
    throw new Error("Tarefa não encontrada");
  }

  if (titulo !== undefined) {
    task.titulo = titulo;
  }

  task.descricao = descricao;
  return task;
}

// Remove uma tarefa do array.
export function deleteTask(id: string) {
  const index = taskStore.tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Tarefa não encontrada");
  }

  const deletedTask = taskStore.tasks[index];
  taskStore.tasks.splice(index, 1);

  return deletedTask;
}
