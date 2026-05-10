interface Ingredient {
  id: string;
  name: string;
  image: string;
  icon: string | null;
  form: string;
  shelfLife: number;
  density: number;
}

export type { Ingredient };
