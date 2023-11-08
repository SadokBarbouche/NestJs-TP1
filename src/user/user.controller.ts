import { Body, Controller, Post } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginCredsDto } from './dto/login-creds.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  register(@Body() userData: UserSubscribeDto) {
    return this.userService.register(userData);
  }
  @Post('login')
  login(@Body() creditentials: LoginCredsDto) {
    return this.userService.login(creditentials);
  }
}
