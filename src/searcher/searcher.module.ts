import { Module } from '@nestjs/common';
import { ISearcher } from './interfaces/searcher.interface';
import { GoogleSearcher } from './providers/google.searcher';

@Module({
  providers: [{ provide: ISearcher, useClass: GoogleSearcher }],
  exports: [ISearcher],
})
export class SearcherModule {}
