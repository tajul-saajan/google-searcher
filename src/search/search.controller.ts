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
import { ParserService } from './parser.service';

@Controller('search')
export class SearchController {
  private readonly MAX_ALLOWED_KEYWORDS = 100;
  constructor(
    private readonly parserService: ParserService,
    private readonly eventEmitter: EventEmitter2,

    private readonly searchService: SearchService,
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
    const sessionData = {
      success: true,
      message:
        'Your file has been uploaded. Your results will be displayed as they are available',
    };
    const { data, valid } = await this.parserService.parseAndValidate(file);
    this.searchService.deleteFile();
    if (!valid) {
      sessionData.success = false;
      sessionData.message = `Uploaded file should not contain more than ${this.MAX_ALLOWED_KEYWORDS} keywords`;
    } else this.eventEmitter.emit('file.uploaded', new FileUploadedEvent(data));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.session.data = sessionData;
    response.redirect('/search-stat');
  }
}
