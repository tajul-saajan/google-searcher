import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Searcher } from '../interfaces/searcher.interface';
import { SearchStat } from '../../entities/search-stat.entity';

@Injectable()
export class GoogleSearcher implements Searcher {
  async search(query: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Perform a Google search
    await page.goto(`https://www.google.com/search?q=${query}&hl=en`);

    // Wait for 5 seconds (adjust the duration as needed)
    await page.waitForTimeout(1000);

    // Scrape the search results
    const results = await page.evaluate(() => {
      const ads = document.getElementById('taw');
      const adLinks = ads.querySelectorAll('a');

      const anchors = document.querySelectorAll('a');
      let linksCount = 0;
      for (const [k, v] of anchors.entries()) {
        if (v.href) linksCount++;
      }

      const resultText = document.getElementById('result-stats').innerText;
      const match = resultText.match(/\d[\d,]*/);
      const totalResultsCount = Number(match[0].replace(/,/g, ''));

      return {
        adsCount: adLinks.length,
        linksCount,
        totalResultsCount,
      };
    });

    const cachedResponse = await page.content();

    await browser.close();

    return { ...results, cachedResponse } as SearchStat;
  }
}
