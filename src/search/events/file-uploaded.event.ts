import { CsvField } from '../../types/csvField';

export class FileUploadedEvent {
  constructor(public readonly rowObject: CsvField[]) {}
}
