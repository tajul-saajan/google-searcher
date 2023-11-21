import { SearchStat } from '../../entities/search-stat.entity';

export interface Searcher {
  search(keyword: string): Promise<SearchStat>;
}

export const ISearcher = Symbol('ISearcher');
