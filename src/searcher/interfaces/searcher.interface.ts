export interface Searcher {
  search(keyword: string): any;
}

export const ISearcher = Symbol('ISearcher');
