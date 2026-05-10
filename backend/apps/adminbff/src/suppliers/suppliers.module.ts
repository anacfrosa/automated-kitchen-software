import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SuppliersController } from './suppliers/suppliers.controller';
import { PurchasesController } from './purchases/purchases.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUPPLIERS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('SUPPLIERS_QUEUE'),
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SuppliersController, PurchasesController],
})
export class SuppliersModule {}
