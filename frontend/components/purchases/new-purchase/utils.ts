import { IPurchaseFormValues, PurchaseItem } from "@wac/lib/interfaces/purchases.interface";
import { Dayjs } from "dayjs";
import { Control, useWatch } from "react-hook-form";

export const defaultItemValues: PurchaseItem = {
  ingredientId: "",
  quantity: 0,
  measureUnit: "",
  unitPrice: 0,
  cost: 0,
};

/**
 *  (note: for know i'm just considering solid ingredients)
 *  Quantity requested
 *  Unit (kg, g , ml, l)
 *  Price: Kg
 */
export function getCostPerItem(quantity: number, unit: string, price: number) {
  let cost = unit == "kg" ? quantity * price : (quantity / 1000) * price; // return in kg
  cost = Number(cost.toFixed(2));
  return Number.isNaN(cost) ? 0 : cost;
}

export function getTotalCost(payload: IPurchaseFormValues["item"]) {
  let total = 0;
  for (const item of payload) {
    const costPerItem = getCostPerItem(
      item.quantity,
      item.measureUnit,
      item.unitPrice
    );
    total = total + costPerItem;
  }
  return total.toFixed(2);
}

export function TotalCost({
  control,
}: {
  control: Control<IPurchaseFormValues>;
}) {
  const itemValues = useWatch({ control, name: "item" });
  //console.log(itemValues);
  return getTotalCost(itemValues);
}
