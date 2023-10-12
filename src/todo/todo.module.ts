import { Global, Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],

  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
