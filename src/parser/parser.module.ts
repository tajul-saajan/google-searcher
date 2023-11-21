import { Module } from '@nestjs/common';
import { IFileParser } from './interfaces/file.parser';
import { CsvParser } from './providers/csv.parser';

@Module({
  providers: [{ provide: IFileParser, useClass: CsvParser }],
  exports: [IFileParser],
})
export class ParserModule {}
