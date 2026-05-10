import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { CustomRequest, CustomResponse } from '@wac/shared';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(@Inject('PRODUCTS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  async create(
    @Req() { locale }: CustomRequest,
    @Body() data: CreateIngredientDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'createIngredient' }, { locale, data });
  }

  @Get()
  async findAll(@Req() { locale }: CustomRequest): Promise<Observable<CustomResponse>> {
    console.log('AdminBFF - Ingredient: findAll');
    console.log(this.client.send({ cmd: 'findAllIngredients' }, { locale }));

    return this.client.send({ cmd: 'findAllIngredients' }, { locale });
  }

  @Get(':id')
  async findOne(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    console.log('AdminBFF - Ingredient: findOneIngredient');
    return this.client.send({ cmd: 'findOneIngredient' }, { id, locale });
  }

  @Patch(':id')
  async update(
    @Req() { locale }: CustomRequest,
    @Param('id') id: string,
    @Body() data: UpdateIngredientDto,
  ): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'updateIngredient' }, { id, locale, data });
  }

  @Delete(':id')
  async remove(@Req() { locale }: CustomRequest, @Param('id') id: string): Promise<Observable<CustomResponse>> {
    return this.client.send({ cmd: 'removeIngredient' }, { id, locale });
  }
}
