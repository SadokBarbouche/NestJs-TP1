import { TimestampEntities } from '../../todo/Generics/timestamp.entities';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CvEntity } from '../../cv/entities/cv.entity';
@Entity('skill')
export class SkillEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  designation: string;
  @ManyToMany(() => CvEntity, (cv) => cv.skills)
  cvs: CvEntity[];
}
