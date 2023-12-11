import { SearchService } from './search.service';
import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { CsvField } from '../types/csvField';

describe('SearchService', () => {
  let searchService: SearchService;
  let entityManager: EntityManager;

  const mockEntityManager = {
    save: jest.fn(),
  };
  const mockQueue = {
    add: jest.fn(),
    process: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: 'BullQueue_search',
          useValue: mockQueue,
        },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(searchService).toBeDefined();
  });

  it('should create a search stat record in database for each keyword', async () => {
    const csvFields: CsvField[] = [
      { keyword: 'java' },
      { keyword: 'javascript' },
      { keyword: 'php' },
    ];
    const length = csvFields.length;

    await searchService.processKeywords(csvFields);
    expect(entityManager.save).toBeCalled();
    expect(entityManager.save).toBeCalledTimes(length);
  });

  it('should add the created record to the queue', async () => {
    const csvFields: CsvField[] = [
      { keyword: 'java' },
      { keyword: 'javascript' },
      { keyword: 'php' },
    ];
    const length = csvFields.length;

    await searchService.processKeywords(csvFields);
    expect(entityManager.save).toBeCalled();
    expect(mockQueue.add).toBeCalledTimes(length);
  });
});
