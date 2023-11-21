import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Searcher } from '../interfaces/searcher.interface';

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
      let count = 0;
      for (const [k, v] of anchors.entries()) {
        if (v.href) count++;
      }

      const resultText = document.getElementById('result-stats').innerText;
      console.log(resultText);
      const match = resultText.match(/\d[\d,]*/);
      const resultCount = Number(match[0].replace(/,/g, ''));

      return {
        ad_count: adLinks.length,
        count,
        resultCount,
        resultText,
      };
    });

    const html = await page.content();

    await browser.close();

    return { ...results, html };
  }
}
