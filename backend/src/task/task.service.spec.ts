import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getTasksByUserId', () => {
    it('deve retornar uma lista paginada de tarefas e o total', async () => {
      const userId = 'user-123';
      const tasks = [{ id: '1', title: 'Task 1', userId }];
      const total = 1;

      (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);
      (prisma.task.count as jest.Mock).mockResolvedValue(total);

      const result = await service.getTasksByUserId(userId, 1, 10);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({ tasks, total });
    });
  });

  describe('createTask', () => {
    it('deve criar uma tarefa conectada ao usuário', async () => {
      const userId = 'user-123';
      const createDto: CreateTaskDto = {
        title: 'Minha tarefa',
        description: 'Descrição',
        status: 'PENDENTE',
        priority: 'ALTA',
        dueDate: new Date(),
        startDate: new Date(),
      };

      const createdTask = { id: '1', ...createDto, userId };

      (prisma.task.create as jest.Mock).mockResolvedValue(createdTask);

      const result = await service.createTask({ ...createDto, userId });

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          description: createDto.description,
          status: createDto.status,
          priority: createDto.priority,
          dueDate: createDto.dueDate,
          startDate: createDto.startDate,
          user: {
            connect: { id: userId },
          },
        },
      });
      expect(result).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('deve atualizar uma tarefa existente', async () => {
      const taskId = 'task-1';
      const updateDto: UpdateTaskDto = { title: 'Updated' };
      const existingTask = { id: taskId, title: 'Old' };
      const updatedTask = { id: taskId, title: 'Updated' };

      (prisma.task.findUnique as jest.Mock).mockResolvedValue(existingTask);
      (prisma.task.update as jest.Mock).mockResolvedValue(updatedTask);

      const result = await service.updateTask(taskId, updateDto);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateDto,
      });
      expect(result).toEqual(updatedTask);
    });

    it('deve lançar NotFoundException se a tarefa não existir', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateTask('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('deve deletar uma tarefa existente', async () => {
      const taskId = 'task-1';
      (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: taskId });
      (prisma.task.delete as jest.Mock).mockResolvedValue({ id: taskId });

      const result = await service.deleteTask(taskId);

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual({ message: 'Tarefa deletada com sucesso!' });
    });

    it('deve lançar NotFoundException ao tentar deletar tarefa inexistente', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteTask('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
