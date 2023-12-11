import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Searcher } from '../interfaces/searcher.interface';
import { SearchStat } from '../../entities/search-stat.entity';

@Injectable()
export class GoogleSearcher implements Searcher {
  private ID_RESULT_STAT_CONTAINER = 'result-stats' as const;
  private ID_AD_LINK_CONTAINER = 'taw' as const;
  private TAG_ANCHOR = 'a' as const;
  async search(query: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Perform a Google search
    await page.goto(`https://www.google.com/search?q=${query}&hl=en`);

    // Wait for 5 seconds (adjust the duration as needed)
    await page.waitForTimeout(1000);

    // define methods to have browser context

    // Scrape the search results
    const results = await page.evaluate(() => {
      const calculateAdLinkCount = () => {
        const ads = document.getElementById(this.ID_AD_LINK_CONTAINER);
        return ads ? ads.querySelectorAll(this.TAG_ANCHOR).length : 0;
      };

      const calculateTotalLinks = () => {
        const anchors = document.querySelectorAll(this.TAG_ANCHOR);
        return Array.from(anchors).filter((anchor) => anchor.href).length;
      };

      const parseTotalSearchResults = () => {
        const resultStat = document.getElementById(
          this.ID_RESULT_STAT_CONTAINER,
        );
        if (resultStat && resultStat.innerText) {
          const match = resultStat.innerText.match(/\d[\d,]*/);
          return match ? Number(match[0].replace(/,/g, '')) : 0;
        }
        return 0;
      };

      const adsCount = calculateAdLinkCount.call(this);
      const linksCount = calculateTotalLinks.call(this);
      const totalResultsCount = parseTotalSearchResults.call(this);

      return { adsCount, linksCount, totalResultsCount };
    });

    const cachedResponse = await page.content();

    await browser.close();

    return { ...results, cachedResponse } as SearchStat;
  }
}
