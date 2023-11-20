import { Controller, Get, Query } from '@nestjs/common';
import { SearchStatService } from './search-stat.service';

@Controller('search-stat')
export class SearchStatController {
  constructor(private readonly service: SearchStatService) {}
  @Get()
  async findMany(@Query() search: string) {
    return await this.service.findMany(search);
  }

  @Get('keywords')
  async keywordList() {
    return await this.service.getKeywords();
  }
}
