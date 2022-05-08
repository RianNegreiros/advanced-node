import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'facebook_id', nullable: true })
  facebookId?: string

  @Column({ name: 'picture', nullable: true })
  pictureUrl?: string

  @Column({ name: 'initials', nullable: true })
  initials?: string
}
