import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CsvField } from '../types/csvField';
import { EntityManager } from 'typeorm';
import { SearchStat } from '../entities/search-stat.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SearchService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectQueue('search') private readonly searchQueue: Queue,
  ) {}
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

  async processKeywords(keywords: CsvField[]) {
    for (const { keyword } of keywords) {
      const statData = await this.entityManager.save(SearchStat, { keyword });
      await this.searchQueue.add(statData);
    }
  }
}
