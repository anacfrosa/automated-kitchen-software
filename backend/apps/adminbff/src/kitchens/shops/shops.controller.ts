import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(@Inject('KITCHENS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(@Req() { locale }: CustomRequest, @Body() data: CreateShopDto): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createShop' }, { locale, data });
  }

  @Get()
  async findAll(@Req() { locale }: CustomRequest): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findAllShops' }, { locale });
  }

  @Get(':id')
  async findOne(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findOneShop' }, { id, locale });
  }

  // @Patch(':id')
  // async update(
  //   @Req() { locale }: CustomRequest,
  //   @Param('id') id: string,
  //   @Body() data: UpdateShopDto,
  // ): Promise<Observable<CustomResponse>> {
  //   return this.client.send({ cmd: 'updateShop' }, { id, locale, data });
  // }

  // @Delete(':id')
  // async remove(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
  //   return this.client.send({ cmd: 'removeShop' }, { id, locale });
  // }
}
