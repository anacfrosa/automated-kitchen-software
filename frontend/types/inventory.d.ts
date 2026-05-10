import { ReadDispenser } from "./dispenser";

interface CreateInventory {
  id?: string;
  initQuantity: number;
  initMeasureUnit: InitMeasureUnit;
  lotNumber: number;
  expiryDate: string;
  shopId: string;
  purchaseItemId: string;
}

interface Inventory {
  id: string;
  initQuantity: {
    quantity: number;
    measureUnit: string;
  };
  quantity: {
    in: number;
    out: number;
    current: number;
    measureUnit: string;
  };
  lotNumber: number;
  expiryDate: string;
  storage: StorageLocation;
  shopId: string;
  dispensers: ReadDispenser[];
  purchaseInfo: PurchaseInfo;
}

interface UpdateInventory {
  quantityIn?: number;
  quantityOut?: number;
  measureUnit?: string;
  storage?: string;
}

export interface PurchaseInfo {
  ids: string[];
  supplier: string;
  receptionDate: string;
  ingredient: Ingredient;
}

interface ExportInventory {
  Ingredient: string;
  "Lot Number": number;
  Quantity: string;
  "Reception Date": string;
  "Expiry Date": string;
}

const defaultInventory: Inventory = {
  id: "",
  initQuantity: {
    quantity: 0,
    measureUnit: "kg",
  },
  quantity: {
    in: 0,
    out: 0,
    current: 0,
    measureUnit: "kg",
  },
  lotNumber: 0,
  expiryDate: "",
  storage: "Fridge",
  shopId: "",
  purchaseItem: "",
};

export {
  CreateInventory,
  Inventory,
  UpdateInventory,
  ExportInventory,
  defaultInventory,
};
