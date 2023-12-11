import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SearchStatus } from '../types/enums/searchStatus';

@Entity()
export class SearchStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @Column({ nullable: true })
  adsCount: number;

  @Column({ nullable: true })
  linksCount: number;

  @Column({ type: 'bigint', nullable: true })
  totalResultsCount: number;

  @Column({ type: 'text', nullable: true })
  cachedResponse: string;

  @Column({ type: 'bool', default: false })
  isProcessed: boolean;

  @Column({
    type: 'enum',
    enum: SearchStatus,
    default: SearchStatus.PENDING,
  })
  status: SearchStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
