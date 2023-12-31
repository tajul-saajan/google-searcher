import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SearchStat } from '../entities/search-stat.entity';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class SearchStatService {
  constructor(private readonly entityManager: EntityManager) {}

  async findMany(search: string, pgQuery: PaginateQuery) {
    const query = this.entityManager.createQueryBuilder(SearchStat, 'ss');
    if (search) {
      query.where('ss.keyword LIKE :search', { search: `%${search}%` });
    }

    return await paginate(pgQuery, query, {
      filterableColumns: {
        keyword: [FilterOperator.ILIKE],
      },
      searchableColumns: [],
      select: ['keyword', 'adsCount', 'linksCount', 'totalResultsCount'],
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']],
      nullSort: 'last',
    });

    // return await query.getMany();
  }

  async getKeywords(pgQuery: PaginateQuery) {
    return await paginate(
      pgQuery,
      this.entityManager.getRepository(SearchStat),
      {
        filterableColumns: {
          keyword: [FilterOperator.ILIKE],
        },
        searchableColumns: [],
        select: ['keyword'],
        sortableColumns: ['id'],
        defaultSortBy: [['id', 'DESC']],
        nullSort: 'last',
      },
    );
  }

  async findOne(id: number) {
    return await this.entityManager.findOneBy(SearchStat, { id });
  }
}
