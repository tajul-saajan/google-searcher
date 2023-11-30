import { Inject, Injectable } from '@nestjs/common';
import { FileParser, IFileParser } from '../parser/interfaces/file.parser';
import { CsvField } from '../types/csvField';

@Injectable()
export class ParserService {
  private readonly MAX_ALLOWED_KEYWORDS = 100;
  private readonly MIN_ALLOWED_KEYWORDS = 1;
  constructor(@Inject(IFileParser) private readonly parser: FileParser) {}
  async parseAndValidate(file: Express.Multer.File) {
    const csvFields = await this.parser.parseData<CsvField>(file);
    const valid = this.validateLength(csvFields.length);

    return { data: csvFields, valid };
  }

  async validateLength(parsedDataLength: number) {
    return (
      parsedDataLength >= this.MIN_ALLOWED_KEYWORDS &&
      parsedDataLength <= this.MAX_ALLOWED_KEYWORDS
    );
  }
}
