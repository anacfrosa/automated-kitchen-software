import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';

@Entity()
export class Dispenser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'timestamp', nullable: true })
  fillDate: Date;

  @Column({ type: 'decimal', default: 0 })
  initQuantity: number;

  @Column({ type: 'enum', enum: InitMeasureUnit, default: InitMeasureUnit.Kg })
  initMeasureUnit: InitMeasureUnit;

  @Column({ type: 'decimal', default: 0 })
  quantityIn: number;

  @Column({ type: 'decimal', default: 0 })
  quantityOut: number;

  @Column({ type: 'enum', enum: StandardMeasureUnit, default: StandardMeasureUnit.Kg })
  measureUnit: StandardMeasureUnit;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @Column({ type: 'int', default: 6750 }) // 6750 cm3 = 30cm * 15cm * 15cm
  volume: number;

  @Column({ type: 'enum', enum: StorageLocation })
  storage: StorageLocation;

  @Column({ default: true })
  isFree: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Shop, (shop) => shop.dispenser)
  @JoinColumn({ name: 'shopId' })
  shop: Shop; // not null

  @Column({ type: 'uuid', nullable: true })
  ingredientId: string; // GET from Products Service if not null

  @ManyToMany(() => Inventory, (inventory) => inventory.dispensers)
  inventories: Inventory[];
}
