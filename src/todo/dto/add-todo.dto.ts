import {
    IsString,
    IsIn,
    MaxLength,
    MinLength,
    IsOptional,
  } from 'class-validator';
  import { StatusEnum } from '../status.enum';
  import { ErrorMessages } from '../error-messages/error-messages';
  
  export class AddTodoDto {
    @IsString()
    @IsOptional()
    @MinLength(3, {
      message: ErrorMessages.NameError.MinLength,
    })
    @MaxLength(10, {
      message: ErrorMessages.NameError.MaxLength,
    })
    name: string;
  
    @IsString()
    @IsOptional()
    description: string;
  
    @IsString()
    @IsOptional()
    @IsIn(Object.values(StatusEnum), { message: 'Statut invalide' })
    status: StatusEnum;
    
  }
  