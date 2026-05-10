import { Observable } from 'rxjs';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req, Query } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(@Inject('SUPPLIERS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(@Req() { locale }: CustomRequest, @Body() data: CreatePurchaseDto): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createPurchase' }, { locale, data });
  }

  @Get('shop/:shopId')
  async findAllByShop(
    @Req() { locale }: CustomRequest,
    @Param('shopId') shopId: string,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findPurchasesByShopId' }, { locale, shopId });
  }

  @Get(':id')
  async findOne(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findOnePurchase' }, { id, locale });
  }

  @Get('purchaseItem/:itemId')
  async findPurchaseItem(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findPurchaseItem' }, { id, locale });
  }

  @ApiQuery({ name: 'itemId', required: false })
  @Patch(':id')
  async updatePurchase(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
    @Body() data: UpdatePurchaseDto,
    @Query('itemId') itemId?: string,
  ): Promise<Observable<CustomResponse>> {
    if (itemId) {
      return this.client.send({ cmd: 'updatePurchaseItem' }, { id, itemId, locale, data });
    } else {
      return this.client.send({ cmd: 'updatePurchase' }, { id, locale, data });
    }
  }

  // @Patch(':purchaseId/:itemId')
  // async updatePurchaseItem(
  //   @Req() { locale }: CustomRequest,
  //   @Param('purchaseId') purchaseId: string,
  //   @Param('itemId') itemId: string,
  //   @Body() data: UpdatePurchaseItemDto,
  // ): Promise<Observable<CustomResponse>> {
  //   return this.client.send({ cmd: 'updatePurchaseItem' }, { purchaseId, itemId, locale, data });
  // }

  //   @Delete(':id')
  //   async remove(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
  //     return this.client.send({ cmd: 'removeSupplier' }, { id, locale });
  //   }
}
