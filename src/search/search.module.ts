import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParserModule } from '../parser/parser.module';
import { SearcherModule } from '../searcher/searcher.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ParserModule,
    SearcherModule,
    BullModule.registerQueueAsync({
      name: 'search',
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
