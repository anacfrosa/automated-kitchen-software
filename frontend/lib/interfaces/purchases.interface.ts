/******** Purchase Item */

import { Dayjs } from "dayjs";
import { PurchaseStatus } from "../enums/purchase-status.enum";
import { Supplier } from "./supplier.interface";
import { InitMeasureUnit } from "../enums/measure-unit.enum";

/******** Purchase  */

export interface CreatePurchase {
  id?: string;
  number?: number;
  shopId: string;
  supplierId: string;
  purchaseDate: string;
  deliveryDate: string | null;
  receptionDate?: string | null;
  status: string;
  totalCost: number;
  isAccepted?: boolean;
  purchaseItems: PurchaseItem[];
}

// Read values
export interface ReadPurchase {
  id: string;
  number: number;
  shopId: string;
  supplier: Supplier;
  purchaseDate: string;
  deliveryDate: string | null;
  receptionDate: string | null;
  status: PurchaseStatus;
  totalCost: number;
  isAccepted: boolean;
  purchaseItems: ReadPurchaseItem[];
}

// New Purchase Form Values
export interface IPurchaseFormValues {
  supplierId: string;
  purchaseDate: string;
  deliveryDate: Dayjs | null;
  deliveryTime: Dayjs | null;
  status: string;
  item: PurchaseItem[];
}

export interface UpdatePurchase {
  receptionDate?: string;
  status?: PurchaseStatus;
}

/****** Putchase Item */

export interface PurchaseItemInfo {
  id: string;
  supplier: string;
  receptionDate: string;
  ingredient: {
    id: string;
    image: string;
    name: string;
    type: string;
  };
  quantity: number;
  measureUnit: InitMeasureUnit;
  unitPrice: number;
  cost: number;
  isAccepted: boolean;
}

export interface PurchaseItem {
  id?: string;
  ingredientId: string;
  quantity: number;
  measureUnit: string;
  unitPrice: number;
  cost: number;
  isAccepted?: boolean;
}

// Read values
export interface ReadPurchaseItem {
  id: string;
  purchaseId?: string;
  ingredient: {
    id: string;
    image: string;
    name: string;
    type: string;
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

export interface ExportPurchases {
  Number: number;
  Supplier: string;
  "Purchase Date": string;
  "Delivery Date": string | null;
  "Reception Date": string | null;
  Status: PurchaseStatus;
  "Total Cost": number;
}
