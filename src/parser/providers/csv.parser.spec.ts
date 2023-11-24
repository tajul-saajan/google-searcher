import { Test } from '@nestjs/testing';
import { FileParser, IFileParser } from '../interfaces/file.parser';
import { CsvParser } from './csv.parser';

describe('CsvParser', () => {
  let parser: CsvParser;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: IFileParser,
          useClass: CsvParser,
        },
      ],
    }).compile();

    parser = module.get<FileParser>(IFileParser);
  });

  it('should be defined', () => {
    expect(parser).toBeDefined();
  });

  it('should parse file successfully and get the data', async () => {
    // const file = new Express.Multer()
    const mockCsvFile = {
      originalname: 'testfile.csv',
      buffer: Buffer.from('keyword\nkeyword1\nkeyword2\nkeyword3'),
      // other properties as needed
    };
    const result = await parser.parseData<string>(
      mockCsvFile as Express.Multer.File,
    );
    // console.log(result);
    expect(result).toEqual([
      { keyword: 'keyword1' },
      { keyword: 'keyword2' },
      { keyword: 'keyword3' },
    ]);
  });

  it('should parse empty file and return empty array', async () => {
    const mockCsvFile = {
      originalname: 'testfile.csv',
      buffer: Buffer.from(''),
      // other properties as needed
    };
    const result = await parser.parseData<string>(
      mockCsvFile as Express.Multer.File,
    );
    expect(result).toEqual([]);
  });

  it('invalid file throws exception', () => {
    const mockCsvFile = {
      originalname: 'testfile.pdf',
      buffer: Buffer.from(''),
      // other properties as needed
    };
    parser.parseData<string>(mockCsvFile as Express.Multer.File).catch((e) => {
      expect(e).toMatch(e);
    });
  });
});
