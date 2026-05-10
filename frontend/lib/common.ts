import { ReadDispenser } from "@wac/types/dispenser";
import { Inventory } from "@wac/types/inventory";
import { lotNumberList } from "./interfaces/inventory.interface";
import { Ingredient } from "./interfaces/ingredient.interface";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Function to convert quantity to grams */
export const convertToGrams = (quantity: number, unit: string): number => {
  switch (unit) {
    case "kg":
      return quantity * 1000; // Convert Kg to grams
    case "g":
      return quantity; // Already in grams
    default:
      return 0;
  }
};

export const convertToStandardUnit = (
  quantity: number,
  unit: string
): number => {
  switch (unit) {
    case "kg":
      return quantity;
    case "g":
      return quantity / 1000; // convert to kg
    default:
      return 0;
  }
};

export const getStandardUnit = (measureUnit: string): string => {
  switch (measureUnit) {
    case "kg":
      return "kg";
    case "g":
      return "kg";
    case "l":
      return "l";
    case "ml":
      return "ml";
    default:
      return "";
  }
};

export function filterUniqueIngredients(
  inventories: Inventory[]
): Ingredient[] {
  const uniqueIngredientsSet = new Set<Ingredient>();

  for (const inv of inventories) {
    const ingredient = inv.purchaseInfo.ingredient;
    uniqueIngredientsSet.add(ingredient);
  }

  return Array.from(uniqueIngredientsSet);
}

export const DisplayQuantity = (quantity: number, measureUnit: string) => {
  let quantityAvailable: string = "";

  quantityAvailable =
    quantity < 1
      ? convertToGrams(quantity, measureUnit) + " g"
      : quantity + " " + measureUnit;

  return quantityAvailable;
};

export const DisplayRequiredQty = (quantity: number): string => {
  let quantityReq: number = quantity; // kg
  let measureUnit: string = "kg";
  if (quantityReq < 1) {
    // Convert to grams and format as a number
    quantityReq = parseFloat((quantityReq * 1000).toFixed(0));
    measureUnit = "g";
  }
  return quantityReq + " " + measureUnit;
};

export function getDispenserMaxCapacity(
  dispVolume: number,
  ingrDensity: number
): number {
  // volume - cm3
  // density - g/cm3
  // This will return the max dispenser weight in g
  return Math.round(dispVolume * ingrDensity);
}

export function getDispenserLevel(
  currentQty: number,
  maxCapacity: number
): number {
  // currentQty - grams
  // maxCapacity - grams

  return (currentQty / maxCapacity) * 100; // %
}

export const validRemoveField = (
  current: { quantity: number; measureUnit: string },
  remove: { quantity: number; measureUnit: string }
) => {
  let valid = true;
  const currentGrams = convertToGrams(current.quantity, current.measureUnit);
  const removeGrams = convertToGrams(remove.quantity, remove.measureUnit);

  if (Number.isNaN(remove.quantity)) {
    valid = false;
  } else if (remove.quantity <= 0) {
    valid = false;
  } else if (removeGrams > currentGrams) {
    valid = false;
  }

  return valid;
};

export function assignDispenser(
  dispsList: ReadDispenser[],
  ingredient: Ingredient
): string {
  let assignedDisp: string = "";

  if (ingredient.shelfLife == 0) {
    // Not perishable -> Assign to Dry dispenser

    const dryDisps = dispsList.filter(
      (dispenser: ReadDispenser) =>
        dispenser.storage == "Dry" && dispenser.isFree == true
    );
    if (dryDisps.length !== 0)
      assignedDisp = dryDisps.sort((a, b) => a.number - b.number)[0].id;
  } else {
    // Perishable -> Assign to Fridge dispenser

    const fridgeDisps = dispsList.filter(
      (dispenser: ReadDispenser) =>
        dispenser.storage == "Fridge" && dispenser.isFree == true
    );
    if (fridgeDisps.length !== 0)
      assignedDisp = fridgeDisps.sort((a, b) => a.number - b.number)[0].id;
  }

  return assignedDisp;
}
