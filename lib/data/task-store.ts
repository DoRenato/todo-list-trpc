import { TaskType } from "./tasks";

type TaskStore = {
  tasks: TaskType[];
};

const globalForTaskStore = globalThis as typeof globalThis & {
  taskStore?: TaskStore;
};

export const taskStore =
  globalForTaskStore.taskStore ??
  (globalForTaskStore.taskStore = {
    tasks: [],
  });
