import { StandardMeasureUnit } from "../enums/measure-unit.enum";
import { Ingredient } from "./ingredient.interface";

export interface ReadForecast {
  id: string;
  shopId?: string;
  ingredient: Ingredient;
  date: string;
  quantity: number;
  measureUnit: StandardMeasureUnit;
}
