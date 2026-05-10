import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { UpdateWastageDto } from './dto/update-wastage.dto';
import { CreateWastageDto } from './dto/create-wastage.dto';

@ApiTags('Wastage')
@Controller('wastage')
export class WastageController {
  constructor(@Inject('KITCHENS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(@Req() { locale }: CustomRequest, @Body() data: CreateWastageDto): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createWastage' }, { locale, data });
  }

  @Get('shop/:shopId')
  async findByShop(
    @Req() { locale }: CustomRequest,
    @Param('shopId') shopId: string,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findWastageByShop' }, { locale, shopId });
  }
}
