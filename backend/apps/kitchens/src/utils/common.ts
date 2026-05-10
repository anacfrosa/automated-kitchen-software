import { Inventory } from '../inventory/entities/inventory.entity';
import { ReadInventory } from '../inventory/inventory.interface';

//Function to convert quantities to kg or l
export const convertToStandardUnit = (quantity: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return quantity;
    case 'g':
      return quantity / 1000; // to kg
    case 'l':
      return quantity;
    case 'ml':
      return quantity * 1000; // to l
    default:
      return 0;
  }
};

export const getStandardUnit = (measureUnit: string): string => {
  switch (measureUnit) {
    case 'kg':
      return 'kg';
    case 'g':
      return 'kg';
    case 'l':
      return 'l';
    case 'ml':
      return 'ml';
    default:
      return '';
  }
};

//Function to convert quantities to kg
export const convertToKG = (quantity: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return quantity;
    case 'g':
      return quantity / 1000;
    default:
      return 0;
  }
};

//Function to convert quantities to grams
export const convertToGrams = (quantity: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return quantity * 1000; // Convert Kg to grams
    case 'g':
      return quantity; // Already in grams
    default:
      return 0;
  }
};

export function getCurrentQty(inventory: Inventory) {
  return (
    Number(convertToStandardUnit(inventory['initQuantity'], inventory['initMeasureUnit'])) + // convert to standard unit
    Number(inventory['quantityIn']) -
    Number(inventory['quantityOut'])
  );
}

// Function to calculate days until expiryDate
export function calculateDaysUntilExpiryDate(expiryDate: Date) {
  let expiryDateObject: Date = expiryDate;
  // Ensure expiryDate is a Date object
  if (!(expiryDateObject instanceof Date)) {
    expiryDateObject = new Date(expiryDateObject);
  }

  // Get today's date
  const today = new Date();

  // Calculate the difference in milliseconds
  const differenceMs = expiryDateObject.getTime() - today.getTime();

  // Convert milliseconds to days
  const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return differenceDays;
}
