import { Ingredient } from "./ingredient.interface";

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
    ingredient: Ingredient;
    quantity: number;
    day: number;
    month: number;
    year: number;
  }