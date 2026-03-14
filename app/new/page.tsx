import { TaskForm } from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <main style={{ padding: "24px" }}>
      <h1>Nova tarefa</h1>
      <TaskForm />
    </main>
  );
}