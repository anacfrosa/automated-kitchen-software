import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(@Inject('SUPPLIERS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(@Req() { locale }: CustomRequest, @Body() data: CreateSupplierDto): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createSupplier' }, { locale, data });
  }

  @Get()
  async findAll(@Req() { locale }: CustomRequest): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findAllSuppliers' }, { locale });
  }

  @Get(':id')
  async findOne(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'findOneSupplier' }, { id, locale });
  }

  @Patch(':id')
  async update(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
    @Body() data: UpdateSupplierDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'updateSupplier' }, { id, locale, data });
  }

  @Delete(':id')
  async remove(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'removeSupplier' }, { id, locale });
  }
}
