import {
  Controller,
  Get,
  Query,
  Render,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SearchStatService } from './search-stat.service';
import { IsAuthenticatedGuard } from '../guards/is-authenticated';

@Controller('search-stat')
export class SearchStatController {
  constructor(private readonly service: SearchStatService) {}

  @UseGuards(IsAuthenticatedGuard)
  @Render('home')
  @Get()
  async findMany(@Query() { search }, @Session() session: Record<string, any>) {
    const results = await this.service.findMany(search);
    const { data } = session;
    delete session.data;
    return { results, ...data };
  }

  @Get('keywords')
  async keywordList() {
    return await this.service.getKeywords();
  }
}
