import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['PENDENTE', 'CONCLUIDO'])
  status: 'PENDENTE' | 'CONCLUIDO';

  @IsEnum(['ALTA', 'MEDIA', 'BAIXA'])
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';

  @IsDateString()
  dueDate: Date;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
