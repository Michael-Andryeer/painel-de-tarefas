/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { TaskResponseDto } from './dto/task.response.dto';

const prisma = new PrismaClient();

@Injectable()
export class TaskService {
  async getTasksByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ tasks: TaskResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.task.count({
      where: { userId },
    });

    return { tasks, total };
  }

  async createTask(
    data: CreateTaskDto & { userId: string },
  ): Promise<TaskResponseDto> {
    const { userId, ...taskData } = data;

    return prisma.task.create({
      data: {
        ...taskData,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async updateTask(
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) throw new NotFoundException('Tarefa não encontrada.');
    return prisma.task.update({ where: { id: taskId }, data: dto });
  }

  async deleteTask(taskId: string): Promise<{ message: string }> {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
    await prisma.task.delete({ where: { id: taskId } });
    return { message: 'Tarefa deletada com sucesso!' };
  }
}
