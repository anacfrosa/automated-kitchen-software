import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { ReadIngredient } from 'apps/products/src/ingredients/ingredients.interface';

export interface CreateForecast {
  id?: string;
  shopId?: string;
  ingredientId: string;
  date: string;
  quantity: number;
  measureUnit: InitMeasureUnit;
}

export interface ReadForecast {
  id: string;
  shopId?: string;
  ingredient: ReadIngredient;
  date: Date;
  quantity: number;
  measureUnit: InitMeasureUnit;
}
