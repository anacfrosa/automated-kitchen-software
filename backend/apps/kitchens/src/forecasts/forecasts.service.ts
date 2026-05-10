import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Forecast } from './entities/forecasts.entity';
import { Repository } from 'typeorm';
//import { ClientProxy } from '@nestjs/microservices';
import { CreateForecast, ReadForecast } from './forecasts.interface';
import { ClientProxy } from '@nestjs/microservices';
import { ShopsService } from '../shops/shops.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ForecastsService {
  constructor(
    private readonly i18n: I18nService,
    private readonly shopsService: ShopsService,
    @InjectRepository(Forecast)
    private readonly forecastRepository: Repository<Forecast>,
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private readonly notifClient: ClientProxy,
  ) {}

  async create(locale: string, data: CreateForecast[]): Promise<any> {
    const language = { lang: locale };
    const ingredientsForecasts: CreateForecast[] = data;

    // console.log('\nCreating forecasts...');
    // console.log('\nData: ', ingredientsForecasts);

    try {
      // Clear ingredient forecasts if necessary
      await this.clearIngredientForecasts();

      for (const forecast of ingredientsForecasts) {
        console.log(forecast);
        let shopId = forecast.shopId;
        shopId = shopId ? shopId : '26977ff5-9bf4-4680-8e78-8c07e20ef79e';
        const shop = await this.shopsService.findOne(locale, shopId);

        const ingredientForecast = this.forecastRepository.create({
          shop: shop,
          ...forecast,
        });
        await this.forecastRepository.save(ingredientForecast);
      }

      // Notice supply notifications to generate new ones
      await this.sendNoticeToSupplyNotf(locale, '26977ff5-9bf4-4680-8e78-8c07e20ef79e');

      return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.forecasts.itemCreate', language) };
    } catch (error) {
      console.error('Error adding list of forecasts:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findAllDates(locale: string): Promise<any> {
    const language = { lang: locale };

    try {
      const forecasts = await this.forecastRepository.find();
      // Get the list of unique forecast days
      const forecastDaysList = [...new Set(forecasts.map((forecast: Forecast) => forecast.date))];
      return forecastDaysList;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShop(locale: string, id: string): Promise<any> {
    const language = { lang: locale };
    const forecastsList: ReadForecast[] = [];

    try {
      const forecasts = await this.forecastRepository.find({
        where: { shop: { id: id } },
        relations: ['shop'],
      });

      await Promise.all(
        forecasts.map(async (forecast) => {
          const forecastIngredientId: string = forecast.ingredientId;
          const ingredientInfo = await this.getIngredientInfo(locale, forecastIngredientId);

          forecastsList.push({
            id: forecast.id,
            shopId: forecast.shop.id,
            ingredient: ingredientInfo,
            date: forecast.date,
            quantity: forecast.quantity,
            measureUnit: forecast.measureUnit,
          });
        }),
      );

      forecastsList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      return forecastsList;
    } catch (error) {
      console.error('Error find all forecasts by shop id:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  /** Get ingredient information from PRODUCTS service */
  async getIngredientInfo(locale: string, ingredientId: string): Promise<any> {
    try {
      const ingredientInfo = await new Promise<any>((resolve, reject) => {
        this.productClient.send({ cmd: 'findOneIngredient' }, { id: ingredientId, locale: locale }).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          },
        });
      });
      return ingredientInfo;
    } catch (error) {
      console.error('Error getting ingredient information:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  private async clearIngredientForecasts() {
    const ingredientForecasts = await this.forecastRepository.find();
    if (ingredientForecasts.length > 0) {
      console.log('Clearing ingredient forecasts...');
      await this.forecastRepository.clear();
    }
  }

  /** Send notice to supply notifications to update */
  async sendNoticeToSupplyNotf(locale: string, id: string): Promise<any> {
    console.log('\n sendNoticeToSupplyNotf - shopId: ', id, '\n');
    try {
      // convert the Observable to a Promise with lastValueFrom
      const res = await lastValueFrom(this.notifClient.send({ cmd: 'generateNotifByShop' }, { locale, id }));
      return res;
    } catch (error) {
      console.error('Error sending notice to notifications:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }
}
