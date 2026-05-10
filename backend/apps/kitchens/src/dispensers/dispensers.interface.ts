import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { ReadInventory } from '../inventory/inventory.interface';
import { Inventory } from '../inventory/entities/inventory.entity';

export interface CreateDispenser {
  id?: string;
  number: number;
  fillDate?: Date;
  initQuantity: number;
  initMeasureUnit: InitMeasureUnit;
  quantityIn: number;
  quantityOut: number;
  measureUnit: StandardMeasureUnit;
  expiryDate?: Date;
  volume: number;
  storage: StorageLocation;
  isFree: boolean;
  shopId: string;
  ingredientId?: string;
}

export interface ReadDispenser {
  id: string;
  number: number;
  initQuantity?: {
    quantity: number;
    measureUnit: InitMeasureUnit;
  };
  quantity: {
    in?: number;
    out?: number;
    current: number;
    measureUnit: StandardMeasureUnit;
  };
  fillDate?: Date | null;
  expiryDate?: Date;
  volume?: number;
  storage: StorageLocation;
  isFree?: boolean;
  shopId?: string;
  ingredientId?: string;
  inventories?: Inventory[];
}

export interface UpdateDispenser {
  initQuantity?: number;
  initMeasureUnit?: InitMeasureUnit;
  quantityIn?: number;
  quantityOut?: number;
  measureUnit?: StandardMeasureUnit;
  fillDate?: Date | null;
  expiryDate?: Date | null;
  volume?: number;
  storage?: StorageLocation;
  isFree?: boolean;
  ingredientId?: string | null;
  inventories?: string[];
}
