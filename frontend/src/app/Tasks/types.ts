export type TaskPriority = "URGENTE" | "ALTA" | "MEDIA" | "BAIXA";
export type TaskStatus = "PENDENTE" | "CONCLUIDO";

export interface Task {
  id: string; // Certifique-se de que `id` seja sempre uma string
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  status: TaskStatus;
}