import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { SearchStat } from '../../entities/search-stat.entity';
import { Inject } from '@nestjs/common';
import {
  ISearcher,
  Searcher,
} from '../../searcher/interfaces/searcher.interface';
import { EntityManager } from 'typeorm';
import { SearchStatus } from '../../types/enums/searchStatus';

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

  // This method is called when a job fails after all attempts
  @OnQueueFailed()
  async onFailed(job: Job, error: any) {
    const { keyword, id } = job.data;
    console.error(
      `Job failed after all attempts | keyword: ${keyword}, Error: ${error.message}`,
    );
    await this.entityManager.update(
      SearchStat,
      { id },
      { status: SearchStatus.FAILED },
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    const { keyword, id } = job.data;
    console.info(`Job completed | keyword: ${keyword}`);
    await this.entityManager.update(
      SearchStat,
      { id },
      { status: SearchStatus.COMPLETED },
    );
  }
}
