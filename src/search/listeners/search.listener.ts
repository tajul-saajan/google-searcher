import { OnEvent } from '@nestjs/event-emitter';
import { FileUploadedEvent } from '../events/file-uploaded.event';
import { Inject, Injectable } from '@nestjs/common';
import {
  ISearcher,
  Searcher,
} from '../../searcher/interfaces/searcher.interface';
import { EntityManager } from 'typeorm';
import { SearchStat } from '../../entities/search-stat.entity';

@Injectable()
export class SearchListener {
  constructor(
    @Inject(ISearcher) private readonly searcher: Searcher,
    private readonly entityManager: EntityManager,
  ) {}
  @OnEvent('file.uploaded', { async: true })
  async handleOrderCreatedEvent(payload: FileUploadedEvent) {
    for (const { keyword } of payload.rowObject) {
      const result = await this.searcher.search(keyword);
      await this.entityManager.save(SearchStat, {
        ...result,
        keyword,
      });
      console.log('saved to db');
    }
  }
}
