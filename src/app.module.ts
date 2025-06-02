import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './Core/configService';

dotenv.config();
@Module({
  imports: [AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt('6543', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migration',
  migrations: [__dirname + '/migration/*{.ts,.js}'],

  synchronize: true,
  verboseRetryLog: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
