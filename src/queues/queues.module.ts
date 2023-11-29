import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SearchConsumer } from './search/search.consumer';
import { SearcherModule } from '../searcher/searcher.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'search',
    }),
    SearcherModule,
  ],
  providers: [SearchConsumer],
})
export class QueuesModule {}
