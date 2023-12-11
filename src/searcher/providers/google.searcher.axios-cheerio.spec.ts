import { Test, TestingModule } from '@nestjs/testing';

import axios from 'axios';
import { GoogleSearcherAxiosCheerio } from './google.searcher.axios-cheerio';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleSearcherAxiosCheerio', () => {
  let service: GoogleSearcherAxiosCheerio;
  let response: { data: string };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleSearcherAxiosCheerio],
    }).compile();

    service = module.get<GoogleSearcherAxiosCheerio>(
      GoogleSearcherAxiosCheerio,
    );

    response = {
      data: '<html> <body>Mocked HTML response for google search page</body> </html>',
    };
    mockedAxios.get.mockResolvedValue(response);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return search results', async () => {
    const result = await service.search('test keyword');
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('https://www.google.com/search?q=test%20keyword'),
      expect.objectContaining({
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        },
      }),
    );
    expect(result).toHaveProperty('adsCount');
    expect(result).toHaveProperty('linksCount');
    expect(result).toHaveProperty('totalResultsCount');
    expect(result).toHaveProperty('cachedResponse');
  });

  // Add more tests as needed
});
