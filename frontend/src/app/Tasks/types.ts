export type TaskPriority = "URGENTE" | "ALTA" | "MEDIA" | "BAIXA";
export type TaskStatus = "PENDENTE" | "CONCLUIDO";

export interface Task {
  id: string; 
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  status: TaskStatus;
}