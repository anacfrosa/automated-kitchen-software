import { Observable } from 'rxjs';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req, Query } from '@nestjs/common';
import { CreateDispenserDto } from './dto/create-dispenser.dto';
import { UpdateDispenserDto } from './dto/update-dispenser.dto';
import { StorageLocation } from '@wac/shared/enums/storage-location';

@ApiTags('Dispensers')
@Controller('dispensers')
export class DispensersController {
  constructor(@Inject('KITCHENS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(
    @Req() { locale }: CustomRequest,
    @Body() data: CreateDispenserDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createDispenser' }, { locale, data });
  }

  @Get('shop/:id')
  @ApiQuery({ name: 'ingredientId', required: false })
  @ApiQuery({
    name: 'storage',
    enum: StorageLocation,
    required: false,
    description: 'Specify the storage location (Dry or Fridge)',
  })
  async findByShopId(
    @Req() { locale }: CustomRequest,
    @Param('id') shopId: string,
    @Query('ingredientId') ingredientId?: string,
    @Query('storage') storage?: StorageLocation,
  ): Promise<Observable<CustomResponse>> {
    if (ingredientId) {
      // If ingredientId is provided, send request to find dispensers by both shopId and ingredientId
      return this.client.send({ cmd: 'findDispensersByShopAndIngredient' }, { locale, shopId, ingredientId });
    } else if (storage) {
      return this.client.send({ cmd: 'findDispensersByShopAndStorage' }, { locale, shopId, storage });
    } else {
      // If ingredientId is not provided, send request to find dispensers by shopId only
      return this.client.send({ cmd: 'findDispensersByShop' }, { locale, shopId });
    }
  }

  @Get(':id')
  async findOne(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    console.log('AdminBFF - Dispensers: findOneDispenser');
    return this.client.send({ cmd: 'findOneDispenser' }, { id, locale });
  }

  @Get(':id/lots')
  async findLotsByDispenser(
    @Req() { locale }: CustomRequest,
    @Param('id') dispenserId: string,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findLotsByDispenser' }, { locale, dispenserId });
  }

  @Patch(':id')
  async update(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
    @Body() data: UpdateDispenserDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'updateDispenser' }, { id, locale, data });
  }

  @Delete(':id')
  async remove(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'removeDispenser' }, { id, locale });
  }
}
