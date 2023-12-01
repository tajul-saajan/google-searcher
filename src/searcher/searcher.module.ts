import { Module } from '@nestjs/common';
import { ISearcher } from './interfaces/searcher.interface';
import { GoogleSearcherAxiosCheerio } from './providers/google.searcher.axios-cheerio';

@Module({
  providers: [{ provide: ISearcher, useClass: GoogleSearcherAxiosCheerio }],
  exports: [ISearcher],
})
export class SearcherModule {}
