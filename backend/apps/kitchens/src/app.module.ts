import * as Joi from 'joi';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fallbackLanguage, languageI18nKey } from '@wac/shared';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

import { ShopsModule } from './shops/shops.module';
import { DispensersModule } from './dispensers/dispensers.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryModule } from './inventory/inventory.module';
import { WastageModule } from './wastage/wastage.module';
import { ForecastsModule } from './forecasts/forecasts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.local',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: fallbackLanguage,
      loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      resolvers: [{ use: QueryResolver, options: [`${languageI18nKey}`] }, AcceptLanguageResolver],
    }),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCTS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('PRODUCTS_QUEUE'),
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
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
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('NOTIFICATIONS_QUEUE'),
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ShopsModule,
    DispensersModule,
    InventoryModule,
    WastageModule,
    ForecastsModule,
  ],
})
export class AppModule {}
