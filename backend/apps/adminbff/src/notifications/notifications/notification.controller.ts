import { catchError, defaultIfEmpty, Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Inject, Param, Post, Req } from '@nestjs/common';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(@Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy) {}

  @Post('shop/:id')
  async create(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    console.log(' \n ADMIN BFF - SEND NOTICE !!! ');
    return this.client.send({ cmd: 'generateNotifByShop' }, { locale, id });
  }

  @Get('shop/:id')
  async findByShop(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findSupplyNotifByShop' }, { locale, id });
  }
}
