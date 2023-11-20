import { Injectable } from '@nestjs/common';
import { EntityManager, Like } from 'typeorm';
import { SearchStat } from '../entities/search-stat.entity';

@Injectable()
export class SearchStatService {
  constructor(private readonly entityManager: EntityManager) {}

  async findMany(search: string) {
    return await this.entityManager.find(SearchStat, {
      where: {
        keyword: Like(`${search}`),
      },
    });
  }

  async getKeywords() {
    return await this.entityManager.find(SearchStat, {
      select: { keyword: true },
      order: {
        id: 'DESC',
      },
    });
  }
}
