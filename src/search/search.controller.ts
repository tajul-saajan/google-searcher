import {
  Controller,
  FileTypeValidator,
  Inject,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileParser, IFileParser } from '../parser/interfaces/file.parser';

@Controller('search')
export class SearchController {
  constructor(@Inject(IFileParser) private readonly parser: FileParser) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async postDummy(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    const data = await this.parser.parseData<string[]>(file);
    console.log(data, 'pps');
  }
}
