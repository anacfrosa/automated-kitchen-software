import { InitMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { convertToGrams } from 'apps/kitchens/src/utils/common';
import { PurchaseNotification } from '../supplies/supply.interface';
import { SupplyNotif } from '@wac/shared/enums/supply-notification.enum';
import { ReadInventory } from 'apps/kitchens/src/inventory/inventory.interface';
import { ReadDispenser } from 'apps/kitchens/src/dispensers/dispensers.interface';
import { ReadIngredient } from 'apps/products/src/ingredients/ingredients.interface';

export function calcMaxQtyAvailable(items: { quantity: { current: number; measureUnit: string } }[]): number {
  return items.reduce((total, item) => total + convertToGrams(item.quantity.current, item.quantity.measureUnit), 0);
}

export function getLotNumbersForDispenser(ingrsInventory: ReadInventory[], quantity: number): string[] {
  let accumulatedQty = 0;

  // Use a for-loop instead of reduce for more control
  const lots: string[] = [];

  for (const inv of ingrsInventory) {
    const invQty = convertToGrams(inv.quantity.current, inv.quantity.measureUnit);

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

export function findRefillInfo(
  ingrsDispensers: ReadDispenser[],
  availableLots: string[],
  quantityToAdd: number,
  ingredient: ReadIngredient,
): { inventoryId: string; dispenserId: string; quantity: number } | null {
  const availableLotsSet = new Set(availableLots);

  for (const dispenser of ingrsDispensers) {
    const [inventory] = dispenser.inventories;
    if (dispenser.inventories.length === 1 && availableLotsSet.has(inventory.id)) {
      const maxCapacity = getDispenserMaxCapacity(dispenser.volume, ingredient.density);
      const currentQty = convertToGrams(dispenser.quantity.current, dispenser.quantity.measureUnit);
      const possibleToAdd = Math.min(quantityToAdd, maxCapacity - currentQty);

      if (possibleToAdd > 0) {
        return {
          inventoryId: inventory.id,
          dispenserId: dispenser.id,
          quantity: possibleToAdd,
        };
      }
    }
  }

  return null;
}

// export function findRefillInfo(
//   ingrsDispensers: ReadDispenser[],
//   availableLots: string[],
//   quantityToAdd: number,
//   ingredient: ReadIngredient,
// ): { inventoryId: string; dispenserId: string; quantity: number } | null {
//   const availableLotsSet = new Set(availableLots);

//   for (const dispenser of ingrsDispensers) {
//     if (dispenser.inventories.length === 1) {
//       const inventoryId = dispenser.inventories[0].id;
//       if (availableLotsSet.has(inventoryId)) {
//         const maxCapacity = getDispenserMaxCapacity(dispenser.volume, ingredient.density);
//         const currentQty = convertToGrams(dispenser.quantity.current, dispenser.quantity.measureUnit);
//         const possibleToAdd = Math.min(quantityToAdd, maxCapacity - currentQty);

//         if (possibleToAdd > 0) {
//           return {
//             inventoryId,
//             dispenserId: dispenser.id,
//             quantity: possibleToAdd,
//           };
//         }
//       }
//     }
//   }

//   return null;
// }

export function getDispenserMaxCapacity(dispVolume: number, ingrDensity: number): number {
  // volume - cm3
  // density - g/cm3
  // This will return the max dispenser weight in g
  return Math.round(dispVolume * ingrDensity);
}

export function assignDispenser(dispensers: ReadDispenser[], ingrShelfLife: number): ReadDispenser {
  const storageType = ingrShelfLife === 0 ? 'Dry' : 'Fridge';

  const availableDisps = dispensers
    .filter((dispenser) => dispenser.storage === storageType && dispenser.isFree)
    .sort((a, b) => a.number - b.number);

  return availableDisps.length > 0 ? availableDisps[0] : null;
}
