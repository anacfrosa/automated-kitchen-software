import { catchError, defaultIfEmpty, Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Param, Inject, Req, Logger } from '@nestjs/common';
import { CreateForecastsDto } from './dto/create-forecasts.dto';

@ApiTags('Forecasts')
@Controller('forecasts')
export class ForecastsController {
  constructor(@Inject('KITCHENS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(
    @Req() { locale }: CustomRequest,
    @Body() data: CreateForecastsDto,
  ): Promise<Observable<CustomResponse>> {
    console.log('\nADMIN BFF - POST');
    const ingredientsForecast = data.ingredientForecasts;
    console.log(ingredientsForecast);
    return this.client.send({ cmd: 'createForecasts' }, { locale, data: ingredientsForecast });
  }

  @Get('shop/:id')
  async findByShop(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findForecastsByShopId' }, { locale, id });
  }

  @Get('dates')
  async findAll(@Req() { locale }: CustomRequest): Promise<Observable<CustomResponse>> {
    console.log('\n ADMIN BFF - Find All Forecast Dates');
    return this.client.send({ cmd: 'findAllForecastDates' }, { locale });
  }
}
