import {
  Controller,
  FileTypeValidator,
  Inject,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileParser, IFileParser } from '../parser/interfaces/file.parser';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileUploadedEvent } from './events/file-uploaded.event';
import { Response, Request } from 'express';
import { CsvField } from '../types/csvField';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(IFileParser) private readonly parser: FileParser,
    private readonly eventEmitter: EventEmitter2,

    private readonly service: SearchService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async postCsvFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    console.log(file);
    const keywords = await this.parser.parseData<CsvField>(file);
    this.service.deleteFile();
    this.eventEmitter.emit('file.uploaded', new FileUploadedEvent(keywords));

    console.log(request.user, 'user');

    // @ts-ignore
    request.session.data = {
      success: true,
      message:
        'Your file has been uploaded. Your results will be displayed as they are available',
    };
    response.redirect('/search-stat');
  }
}
