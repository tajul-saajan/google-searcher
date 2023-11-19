import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    return {
      type: 'mysql',
      host: configService.getOrThrow('DB_HOST'),
      port: configService.getOrThrow<number>('DB_PORT'),
      database: configService.getOrThrow('DB_DATABASE'),
      username: configService.getOrThrow('DB_USERNAME'),
      password: configService.getOrThrow('DB_PASSWORD'),
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      entities: [__dirname + '/../**/*.entity.ts'],
      synchronize: true,
    };
  },
};
