import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';


dotenv.config({ path: '.env' });


class ConfigService {
  constructor() {}

  getTypeOrmConfig(): TypeOrmModuleOptions {
    console.log("this is the env value" , process.env.DB_PORT);
    return {
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
    };
  }
}

export const configService = new ConfigService();
