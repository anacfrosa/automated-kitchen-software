import { createInventory } from "@wac/utils/api/inventory.api";
import { updatePurchase, updatePurchaseItem } from "@wac/lib/api/purchases.api";
import { SHOPID } from "@wac/lib/api/shops.api";
import { convertDayjsToISOString } from "@wac/lib/format-date";
import { Dayjs } from "dayjs";
import { PurchaseStatus } from "@wac/lib/enums/purchase-status.enum";
import { generateNewSupplyNotifs } from "@wac/lib/api/notifications.api";

export interface ingredientDetails {
  ingredient: string;
  lotNumber: number;
  quantity: number;
  measureUnit: string;
  expiryDate: Dayjs | null;
  expiryTime: Dayjs | null;
  isAccepted: boolean;
}

export interface FormValuesType {
  [purchaseItemId: string]: ingredientDetails;
}

export const insertIngredientsToInventory = (
  purchaseId: string,
  receptionList: FormValuesType[]
) => {
  // Update Purchase reception Date and status to DELIVERED
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);
  updatePurchase(purchaseId, {
    receptionDate: currentDate.toISOString(),
    status: PurchaseStatus.DELIVERED,
  });

  //console.log(receptionList);

  for (const obj of receptionList) {
    for (const [key, value] of Object.entries(obj)) {
      const itemId = key;
      const isAccepted = value.isAccepted;

      // Update each Purchase Item based on the isAccepted flag
      if (!isAccepted) {
        updatePurchaseItem(purchaseId, itemId, { isAccepted: false });
      } else {
        // Add ingredients accepted to the inventory table
        createInventory({
          initQuantity: value.quantity,
          initMeasureUnit: value.measureUnit,
          lotNumber: value.lotNumber,
          expiryDate:
            value.expiryDate !== null
              ? convertDayjsToISOString(value.expiryDate, value.expiryTime)
              : "",
          shopId: SHOPID,
          purchaseItemId: itemId,
        });
      }
    }
  }

  // Notice supply notifications service
  generateNewSupplyNotifs(SHOPID);
};
