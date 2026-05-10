import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Purchase } from './purchase.entity';
import { InitMeasureUnit } from '@wac/shared/enums/measure-unit.enum';

@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseItems, { onDelete: 'CASCADE' })
  purchase: Purchase;

  @Column({ type: 'uuid' })
  ingredientId: string; // ingredient table fk from products service

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'enum', enum: InitMeasureUnit, default: InitMeasureUnit.Kg })
  measureUnit: InitMeasureUnit;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'boolean', default: true })
  isAccepted: boolean; // false if ingredient is not accepted

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
