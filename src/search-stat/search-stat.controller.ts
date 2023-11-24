import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Render,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SearchStatService } from './search-stat.service';
import { IsAuthenticatedGuard } from '../guards/is-authenticated';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('search-stat')
export class SearchStatController {
  constructor(private readonly service: SearchStatService) {}

  @UseGuards(IsAuthenticatedGuard)
  @Render('home')
  @Get()
  async findMany(
    @Query() { search },
    @Session() session: Record<string, any>,
    @Paginate() query: PaginateQuery,
  ) {
    const results = await this.service.findMany(search, query);
    console.log(results);
    const { data } = session;
    delete session.data;
    return { results, ...data };
  }

  @Get('keywords')
  async keywordList() {
    return await this.service.getKeywords();
  }

  @Render('details')
  @Get('details/:id')
  async getDetails(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return await this.service.findOne(id);
  }
}
