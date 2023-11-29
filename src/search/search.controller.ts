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
  private readonly MAX_ALLOWED_KEYWORDS = 100;
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
    const sessionData = {
      success: true,
      message:
        'Your file has been uploaded. Your results will be displayed as they are available',
    };
    const keywords = await this.parser.parseData<CsvField>(file);
    this.service.deleteFile();
    if (keywords.length > this.MAX_ALLOWED_KEYWORDS) {
      sessionData.success = false;
      sessionData.message = `Uploaded file should not contain more than ${this.MAX_ALLOWED_KEYWORDS} keywords`;
    }

    if (sessionData.success)
      this.eventEmitter.emit('file.uploaded', new FileUploadedEvent(keywords));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.session.data = sessionData;
    response.redirect('/search-stat');
  }
}
