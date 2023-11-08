import { IsNotEmpty } from 'class-validator';

export class LoginCredsDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
