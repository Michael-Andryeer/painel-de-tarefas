import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    getTasksByUserId: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  describe('getTasksByUserId', () => {
    it('deve chamar o service com paginação convertida para number', async () => {
      const req = { user: { id: 'user-123' } };
      const page = '2';
      const limit = '20';

      const expectedResult = { tasks: [], total: 0 };
      mockTaskService.getTasksByUserId.mockResolvedValue(expectedResult);

      const result = await controller.getTasksByUserId(req, page, limit);

      expect(service.getTasksByUserId).toHaveBeenCalledWith('user-123', 2, 20);
      expect(result).toEqual(expectedResult);
    });

    it('deve usar valores padrão para paginação se não fornecidos', async () => {
      const req = { user: { id: 'user-123' } };

      await controller.getTasksByUserId(req);

      expect(service.getTasksByUserId).toHaveBeenCalledWith('user-123', 1, 10);
    });
  });

  describe('createTask', () => {
    it('deve pegar o userId do request e chamar create no service', async () => {
      const req = { user: { id: 'user-123' } };
      const dto: CreateTaskDto = {
        title: 'Minha tarefa',
        description: 'Descrição',
        status: 'PENDENTE',
        priority: 'ALTA',
        dueDate: new Date(),
        startDate: new Date(),
      };

      const expectedResult = { id: '1', ...dto, userId: 'user-123' };
      mockTaskService.createTask.mockResolvedValue(expectedResult);

      const result = await controller.createTask(req, dto);

      expect(service.createTask).toHaveBeenCalledWith({
        ...dto,
        userId: 'user-123',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTask', () => {
    it('deve chamar o service com o ID correto e o DTO', async () => {
      const taskId = 'task-1';
      const dto: UpdateTaskDto = { title: 'New Title' };
      const expectedResult = { id: taskId, title: 'New Title' };

      mockTaskService.updateTask.mockResolvedValue(expectedResult);

      const result = await controller.updateTask(taskId, dto);

      expect(service.updateTask).toHaveBeenCalledWith(taskId, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteTask', () => {
    it('deve chamar o service para deletar', async () => {
      const taskId = 'task-1';
      const expectedResult = { message: 'Deleted' };

      mockTaskService.deleteTask.mockResolvedValue(expectedResult);

      const result = await controller.deleteTask(taskId);

      expect(service.deleteTask).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedResult);
    });
  });
});
