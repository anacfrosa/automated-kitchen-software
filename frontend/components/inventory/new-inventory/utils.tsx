import { CreateInventory } from "@wac/types/inventory";
import { createInventory } from "@wac/utils/api/inventory.api";
import { uuidv4 } from "@wac/lib/constants";
import { convertDayjsToISOString } from "@wac/lib/format-date";
import { Dayjs } from "dayjs";
import {
  CreatePurchase,
  PurchaseItem,
} from "@wac/lib/interfaces/purchases.interface";
import { SHOPID } from "@wac/lib/api/shops.api";
import { createPurchase } from "@wac/lib/api/purchases.api";
import { generateNewSupplyNotifs } from "@wac/lib/api/notifications.api";

export interface InventoryList {
  supplierId: string;
  list: NewInventory[];
}

export interface NewInventory {
  ingredientId: string;
  ingredientName: string;
  lotNumber: number;
  quantity: number;
  measureUnit: string;
  expiryDate: Dayjs | null;
  expiryTime: Dayjs | null;
}

export const submitNewInventory = async (inventoryList: InventoryList) => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);
  const supplierId = inventoryList?.supplierId;
  let purchaseItemsList: PurchaseItem[] = [];
  let inventoryItemsList: CreateInventory[] = [];

  if (inventoryList) {
    for (const item of inventoryList.list) {
      const newPurchaseItemId = uuidv4();
      purchaseItemsList.push({
        id: newPurchaseItemId,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        measureUnit: item.measureUnit,
        unitPrice: 0,
        cost: 0,
      });

      inventoryItemsList.push({
        initQuantity: item.quantity,
        initMeasureUnit: item.measureUnit,
        lotNumber: item.lotNumber,
        expiryDate:
          item.expiryDate != null
            ? convertDayjsToISOString(item.expiryDate, item.expiryTime)
            : "",
        shopId: SHOPID,
        purchaseItemId: newPurchaseItemId,
      });
    }

    // Create Purchase not expected
    const purchase: CreatePurchase = {
      shopId: SHOPID,
      supplierId: supplierId ? supplierId : "",
      purchaseDate: currentDate.toISOString(),
      deliveryDate: null,
      receptionDate: currentDate.toISOString(),
      status: "Delivered",
      totalCost: 0,
      purchaseItems: purchaseItemsList,
    };

    console.log("New Inventory List: ", inventoryItemsList);

    const statusCode: number = await createPurchase(purchase);

    if (statusCode === 201) {
      for (const inventoryItem of inventoryItemsList) {
        createInventory(inventoryItem);
      }
    }

    // Notice supply notifications service
    generateNewSupplyNotifs(SHOPID);
  }
};
