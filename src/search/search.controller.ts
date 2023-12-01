import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { SearchService } from './search.service';
import { ParserService } from './parser.service';

@Controller('search')
export class SearchController {
  private readonly MAX_ALLOWED_KEYWORDS = 100;
  constructor(
    private readonly parserService: ParserService,
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
    let message =
      'Your file has been uploaded. Your results will be displayed as they are available';
    const { data, valid } = await this.parserService.parseAndValidate(file);
    this.searchService.deleteFile();
    if (!valid) {
      message = `Uploaded file should not contain more than ${this.MAX_ALLOWED_KEYWORDS} keywords`;
      request.flash('upload.error', message);
    } else {
      request.flash('upload.success', message);
      this.searchService.processKeywords(data);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.redirect('/search-stat');
  }
}
