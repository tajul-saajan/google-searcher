import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class SearchService {
  deleteFile() {
    const filePath = `${process.cwd()}/uploads`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
        return;
      }
      console.log('File has been deleted.');
    });
  }
}
