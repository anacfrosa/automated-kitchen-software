import { ReadDispenser } from "@wac/types/dispenser";
import { Inventory } from "@wac/types/inventory";
import { convertToGrams, getDispenserMaxCapacity } from "../../lib/common";

export interface Notification {
  type: string;
  inventoryId?: string;
  dispenserId?: string;
  required: { quantity: number; measureUnit: string };
}

export function generateNotification(
  ingrsInventory: Inventory[],
  ingrsDispensers: ReadDispenser[],
  requiredQty: { quantity: number; measureUnit: string }
): Notification | null {
  const requiredQtyGrams: number = convertToGrams(
    requiredQty.quantity,
    requiredQty.measureUnit
  );

  // Get the max quantity available in inventory
  const maxQtyInventory = calcMaxQtyAvailable(ingrsInventory);
  // Get the max quantity available in dispensers
  const maxQtyDispensers = calcMaxQtyAvailable(ingrsDispensers);

  console.log(requiredQtyGrams);
  console.log(maxQtyInventory);
  console.log(maxQtyDispensers);

  if (maxQtyDispensers >= requiredQtyGrams) {
    console.log("Dispensers have enough quantity!");
    return null; // No notification needed; dispensers have enough quantity.
  }

  // Find the missing quantity to add to dispensers
  const qtyMissing = requiredQtyGrams - maxQtyDispensers;
  console.log("qtyMissing: ", qtyMissing);

  if (maxQtyInventory === 0) {
    console.log("Quantity not available in any inventory");
    return createPurchaseNotification(requiredQtyGrams);
  }

  const minQtyInventory = Math.min(qtyMissing, maxQtyInventory);
  console.log("minQtyInventory: ", minQtyInventory);
  const availableLots = findAvailableLots(ingrsInventory, minQtyInventory);
  console.log("availableLots: ", availableLots);

  if (
    ingrsDispensers[0]?.ingredientId.shelfLife == 0 &&
    maxQtyDispensers !== 0
  ) {
    // Handle not perishable ingredients
    const refillInfo = findRefillInfo(
      ingrsDispensers,
      availableLots,
      minQtyInventory
    );
    if (refillInfo) {
      console.log("Making a refill ! ");
      return createRefillNotification(refillInfo);
    }
  }

  return createFillNotification(availableLots, minQtyInventory);
}

function calcMaxQtyAvailable(
  items: { quantity: { current: number; measureUnit: string } }[]
): number {
  return items.reduce(
    (total, item) =>
      total + convertToGrams(item.quantity.current, item.quantity.measureUnit),
    0
  );
}

function createPurchaseNotification(quantity: number): Notification {
  return {
    type: "Purchase",
    required: {
      quantity,
      measureUnit: "g",
    },
  };
}

function createFillNotification(
  lots: string[],
  quantity: number
): Notification {
  return {
    type: "Fill",
    ...(lots.length === 1 ? { inventoryId: lots[0] } : {}),
    required: {
      quantity,
      measureUnit: "g",
    },
  };
}

function createRefillNotification(info: {
  inventoryId: string;
  dispenserId: string;
  quantity: number;
}): Notification {
  return {
    type: "Refill",
    inventoryId: info.inventoryId,
    dispenserId: info.dispenserId,
    required: {
      quantity: info.quantity,
      measureUnit: "g",
    },
  };
}

function findAvailableLots(
  ingrsInventory: Inventory[],
  quantity: number
): string[] {
  let accumulatedQty = 0;

  // Use a for-loop instead of reduce for more control
  const lots: string[] = [];

  for (const inv of ingrsInventory) {
    const invQty = convertToGrams(
      inv.quantity.current,
      inv.quantity.measureUnit
    );

    if (invQty > 0) {
      accumulatedQty += invQty;
      lots.push(inv.id);

      if (accumulatedQty >= quantity) {
        break; // Stop processing once the quantity is reached
      }
    }
  }

  return lots;
}

function findRefillInfo(
  ingrsDispensers: ReadDispenser[],
  availableLots: string[],
  quantityToAdd: number
): { inventoryId: string; dispenserId: string; quantity: number } | null {
  const availableLotsSet = new Set(availableLots);

  for (const dispenser of ingrsDispensers) {
    if (dispenser.inventories.length === 1) {
      const inventoryId = dispenser.inventories[0].id;
      if (availableLotsSet.has(inventoryId)) {
        const maxCapacity = getDispenserMaxCapacity(
          dispenser.volume,
          dispenser.ingredientId.density
        );
        const currentQty = convertToGrams(
          dispenser.quantity.current,
          dispenser.quantity.measureUnit
        );
        const possibleToAdd = Math.min(quantityToAdd, maxCapacity - currentQty);

        if (possibleToAdd > 0) {
          return {
            inventoryId,
            dispenserId: dispenser.id,
            quantity: possibleToAdd,
          };
        }
      }
    }
  }

  return null;
}
