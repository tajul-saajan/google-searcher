import { Searcher } from '../interfaces/searcher.interface';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchStat } from '../../entities/search-stat.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleSearcherAxiosCheerio implements Searcher {
  private ID_RESULT_STAT_CONTAINER = '#result-stats' as const;
  private ID_AD_LINK_CONTAINER = '#taw' as const;
  private TAG_ANCHOR = 'a' as const;
  async search(keyword: string) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      keyword,
    )}&hl=en`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);

    const adsCount = this.calculateAdLinkCount($);
    const linksCount = this.calculateTotalLinks($);
    const totalResultsCount = this.parseTotalSearchResults($);
    const cachedResponse = data;

    return {
      keyword,
      adsCount,
      linksCount,
      totalResultsCount,
      cachedResponse,
    } as SearchStat;
  }

  private calculateAdLinkCount($: cheerio.Root) {
    return $(this.ID_AD_LINK_CONTAINER).find(this.TAG_ANCHOR).length;
  }

  private calculateTotalLinks($: cheerio.Root) {
    return $(this.TAG_ANCHOR).length;
  }

  private parseTotalSearchResults($: cheerio.Root) {
    const resultStatsText = $(this.ID_RESULT_STAT_CONTAINER).text();
    const match = resultStatsText.match(/\d[\d,]*/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }
}
