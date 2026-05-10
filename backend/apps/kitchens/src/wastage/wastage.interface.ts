import { StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { WastageLocation } from '@wac/shared/enums/wastage-location.enum';
import { ReadIngredient } from 'apps/products/src/ingredients/ingredients.interface';

export interface CreateWastage {
  id?: string;
  shopId: string;
  ingredientId: string;
  quantity: number;
  day: number;
  month: number;
  year: number;
}

export interface ReadWastage {
  id?: string;
  shopId?: string;
  ingredient: ReadIngredient;
  quantity: number;
  day: number;
  month: number;
  year: number;
}
