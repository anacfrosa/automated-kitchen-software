import { PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InitMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { SupplyNotif } from '@wac/shared/enums/supply-notification.enum';

@Entity()
export class SupplyNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SupplyNotif, default: SupplyNotif.PURCHASE })
  type: SupplyNotif;

  @Column({ type: 'uuid' })
  shopId: string;

  @Column({ type: 'uuid' })
  ingredientId: string;

  @Column({ type: 'uuid', nullable: true })
  inventoryId: string;

  @Column({ type: 'uuid', nullable: true })
  dispenserId: string;

  @Column({ type: 'date' }) // Use 'date' type for YYYY-MM-DD format
  forecastDate: Date;

  @Column({ type: 'decimal', default: 0 })
  quantity: number;

  @Column({ type: 'enum', enum: InitMeasureUnit, default: InitMeasureUnit.Kg })
  measureUnit: InitMeasureUnit;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
