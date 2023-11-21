import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParserModule } from '../parser/parser.module';
import { SearchListener } from './listeners/search.listener';
import { SearcherModule } from '../searcher/searcher.module';

@Module({
  imports: [ParserModule, SearcherModule],
  controllers: [SearchController],
  providers: [SearchService, SearchListener],
})
export class SearchModule {}
