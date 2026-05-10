import { FillDetails, FillStatus } from "@wac/types/dispenser";
import { updateDispenserById } from "@wac/utils/api/dispensers.api";
//import { updateInventoryById } from "@wac/utils/api/inventory.api";
import {
  convertToGrams,
  convertToStandardUnit,
  getStandardUnit,
} from "@wac/lib/common";
import { updateInventory } from "@wac/utils/api/inventory.api";

export const fillOneDispenser = async (
  dispenserId: string,
  fillDetails: FillDetails[]
) => {
  let totalQuantity: number = 0;
  let inventoriesID: string[] = [];

  // Update inventory values and determine the total quantity added to dispenser
  for (const fillInfo of fillDetails) {
    totalQuantity += Number(
      convertToGrams(fillInfo.confirmQuantity, fillInfo.confirmUnit)
    );

    if (Number(fillInfo.confirmQuantity) !== 0) {
      const inventoryId: string = fillInfo.inventoryId;
      inventoriesID.push(inventoryId);

      await updateInventory(inventoryId, {
        quantityOut: Number(
          convertToStandardUnit(fillInfo.confirmQuantity, fillInfo.confirmUnit)
        ),
        measureUnit: getStandardUnit(fillInfo.confirmUnit),
      });
    }
  }

  // Update dispenser values
  await updateDispenserById(
    dispenserId,
    {
      initQuantity:
        totalQuantity >= 1000 ? totalQuantity / 1000 : totalQuantity,
      initMeasureUnit: totalQuantity >= 1000 ? "kg" : "g",
      ingredientId: fillDetails[0].ingredient.id,
      inventories: inventoriesID,
    },
    "fill"
  );
};

export function ValidFields(
  maxCapacity: number,
  qtyAvailable: { quantity: number; measureUnit: string },
  qtyFields: { quantity: number; measureUnit: string }
) {
  console.log(qtyFields.quantity);
  console.log(qtyFields.measureUnit);
  if (Number.isNaN(qtyFields.quantity) || qtyFields.measureUnit == "") {
    return { valid: false, error: "Quantity fields required." };
  }

  const qtyAvailableGrams = convertToGrams(
    qtyAvailable.quantity,
    qtyAvailable.measureUnit
  );
  const qtyFieldsGrams = convertToGrams(
    qtyFields.quantity,
    qtyFields.measureUnit
  );

  if (qtyFieldsGrams > maxCapacity)
    return {
      valid: false,
      error: "Inserted quantity exceeds maximum capacity.",
    };

  if (qtyFieldsGrams > qtyAvailableGrams)
    return { valid: false, error: "There isn't sufficient quantity." };

  if (qtyFieldsGrams < 0)
    return { valid: false, error: "Invalid quantity value." };

  return { valid: true, error: "" };
}

export const getFillStatusByLotNumber = (
  lotNumber: number,
  validFields: FillStatus[]
) => {
  return validFields.find((status) => status.lotNumber === lotNumber);
};
