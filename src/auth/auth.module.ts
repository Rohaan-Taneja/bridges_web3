import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/User.entity';
import { user_accountAddress } from '../model/user_accountAddress.entity';

@Module({
  imports :[TypeOrmModule.forFeature([User , user_accountAddress ])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
