import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { LoginCredsDto } from './dto/login-creds.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id });
  }
  async register(userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
    const { username, password, email } = userData;
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException('username already exists');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
    };
  }
  async login(creditentials: LoginCredsDto) {
    const { username, password } = creditentials;
    const name = username;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :name', { name })
      .getOne();
    if (!user) {
      throw new NotFoundException('username introuvable');
    }
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
    };

    const testPassword = await bcrypt.compare(password, user.password);
    // console.log(hashedPassword.length);
    // console.log(hashedPassword, user.password);
    if (testPassword) {
      const jwt = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });

      return {
        access_token: jwt,
      };
    } else {
      throw new NotFoundException('Password INCORRECT');
    }
  }
}
