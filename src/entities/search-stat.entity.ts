import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
