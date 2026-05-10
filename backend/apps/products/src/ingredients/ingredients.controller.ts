import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { IngredientsService } from './ingredients.service';
import { CreateIngredient, UpdateIngredient } from './ingredients.interface';

@Controller()
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @MessagePattern({ cmd: 'createIngredient' })
  create({ locale, data }: { locale: string; data: CreateIngredient }) {
    return this.ingredientsService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findAllIngredients' })
  async findAll({ locale }: { locale: string }) {
    return this.ingredientsService.findAll(locale);
  }

  @MessagePattern({ cmd: 'findOneIngredient' })
  async findOne({ locale, id }: { locale: string; id: string }) {
    return this.ingredientsService.findOne(locale, id);
  }

  @MessagePattern({ cmd: 'updateIngredient' })
  update({ locale, id, data }: { locale: string; id: string; data: UpdateIngredient }) {
    return this.ingredientsService.update(locale, id, data);
  }

  @MessagePattern({ cmd: 'removeIngredient' })
  remove({ locale, id }: { locale: string; id: string }) {
    return this.ingredientsService.remove(locale, id);
  }
}
