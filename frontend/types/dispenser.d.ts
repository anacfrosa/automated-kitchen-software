interface ReadDispenser {
  id: string;
  number: number;
  initQuantity: {
    quantity: number;
    measureUnit: string;
  };
  quantity: {
    in?: number;
    out?: number;
    current: number;
    measureUnit: string;
  };
  fillDate: string;
  expiryDate: string;
  volume: number;
  storage?: string;
  isFree?: boolean;
  shopId?: string;
  ingredientId?: Ingredient | null;
  inventories: Inventory[];
}

interface UpdateDispenser {
  initQuantity?: number;
  initMeasureUnit?: string;
  quantityIn?: number;
  quantityOut?: number;
  measureUnit?: string;
  expiryDate?: string | null;
  volume?: number;
  storage?: string;
  isFree?: boolean;
  ingredientId?: string | null;
  inventories?: string[];
}

interface FillDetails {
  inventoryId: string;
  lotNumber: number;
  ingredient: {
    id: string;
    name: string;
    density: number;
  };

  quantityAvailable: {
    quantity: number;
    unit: string;
  };
  quantity: number;
  measureUnit: string;
  confirmQuantity: number;
  confirmUnit: string;
}

interface FillStatus {
  lotNumber: number;
  valid: boolean;
  error: string;
}

export { ReadDispenser, UpdateDispenser, FillDetails, FillStatus };
