import { Language } from '@wac/shared/enums/language.enum';

export interface CreateIngredient {
  id?: string;
  language: Language;
  name: string;
  form: string;
  image?: string;
  icon?: string;
  shelfLife?: number;
  density?: number;
}

export interface ReadIngredient {
  id: string;
  name: string;
  form: string;
  image: string;
  icon: string;
  shelfLife: number;
  density: number;
}

export interface UpdateIngredient {
  language: Language;
  name?: string;
  form?: string;
  image?: string;
  icon?: string;
  shelfLife?: number;
  density?: number;
}
