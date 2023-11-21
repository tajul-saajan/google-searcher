import {
  Controller,
  FileTypeValidator,
  Inject,
  ParseFilePipe,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileParser, IFileParser } from '../parser/interfaces/file.parser';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileUploadedEvent } from './events/file-uploaded.event';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(IFileParser) private readonly parser: FileParser,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Render('home')
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
    const keywords = await this.parser.parseData<string>(file);
    this.eventEmitter.emit('file.uploaded', new FileUploadedEvent(keywords));

    return {
      success: true,
      message:
        'Your file has been uploaded. Your results will be displayed as they are available',
    };
  }
}
