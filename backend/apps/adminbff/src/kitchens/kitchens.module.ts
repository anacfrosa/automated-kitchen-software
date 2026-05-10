import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DispensersController } from './dispensers/dispensers.controllers';
import { ShopsController } from './shops/shops.controller';
import { InventoryController } from './inventory/inventory.controller';
import { WastageController } from './wastage/wastage.controller';
import { ForecastsController } from './forecasts/forecasts.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KITCHENS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('KITCHENS_QUEUE'),
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ShopsController, DispensersController, InventoryController, WastageController, ForecastsController],
})
export class KitchensModule {}
