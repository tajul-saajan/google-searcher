import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { SearchStatModule } from './search-stat/search-stat.module';
import { ParserModule } from './parser/parser.module';
import { SearchModule } from './search/search.module';
import { SearcherModule } from './searcher/searcher.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync(typeormConfig),
    SearchStatModule,
    ParserModule,
    SearchModule,
  ],
})
export class AppModule {}
