import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SearchStatService } from './search-stat.service';
import { IsAuthenticatedGuard } from '../guards/is-authenticated';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Response, Request } from 'express';

@Controller('search-stat')
export class SearchStatController {
  constructor(private readonly service: SearchStatService) {}

  @UseGuards(IsAuthenticatedGuard)
  // @Render('home')
  @Get()
  async findMany(
    @Query() { search },
    @Session() session: Record<string, any>,
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
    @Res() response: Response,
  ) {
    const results = await this.service.findMany(search, query);
    const success = request.flash('upload.success');
    const error = request.flash('upload.error');
    // delete session.data;
    response.render('home', {
      layout: 'template',
      data: { results, success, error },
    });
  }

  @UseGuards(IsAuthenticatedGuard)
  @Get('keywords')
  async keywordList(
    @Paginate() query: PaginateQuery,
    @Res() response: Response,
  ) {
    const data = await this.service.getKeywords(query);
    response.render('keywords', { layout: 'template', data });
  }

  @UseGuards(IsAuthenticatedGuard)
  @Get('details/:id')
  async getDetails(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ) {
    const data = await this.service.findOne(id);
    response.render('details', { layout: 'template', data });
  }
}
