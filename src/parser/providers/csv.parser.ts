import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parseFile } from 'fast-csv';
import { FileParser } from '../interfaces/file.parser';

@Injectable()
export class CsvParser implements FileParser {
  async parseData<T>(file: Express.Multer.File): Promise<T[]> {
    const filePath = `${process.cwd()}/uploads`;

    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(filePath, file.buffer);
        const rows: T[] = [];
        parseFile(filePath, { headers: true })
          .on('data', (row) => rows.push(row))
          .on('end', () => {
            // todo file delete functionalities separately
            // fs.unlink(filePath, (err) => {
            //   if (err) {
            //     console.error('Error deleting the file:', err);
            //     return;
            //   }
            //   console.log('File has been deleted.');
            // });
            // console.log('ended', rows);
            resolve(rows);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
