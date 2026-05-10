import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Dispenser } from '../../dispensers/entities/dispenser.entity';
import { Wastage } from '../../wastage/entities/wastage.entity';
import { Forecast } from '../../forecasts/entities/forecasts.entity';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Wastage, (wastage) => wastage.shop)
  wastage: Wastage[];

  @OneToMany(() => Inventory, (inventory) => inventory.shop)
  inventory: Inventory[];

  @OneToMany(() => Dispenser, (dispenser) => dispenser.shop)
  dispenser: Dispenser[];

  @OneToMany(() => Forecast, (forecast) => forecast.shop)
  forecast: Forecast[];
}
