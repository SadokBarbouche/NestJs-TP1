import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEntity } from './entities/cv.entity';
import { SkillEntity } from '../skill/entities/skill.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CvEntity)
    private cvRepository: Repository<CvEntity>,
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  // C
  async addCv(createCvDto: CreateCvDto, user: UserEntity) {
    const { skills, ...cvData } = createCvDto;
    const cv = this.cvRepository.create(cvData);
    cv.skills = [];
    for (const skill of createCvDto.skills) {
      const skillEntity = await this.skillRepository.findOne({
        where: {
          designation: skill,
        },
      });
      if (skillEntity) {
        cv.skills.push(skillEntity);
      } else {
        const newSkill = this.skillRepository.create();
        newSkill.designation = skill;
        await this.skillRepository.save(newSkill);
        cv.skills.push(newSkill);
      }
    }
    cv.user = user;
    return await this.cvRepository.save(cv);
  }

  async addCvGivenACV(cv: CvEntity, user: UserEntity) {
    cv.user = user;
    return await this.cvRepository.save(cv);
  }

  // R
  async findAll() {
    return await this.cvRepository.find({
      relations: ['skills'],
    });
  }

  async findOne(id: number) {
    return await this.cvRepository.findOne({
      where: {
        id: id,
      },
      relations: ['skills'],
    });
  }

  async getAllCvByUser(userId: number) {}
  // U
  async update(id: number, updateCvDto: UpdateCvDto, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: {
        id: id,
      },
      relations: ['skills', 'user'],
    });
    if (!cv) {
      throw new NotFoundException('Cv introuvable');
    }
    if (cv.user.id !== userId) {
      throw new UnauthorizedException(
        'User ${id} n a pas le droit de modifier le cv ${cv.id}',
      );
    }
    const updatedCv = { updateCvDto, ...cv };
    return await this.cvRepository.save(updatedCv);
  }
  // D
  async remove(id: number, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: {
        id: id,
      },
      relations: ['skills', 'user'],
    });
    if (!cv) {
      throw new NotFoundException(
        'User ${id} n a pas le droit de modifier le cv ${cv.id}',
      );
    }
    if (cv.user.id !== userId) {
      throw new UnauthorizedException(
        `User with id ${userId} is not authorized to delete this CV`,
      );
    }
    await this.cvRepository.remove(cv);
  }
}
