import { convertToGrams } from "@wac/lib/common";

export function CalculateQuantityToAdd(
  qtyAvailable: { quantity: number; measureUnit: string },
  qtyRequired: { quantity: number; measureUnit: string }
) {
  let qtyRequiredGrams: number = convertToGrams(
    qtyRequired.quantity,
    qtyRequired.measureUnit
  );
  const qtyAvailableGrams = convertToGrams(
    qtyAvailable.quantity,
    qtyAvailable.measureUnit
  );

  const quantityToAdd = Math.min(qtyAvailableGrams, qtyRequiredGrams);

  const quantity = quantityToAdd < 1000 ? quantityToAdd : quantityToAdd / 1000;
  const measureUnit = quantityToAdd < 1000 ? "g" : "kg";

  return quantity + " " + measureUnit;
}

export function CheckFillFields(
  maxCapacity: number,
  qtyAvailable: { quantity: number; measureUnit: string },
  qtyFields: { quantity: number; measureUnit: string },
  qtyInDispenser?: { quantity: number; measureUnit: string }
) {
  //console.log(maxCapacity);
  if (qtyFields.quantity == 0 || qtyFields.measureUnit == "") {
    return { valid: false, error: "Both fields are required." };
  }

  const qtyAvailableGrams = convertToGrams(
    qtyAvailable.quantity,
    qtyAvailable.measureUnit
  );
  const qtyFieldsGrams = convertToGrams(
    qtyFields.quantity,
    qtyFields.measureUnit
  );

  if (qtyInDispenser != undefined) {
    const qtyInDispGrams = convertToGrams(
      qtyInDispenser.quantity,
      qtyInDispenser.measureUnit
    );

    if (qtyInDispGrams + qtyFieldsGrams > maxCapacity)
      return {
        valid: false,
        error: "Inserted quantity exceeds maximum capacity.",
      };
  }

  //console.log(qtyAvailableGrams);
  //console.log(qtyFieldsGrams);

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
