import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoEntity } from './entities/todo.entity';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}
  @Post()
  async addTodo(@Body() todo: AddTodoDto): Promise<TodoEntity> {
    return await this.todoService.addTodo(todo);
  }

  @Get('/todo-paginated')
  async getAllTodoPaginated(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<TodoEntity[]> {
    return this.todoService.getAllTodosPaginated(page, pageSize);
  }

  @Get('/todo-by')
  async getTodoByNameDescriptionStatus(
    @Query('name') name: string,
    @Query('description') description: string,
    @Query('status') status: string,
  ): Promise<TodoEntity[]> {
    return await this.todoService.getTodoByNameDescriptionStatus(
      name,
      description,
      status,
    );
  }
  @Patch(':id')
  async updateTodo(
    @Body() todo: UpdateTodoDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TodoEntity> {
    return await this.todoService.updateTodo(id, todo);
  }

  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.deleteTodo(id);
  }

  @Delete('softd/:id')
  async softDeleteTodo(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.softDeleteTodo(id);
  }

  @Delete('softr/:id')
  async softRemoveTodo(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.softRemoveTodo(id);
  }

  @Get('recover/:id')
  async recoverTodo(@Param('id', ParseIntPipe) id: number) {
    await this.todoService.recoverTodoById(id);
  }

  @Get('count-status')
  async countTodoStatus() {
    return await this.todoService.getTodoCountByStatus();
  }

  @Get()
  async getAllTodo(): Promise<TodoEntity[]> {
    return await this.todoService.getAllTodos();
  }
  @Get(':id')
  async getTodoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TodoEntity> {
    return await this.todoService.getTodoById(id);
  }
}
