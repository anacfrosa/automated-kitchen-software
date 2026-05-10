import * as Joi from 'joi';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { LanguageMiddleware, fallbackLanguage, languageI18nKey } from '@wac/shared';

import { ProductsModule } from './products/products.module';
import { KitchensModule } from './kitchens/kitchens.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.local',
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().required(),
        PRODUCTS_QUEUE: Joi.string().required(),
        KITCHENS_QUEUE: Joi.string().required(),
        SUPPLIERS_QUEUE: Joi.string().required(),
        NOTIFICATIONS_QUEUE: Joi.string().required(),
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: fallbackLanguage,
      loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      resolvers: [{ use: QueryResolver, options: [`${languageI18nKey}`] }, AcceptLanguageResolver],
    }),
    ProductsModule,
    KitchensModule,
    SuppliersModule,
    NotificationsModule,
  ],
})
export class AdminbffModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
