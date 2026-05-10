import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { IngredientTranslation } from './entities/translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, IngredientTranslation])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
