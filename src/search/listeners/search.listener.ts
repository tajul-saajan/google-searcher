import { OnEvent } from '@nestjs/event-emitter';
import { FileUploadedEvent } from '../events/file-uploaded.event';
import { Inject, Injectable } from '@nestjs/common';
import {
  ISearcher,
  Searcher,
} from '../../searcher/interfaces/searcher.interface';

@Injectable()
export class SearchListener {
  constructor(@Inject(ISearcher) private readonly searcher: Searcher) {}
  @OnEvent('file.uploaded', { async: true })
  async handleOrderCreatedEvent(payload: FileUploadedEvent) {
    for (const keyword of payload.keywords) {
      const result = await this.searcher.search(keyword);
      console.log(result);
    }
  }
}
