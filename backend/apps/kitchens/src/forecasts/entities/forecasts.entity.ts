import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from '../../shops/entities/shop.entity';

@Entity()
export class Forecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shop, (shop) => shop.forecast)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column({ type: 'uuid' })
  ingredientId: string;

  @Column({ type: 'date' }) // Use 'date' type for YYYY-MM-DD format
  date: Date;

  @Column({ type: 'decimal', nullable: false })
  quantity: number;

  @Column({ type: 'enum', enum: InitMeasureUnit, default: InitMeasureUnit.Kg })
  measureUnit: InitMeasureUnit;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
