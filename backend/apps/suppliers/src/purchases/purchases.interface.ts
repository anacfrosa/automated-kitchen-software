import { PurchaseStatus } from '@wac/shared/enums/purchase-status.enum';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { InitMeasureUnit } from '@wac/shared/enums/measure-unit.enum';

/********* Purchase Item */

export interface CreatePurchaseItem {
  id?: string;
  purchaseId?: string;
  ingredient: string; // id
  quantity: number;
  measureUnit: InitMeasureUnit;
  unitPrice: number;
  cost: number;
  isAccepted?: boolean;
}

export interface ReadPurchaseItem {
  id: string;
  purchaseId?: string;
  ingredient: {
    id: string;
    name: string;
    form: string;
    image: string;
    icon: string;
    shelfLife: number;
    density: number;
  };
  quantity: number;
  measureUnit: InitMeasureUnit;
  unitPrice: number;
  cost: number;
  isAccepted: boolean;
}

export interface UpdatePurchaseItem {
  isAccepted?: boolean;
}

export interface PurchaseItemInfo {
  id: string;
  supplier: string;
  receptionDate: string;
  ingredient: {
    id: string;
    name: string;
    form: string;
    image: string;
    icon: string;
    shelfLife: number;
    density: number;
  };
  quantity?: number;
  measureUnit?: InitMeasureUnit;
  unitPrice?: number;
  cost?: number;
  isAccepted?: boolean;
}

/********* Purchase  */

export interface CreatePurchase {
  id?: string;
  number?: number;
  shopId: string;
  supplierId: string;
  purchaseDate?: Date;
  deliveryDate?: Date;
  receptionDate?: Date;
  status: PurchaseStatus;
  totalCost: number;
  purchaseItems: CreatePurchaseItem[];
}

export interface ReadPurchase {
  id: string;
  number: number;
  shopId: string;
  supplier: Supplier;
  purchaseDate: Date | null;
  deliveryDate: Date | null;
  receptionDate: Date | null;
  status: PurchaseStatus;
  totalCost: number;
  purchaseItems: ReadPurchaseItem[];
}

export interface UpdatePurchase {
  receptionDate?: Date;
  status?: PurchaseStatus;
}
