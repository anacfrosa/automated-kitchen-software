import { InitMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { SupplyNotif } from '@wac/shared/enums/supply-notification.enum';

export interface CreateSupplyNotif {
  id?: string;
  type: SupplyNotif;
  shopId: string;
  ingredientId: string;
  inventoryId: string | null;
  dispenserId: string | null;
  forecastDate: string;
  quantity: number;
  measureUnit: InitMeasureUnit;
}

export interface ReadSupplyNotif {
  id?: string;
  type: SupplyNotif;
  title: string;
  subtitle: string;
  forecastDate: Date;
  quantity: number;
  measureUnit: InitMeasureUnit;
  ingredientId: string;
  inventoryId: string | null;
  dispenserId: string | null;
}

export interface PurchaseNotification {
  type: SupplyNotif;
  forecastDate: string;
  ingredientName: string;
  quantity: number;
  measureUnit: InitMeasureUnit;
  //shopId: string;
  //inventoryId: string | null;
  //dispenserId: string | null;
}
