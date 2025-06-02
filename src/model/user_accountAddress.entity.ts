import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class user_accountAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string; //

  @OneToOne(() => User, {
    eager: false,
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User; //

  @Column({ name: 'amount_deposited', nullable: true })
  amountDeposited: number;

  @Column({ name: 'account_public_key', nullable: false , default : "123"})
  accountPublicKey: string;

  @Column({ name: 'account_private_key', nullable: false  , default : "123"})
  accountPrivateKey: string;

  @Column({ name: 'account_address', nullable: false  , default : "123"})
  accountAddress: string;
}
