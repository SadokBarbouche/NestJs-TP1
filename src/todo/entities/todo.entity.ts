import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  Validate,
  IsString,
  IsNotEmptyObject,
  isInstance,
  IsIn,
} from 'class-validator';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { ErrorMessages } from '../error-messages/error-messages';
import { StatusEnum } from '../status.enum';
import { TimestampEntities } from '../Generics/timestamp.entities';

@Entity('todo')
export class TodoEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @IsNotEmpty({
    message: ErrorMessages.NameError.Required,
  })
  @MinLength(3, {
    message: ErrorMessages.NameError.MinLength,
  })
  @MaxLength(10, {
    message: ErrorMessages.NameError.MaxLength,
  })
  @Column()
  description: string;
  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;
}
