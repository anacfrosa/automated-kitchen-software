import { Controller, Logger } from '@nestjs/common';
import { ForecastsService } from './forecasts.service';
import { CreateForecast } from './forecasts.interface';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ForecastsController {
  constructor(private readonly forecastsService: ForecastsService) {}

  @MessagePattern({ cmd: 'createForecasts' })
  create({ locale, data }: { locale: string; data: CreateForecast[] }) {
    console.log('\n Forecasts Controller');
    console.log('\n Received Data: ', data);
    return this.forecastsService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findForecastsByShopId' })
  async findByShop({ locale, id }: { locale: string; id: string }) {
    return await this.forecastsService.findByShop(locale, id);
  }

  @MessagePattern({ cmd: 'findAllForecastDates' })
  async findAll({ locale }: { locale: string }) {
    return await this.forecastsService.findAllDates(locale);
  }
}
