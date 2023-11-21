import { Injectable } from '@nestjs/common';
import { EntityManager, Like } from 'typeorm';
import { SearchStat } from '../entities/search-stat.entity';

@Injectable()
export class SearchStatService {
  constructor(private readonly entityManager: EntityManager) {}

  async findMany(search: string) {
    const query = this.entityManager.createQueryBuilder(SearchStat, 'ss');
    if (search) {
      query.where('ss.keyword LIKE :search', { search: `%${search}%` });
    }

    return await query.getMany();
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
