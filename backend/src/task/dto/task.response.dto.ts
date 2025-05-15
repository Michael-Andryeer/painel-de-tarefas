export class TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: 'PENDENTE' | 'CONCLUIDO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
