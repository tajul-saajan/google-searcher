import { GoogleSearcher } from './google.searcher';
import { Test } from '@nestjs/testing';
import { ISearcher } from '../interfaces/searcher.interface';

const mockPage = {
  goto: jest.fn(),
  waitForSelector: jest.fn(),
  evaluate: jest.fn(),
  waitForTimeout: jest.fn(),
  content: jest.fn(),
};

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  }),
}));
describe('GoogleSearcher', () => {
  let searcher: GoogleSearcher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ISearcher,
          useClass: GoogleSearcher,
        },
      ],
    }).compile();

    searcher = module.get<GoogleSearcher>(ISearcher);
    mockPage.goto.mockClear();
    mockPage.waitForSelector.mockClear();
    mockPage.evaluate.mockClear();
  });

  it('should be defined', () => {
    expect(searcher).toBeDefined();
  });
});
