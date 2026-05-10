import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { PurchaseStatus } from '@wac/shared/enums/purchase-status.enum';
import { PurchaseItem } from './purchase-item.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  @Generated('increment')
  number: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date; // expected reception date

  @Column({ type: 'timestamp', nullable: true })
  receptionDate: Date;

  @Column({ type: 'enum', enum: PurchaseStatus, default: PurchaseStatus.PENDING })
  status: PurchaseStatus;

  @Column({ type: 'float' })
  totalCost: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'uuid' })
  shopId: string; // FK Shop from Kitchen Service

  @ManyToOne(() => Supplier, (supplier) => supplier.purchase)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase)
  @JoinColumn({ name: 'purchaseItems' })
  purchaseItems: PurchaseItem[];
}
