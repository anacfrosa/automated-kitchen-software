import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { PurchaseItemInfo } from 'apps/suppliers/src/purchases/purchases.interface';
import { ReadDispenser } from '../dispensers/dispensers.interface';
import { Dispenser } from '../dispensers/entities/dispenser.entity';
import { ReadIngredient } from 'apps/products/src/ingredients/ingredients.interface';

export interface CreateInventory {
  id?: string;
  initQuantity: number;
  initMeasureUnit: InitMeasureUnit;
  quantityIn?: number;
  quantityOut?: number;
  measureUnit?: StandardMeasureUnit;
  lotNumber: number;
  expiryDate: Date;
  storage?: StorageLocation;
  shopId: string;
  purchaseItemId: string;
}

export interface ReadInventory {
  id: string;
  initQuantity: {
    quantity: number;
    measureUnit: InitMeasureUnit;
  };
  quantity: {
    in: number;
    out: number;
    current: number;
    measureUnit: StandardMeasureUnit;
  };
  lotNumber: number;
  expiryDate: Date;
  storage: StorageLocation;
  shopId?: string;
  dispensers?: Dispenser[];
  purchaseInfo: PurchaseInfo;
}

export interface ReadInventoryByShop {
  id: string;
  initQuantity: {
    quantity: number;
    measureUnit: InitMeasureUnit;
  };
  quantity: {
    in: number;
    out: number;
    current: number;
    measureUnit: StandardMeasureUnit;
  };
  lotNumber: number;
  expiryDate: Date;
  storage: StorageLocation;
  shopId?: string;
  dispensers?: Dispenser[];
  purchaseInfo: PurchaseInfo;
}

export interface UpdateInventory {
  quantityIn?: number;
  quantityOut?: number;
  measureUnit?: StandardMeasureUnit;
  storage?: StorageLocation;
}

export interface PurchaseInfo {
  ids: string[];
  supplier: string;
  receptionDate: string;
  ingredient: ReadIngredient;
}
