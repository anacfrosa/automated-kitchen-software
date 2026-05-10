import { Observable } from 'rxjs';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req, Query } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(@Inject('KITCHENS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(
    @Req() { locale }: CustomRequest,
    @Body() data: CreateInventoryDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createInventory' }, { locale, data });
  }

  @ApiQuery({ name: 'ingredientId', required: false })
  @Get('shop/:shopId')
  async findByShop(
    @Req() { locale }: CustomRequest,
    @Param('shopId') shopId: string,
    @Query('ingredientId') ingredientId?: string,
  ): Promise<Observable<CustomResponse>> {
    if (ingredientId) {
      // If ingredientId is provided, send request to find inventory by both shopId and ingredientId
      return this.client.send({ cmd: 'findInventoryByShopIdAndIngredientId' }, { locale, shopId, ingredientId });
    } else {
      // If dispenserId is not provided, send request to find inventory by shopId only
      return this.client.send({ cmd: 'findInventoryByShopId' }, { locale, shopId });
    }
  }

  @Get(':id')
  async findOne(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findOneInventory' }, { id, locale });
  }

  @Get('purchaseItem/:id')
  async findByPurchaseItem(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findByPurchaseItem' }, { id, locale });
  }

  @Patch(':id')
  async update(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
    @Body() data: UpdateInventoryDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'updateInventory' }, { id, locale, data });
  }

  @Delete(':id')
  async remove(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'removeInventory' }, { id, locale });
  }
}
