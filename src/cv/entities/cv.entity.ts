import { SkillEntity } from '../../skill/entities/skill.entity';
import { TimestampEntities } from '../../todo/Generics/timestamp.entities';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cv')
export class CvEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  firstname: string;
  @Column()
  age: number;
  @Column()
  cin: number;
  @Column()
  job: string;
  @Column()
  path: string;

  @ManyToMany(() => SkillEntity, (skill) => skill.cvs)
  @JoinTable()
  skills: SkillEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.cvs)
  user: UserEntity;
}
