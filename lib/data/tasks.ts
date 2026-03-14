// Define o formato de uma tarefa dentro da aplicação.
export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

// Array em memória.
// Enquanto o servidor estiver rodando, as tarefas ficam aqui.
// Se reiniciar o servidor, tudo some.
const tasks: Task[] = [];

// Retorna todas as tarefas.
export function getTasks() {
  return tasks;
}

// Busca uma tarefa pelo id.
export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id);
}

// Cria uma nova tarefa e adiciona no array.
export function createTask(titulo: string, descricao?: string) {
  const newTask: Task = {
    id: crypto.randomUUID(),
    titulo,
    descricao,
    dataCriacao: Date.now(),
  };

  tasks.push(newTask);

  return newTask;
}

// Atualiza uma tarefa existente.
export function updateTask(id: string, titulo?: string, descricao?: string) {
  const task = tasks.find((t) => t.id === id);

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
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Tarefa não encontrada");
  }

  const deletedTask = tasks[index];

  tasks.splice(index, 1);

  return deletedTask;
}