import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './status.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async addTodo(todo: AddTodoDto): Promise<TodoEntity> {
    return await this.todoRepository.save(todo);
  }

  async updateTodo(id: number, todo: UpdateTodoDto): Promise<TodoEntity> {
    const newTodo = await this.todoRepository.preload({
      id,
      ...todo,
    });
    if (!newTodo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    return newTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    const todoToDelete = await this.todoRepository.findOneBy({ id });

    if (!todoToDelete) {
      throw new NotFoundException(`Le todo avec l'ID ${id} n'existe pas.`);
    }

    await this.todoRepository.remove(todoToDelete);
  }

  async softDeleteTodo(id: number): Promise<void> {
    const todoToSoftDelete = await this.todoRepository.findOneBy({ id });
    if (!todoToSoftDelete) {
      throw new NotFoundException(`Le todo avec l'ID ${id} n'existe pas.`);
    }

    await this.todoRepository.softDelete({ id }); // soft delete => deletedAt
  }

  async softRemoveTodo(id: number): Promise<void> {
    const todoToSoftTodo = await this.todoRepository.findOneBy({ id });
    if (!todoToSoftTodo) {
      throw new NotFoundException(`Le todo avec l'ID ${id} n'existe pas.`);
    }

    await this.todoRepository.softRemove({ id });
  }

  async recoverTodoById(id: number): Promise<void> {
    await this.todoRepository.restore(id);
  }

  async getTodoCountByStatus() {
    const statusCounts = {};
    for (const status of Object.values(StatusEnum)) {
      const count = await this.todoRepository.count({ where: { status } });
      statusCounts[status] = count;
    }
    return statusCounts;
  }

  async getAllTodos(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }

  async getAllTodosPaginated(
    page: number,
    pageSize: number,
  ): Promise<TodoEntity[]> {
    const todos = await this.todoRepository
      .createQueryBuilder('todo')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    return todos;
  }

  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Le todo avec l'ID ${id} n'existe pas.`);
    }
    return todo;
  }

  async getTodoByNameDescriptionStatus(
    name: string,
    description: string,
    status: string,
  ): Promise<TodoEntity[]> {
    console.log(name);
    console.log(description);
    console.log(status);

    const queryBuilder = this.todoRepository
      .createQueryBuilder('todo')
      .select(['todo.name', 'todo.description', 'todo.status']);

    if (name) {
      queryBuilder.where('todo.name LIKE :nom', { nom: `%${name}%` });
    }

    if (description) {
      queryBuilder.orWhere('todo.description LIKE :desc', {
        desc: `%${description}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('todo.status = :st', { st: status });
    }

    console.log(queryBuilder.getSql());
    return await queryBuilder.getMany();
  }
}
