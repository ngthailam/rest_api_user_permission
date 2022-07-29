import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export const refreshTokenConsts = {
  tableName: 'refresh_token',
  colId: 'id',
  colToken: 'token',
  colCreatedAt: 'created_at',
  colUserId: 'user_id',
};

@Entity({ name: refreshTokenConsts.tableName })
export class RefreshToken {
  @PrimaryGeneratedColumn({ name: refreshTokenConsts.colId })
  public id: number;

  // Is in hashed form
  @Column({ name: refreshTokenConsts.colToken })
  public hashedToken: string;

  @Column({ name: refreshTokenConsts.colCreatedAt })
  public createdAt: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  public user: User;
}
