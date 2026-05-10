import { FillDetails } from "@wac/types/dispenser";
import { Inventory } from "@wac/types/inventory";
import { convertToGrams } from "@wac/lib/common";

export function InitializeFields(
  lotsAvailable: Inventory[],
  maxRequired: { quantity: number; measureUnit: string }
): FillDetails[] {
  const fields: FillDetails[] = [];
  let quantityAdded: number = 0; // g for now
  let quantityRequired: number = convertToGrams(
    maxRequired.quantity,
    maxRequired.measureUnit
  );

  // Order lots by expiry Date (more recent first)
  lotsAvailable.sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return dateA.getTime() - dateB.getTime();
  });

  for (const item of lotsAvailable) {
    const quantityAvailable = convertToGrams(
      item.quantity.current,
      item.quantity.measureUnit
    );

    if (quantityAvailable !== 0) {
      // Calculate quantity to add from this item
      const quantityToAdd = Math.min(quantityAvailable, quantityRequired);

      // Add to fields
      fields.push({
        inventoryId: item.id,
        ingredient: {
          id: item.purchaseInfo.ingredient.id,
          name: item.purchaseInfo.ingredient.name,
          density: item.purchaseInfo.ingredient.density,
        },
        lotNumber: item.lotNumber,
        quantityAvailable: {
          quantity: item.quantity.current,
          unit: item.quantity.measureUnit,
        },
        // Check if the inserted value is in g or kg
        quantity: quantityToAdd < 1000 ? quantityToAdd : quantityToAdd / 1000,
        measureUnit: quantityToAdd < 1000 ? "g" : "kg",
        // Init confirm values
        confirmQuantity: 0,
        confirmUnit: "g",
      });

      //console.log(fields);

      // Update counters
      quantityAdded += quantityToAdd;
      quantityRequired -= quantityToAdd;

      if (
        quantityAdded ===
        convertToGrams(maxRequired.quantity, maxRequired.measureUnit)
      ) {
        // Stop loop if max quantity is reached
        break;
      }
    }
  }
  //console.log(fields);

  return fields;
}

export function UpdateFields(
  lotsAvailable: Inventory[],
  editedLotNumber: number,
  newFields: FillDetails[],
  maxRequired: { quantity: number; measureUnit: string }
): FillDetails[] {
  const updatedFields: FillDetails[] = [];
  let quantityAdded: number = 0; // g for now
  let quantityRequired: number = convertToGrams(
    maxRequired.quantity,
    maxRequired.measureUnit
  );

  // Order lots by expiry Date (more recent first)
  lotsAvailable.sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return dateA.getTime() - dateB.getTime();
  });

  for (const item of newFields) {
    // Check if the field was edited based on the init field
    const editedQuantity = convertToGrams(item.quantity, item.measureUnit);

    let quantityToAdd: number = 0;
    if (editedLotNumber === item.lotNumber) {
      // If edited, stay with the value
      quantityToAdd = editedQuantity;
    } else {
      // If not edited,  recalculate the new value
      const quantityAvailable = convertToGrams(
        item.quantityAvailable.quantity,
        item.quantityAvailable.unit
      );
      // Calculate quantity to add from this item
      quantityToAdd = Math.min(quantityAvailable, quantityRequired);
    }

    // Add to updated fields
    updatedFields.push({
      ...item,
      // Check if the inserted value is in g or kg
      quantity: quantityToAdd < 1000 ? quantityToAdd : quantityToAdd / 1000,
      measureUnit: quantityToAdd < 1000 ? "g" : "kg",
    });

    // Update counters
    quantityAdded += quantityToAdd;
    quantityRequired -= quantityToAdd;

    if (
      quantityAdded ===
      convertToGrams(maxRequired.quantity, maxRequired.measureUnit)
    ) {
      // Stop loop if max quantity is reached
      break;
    }
  }

  if (quantityRequired !== 0) {
    // In case the required quantity is not reached, then we need to see if there are more lots
    const additionalInvetory: Inventory[] = lotsAvailable.filter(
      (inventory) => {
        return !updatedFields.some(
          (field) => field.lotNumber === inventory.lotNumber
        );
      }
    );

    const missingFields = InitializeFields(additionalInvetory, {
      quantity: quantityRequired,
      measureUnit: "g",
    });

    updatedFields.push(...missingFields);
  }

  return updatedFields;
}
