import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import { SearchStatService } from './search-stat.service';
import { IsAuthenticatedGuard } from '../guards/is-authenticated';

@Controller('search-stat')
export class SearchStatController {
  constructor(private readonly service: SearchStatService) {}

  @UseGuards(IsAuthenticatedGuard)
  @Render('home')
  @Get()
  async findMany(@Query() { search }) {
    const results = await this.service.findMany(search);
    return { results };
  }

  @Get('keywords')
  async keywordList() {
    return await this.service.getKeywords();
  }
}
