import type { TaskStatus } from '@prisma/client';

export class TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'ALTA' | 'MEDIA' | 'BAIXA' | 'URGENTE';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
