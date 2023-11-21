export interface FileParser {
  parseData<T>(file: Express.Multer.File): Promise<T[]>;
}

export const IFileParser = Symbol('FileParser');
