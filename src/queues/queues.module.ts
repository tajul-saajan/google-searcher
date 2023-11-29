import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SearchConsumer } from './search/search.consumer';
import { SearcherModule } from '../searcher/searcher.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'search',
      useFactory: async (configService: ConfigService) => ({
        defaultJobOptions: {
          attempts: configService.get('BULL_RETRY_ATTEMPTS'),
          backoff: {
            type: 'exponential',
            delay: configService.get('BULL_RETRY_DELAY'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    SearcherModule,
  ],
  providers: [SearchConsumer],
})
export class QueuesModule {}
