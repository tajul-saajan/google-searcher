import { Module } from '@nestjs/common';
import { SearchStatService } from './search-stat.service';
import { SearchStatController } from './search-stat.controller';

@Module({
  providers: [SearchStatService],
  controllers: [SearchStatController],
})
export class SearchStatModule {}
