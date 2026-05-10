import * as Joi from 'joi';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fallbackLanguage, languageI18nKey } from '@wac/shared';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { SupplyModule } from './supplies/supply.module';

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
    SupplyModule,
  ],
})
export class AppModule {}
