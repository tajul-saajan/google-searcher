import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SearchStat } from '../../entities/search-stat.entity';
import { Inject } from '@nestjs/common';
import {
  ISearcher,
  Searcher,
} from '../../searcher/interfaces/searcher.interface';
import { EntityManager } from 'typeorm';

@Processor('search')
export class SearchConsumer {
  constructor(
    @Inject(ISearcher) private readonly searcher: Searcher,
    private readonly entityManager: EntityManager,
  ) {}
  @Process()
  async search(job: Job<Pick<SearchStat, 'id' | 'keyword'>>) {
    const { keyword, id } = job.data;
    const result = await this.searcher.search(keyword);
    await this.entityManager.save(SearchStat, {
      ...result,
      keyword,
      isProcessed: true,
      id,
    });
    console.log('saved to db');
  }
}
