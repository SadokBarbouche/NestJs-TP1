import { CvEntity } from '../../cv/entities/cv.entity';
import { TimestampEntities } from '../../todo/Generics/timestamp.entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user')
export class UserEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 25,
  })
  username: string;
  @Column({
    length: 60,
  })
  email: string;
  @Column({
    length: 60,
  })
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => CvEntity, (cv) => cv.user)
  cvs: CvEntity[];
}
