import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SkillEntity } from 'src/skill/entities/skill.entity';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsNumber()
  @IsNotEmpty()
  age: number;
  @IsString()
  @IsNotEmpty()
  cin: number;
  @IsNotEmpty()
  @IsString()
  job: string;
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  @IsArray()
  skills: string[];
}
