import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { TaskResponseDto } from './dto/task.response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasksByUserId(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ tasks: TaskResponseDto[]; total: number }> {
    const userId = req.user.id;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.taskService.getTasksByUserId(userId, pageNumber, limitNumber);
  }
  @Post()
  async createTask(
    @Req() req,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const userId = req.user.id; // Obtém o userId do token JWT
    return this.taskService.createTask({ ...dto, userId });
  }

  @Patch(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTask(taskId, dto);
  }

  @Delete(':taskId')
  @HttpCode(200)
  async deleteTask(@Param('taskId') taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
