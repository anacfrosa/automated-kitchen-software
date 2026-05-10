import { ExportInventory, Inventory } from "@wac/types/inventory";
import { convertToGrams } from "@wac/lib/common";
import { fDateISO8601 } from "@wac/lib/format-date";
import { Dayjs } from "dayjs";

export interface FiltersType {
  name: string;
  lotNumber: number;
  quantity: number;
  measureUnit: string;
  receptionDate: {
    start: Dayjs | null;
    end: Dayjs | null;
  };
  expiryDate: {
    start: Dayjs | null;
    end: Dayjs | null;
  };
}

export function processDataToExport(data: Inventory[]): ExportInventory[] {
  const dataToExport: ExportInventory[] = [];
  data.forEach((item) => {
    dataToExport.push({
      Ingredient: item.purchaseInfo.ingredient.name,
      "Lot Number": Number(item.lotNumber),
      Quantity: item.quantity.current + item.quantity.measureUnit,
      "Reception Date": item.purchaseInfo.receptionDate,
      "Expiry Date": item.expiryDate,
    });
  });

  return dataToExport;
}

export function applyFilter({
  inputData,
  filters,
}: {
  inputData: any;
  filters: FiltersType;
}) {
  const { name, lotNumber, quantity, measureUnit, receptionDate, expiryDate } =
    filters;

  let data = inputData;

  // if (data.length != 0) {
  //   data = inputData.filter(
  //     (inventory: Inventory) => inventory.quantity.current !== 0
  //   );

  //   console.log(data);
  // }

  if (name) {
    data = data.filter(
      (inventory: Inventory) =>
        inventory.purchaseInfo.ingredient.name
          .toLowerCase()
          .indexOf(name.toLowerCase()) !== -1
    );
  }

  if (lotNumber) {
    data = data.filter(
      (inventory: Inventory) =>
        inventory.lotNumber
          .toString()
          .toLowerCase()
          .indexOf(lotNumber.toString().toLowerCase()) !== -1
    );
  }

  if (quantity) {
    data = data.filter((inventory: Inventory) => {
      const quantityUnit: string =
        inventory.quantity.current < 1
          ? convertToGrams(
              inventory.quantity.current,
              inventory.quantity.measureUnit
            ) + "g"
          : inventory.quantity.current + inventory.quantity.measureUnit;
      const filterValue = quantity.toString() + measureUnit;
      return quantityUnit.indexOf(filterValue) !== -1;
    });
  }

  if (receptionDate.start && receptionDate.end) {
    // check if they are != null
    if (receptionDate.start.isValid() && receptionDate.end.isValid()) {
      // check if they are valid
      const start = fDateISO8601({
        day: receptionDate.start.date() + 1,
        month: receptionDate.start.month(),
        year: receptionDate.start.year(),
      });
      const end = fDateISO8601({
        day: receptionDate.end.date() + 1,
        month: receptionDate.end.month(),
        year: receptionDate.end.year(),
      });
      data = data.filter((inventory: Inventory) => {
        // Only compare the date
        return (
          inventory.purchaseInfo.receptionDate.slice(0, 10) >= start &&
          inventory.purchaseInfo.receptionDate.slice(0, 10) <= end
        );
      });
    }
  }

  if (expiryDate.start && expiryDate.end) {
    // check if they are != null
    if (expiryDate.start.isValid() && expiryDate.end.isValid()) {
      // check if they are valid
      const start = fDateISO8601({
        day: expiryDate.start.date(),
        month: expiryDate.start.month(),
        year: expiryDate.start.year(),
      });
      const end = fDateISO8601({
        day: expiryDate.end.date(),
        month: expiryDate.end.month(),
        year: expiryDate.end.year(),
      });
      data = data.filter((inventory: Inventory) => {
        // Only compare the date
        return (
          inventory.expiryDate.slice(0, 10) >= start &&
          inventory.expiryDate.slice(0, 10) <= end
        );
      });
    }
  }

  return data;
}
