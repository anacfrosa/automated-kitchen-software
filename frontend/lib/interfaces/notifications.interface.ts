import { InitMeasureUnit } from "../enums/measure-unit.enum";
import { SupplyNotif } from "../enums/supply-notif.enum";

export interface ReadSupplyNotif {
  id?: string;
  type: SupplyNotif;
  title: string;
  subtitle: string;
  forecastDate: string;
  quantity: number;
  measureUnit: InitMeasureUnit;
  ingredientId: string;
  inventoryId: string | null;
  dispenserId: string | null;
}
