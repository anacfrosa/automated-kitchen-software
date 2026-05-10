import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from '../../shops/entities/shop.entity';
import { Dispenser } from '../../dispensers/entities/dispenser.entity';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { IsArray, IsUUID } from 'class-validator';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  initQuantity: number;

  @Column({ type: 'enum', enum: InitMeasureUnit })
  initMeasureUnit: InitMeasureUnit;

  @Column({ type: 'decimal', default: 0 })
  quantityIn: number;

  @Column({ type: 'decimal', default: 0 })
  quantityOut: number;

  @Column({ type: 'enum', enum: StandardMeasureUnit, default: StandardMeasureUnit.Kg })
  measureUnit: StandardMeasureUnit;

  @Column({ type: 'bigint' })
  lotNumber: number;

  @Column({ type: 'timestamp' })
  expiryDate: Date;

  @Column({ type: 'enum', enum: StorageLocation, default: StorageLocation.FRIDGE })
  storage: StorageLocation;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Shop, (shop) => shop.inventory)
  @JoinColumn({ name: 'shopId' })
  shop: Shop; // not null

  @ManyToMany(() => Dispenser, (dispenser) => dispenser.inventories)
  @JoinTable()
  dispensers: Dispenser[];

  @Column('simple-array')
  @IsArray()
  @IsUUID('all', { each: true })
  purchaseItemsId: string[];
}
