import { useTranslation } from "@wac/app/i18n/client";
import { fDateISO8601 } from "@wac/lib/format-date";
import {
  ExportPurchases,
  ReadPurchase,
} from "@wac/lib/interfaces/purchases.interface";
import { Dayjs } from "dayjs";

export interface FiltersType {
  name: string;
  purchaseDate: {
    start: Dayjs | null;
    end: Dayjs | null;
  };
  expectedDate: {
    start: Dayjs | null;
    end: Dayjs | null;
  };
}

export function processDataToExport(data: ReadPurchase[]): ExportPurchases[] {
  const dataToExport: ExportPurchases[] = [];
  data.forEach((item) => {
    dataToExport.push({
      Number: Number(item.number),
      Supplier: item.supplier.name,
      "Purchase Date": item.purchaseDate,
      "Delivery Date": item.deliveryDate,
      "Reception Date": item.receptionDate,
      Status: item.status,
      "Total Cost": Number(item.totalCost),
    });
  });

  return dataToExport;
}

export function applyPurchaseFilter({
  lng,
  inputData,
  filters,
  purchaseStatus,
}: {
  lng: string;
  inputData: ReadPurchase[];
  filters: FiltersType;
  purchaseStatus: string;
}) {
  const { t } = useTranslation(lng, "purchases");

  const { name, purchaseDate, expectedDate } = filters;

  // Filter by purchase status (Delivered, Pending, Canceled)
  if (purchaseStatus) {
    console.log(purchaseStatus);
    let currentStatus: string = "Delivered";

    if (purchaseStatus == t("tabsTitle.pending")) {
      currentStatus = "Pending";
    } else if (purchaseStatus == t("tabsTitle.canceled")) {
      currentStatus = "Canceled";
    }

    console.log(currentStatus);

    inputData = inputData.filter(
      (purchase: ReadPurchase) =>
        purchase.status.toLowerCase().indexOf(currentStatus.toLowerCase()) !==
        -1
    );
  }

  if (name) {
    const lowerCaseName = name.toLowerCase();
    inputData = inputData.filter((purchase) => {
      return (
        purchase.supplier.name.toLowerCase().includes(lowerCaseName) ||
        purchase.totalCost.toString().includes(name) ||
        purchase.number.toString().includes(name)
      );
    });
  }

  if (purchaseDate.start && purchaseDate.end) {
    // check if they are != null
    if (purchaseDate.start.isValid() && purchaseDate.end.isValid()) {
      // check if they are valid
      const start = fDateISO8601({
        day: purchaseDate.start.date() + 1,
        month: purchaseDate.start.month(),
        year: purchaseDate.start.year(),
      });
      const end = fDateISO8601({
        day: purchaseDate.end.date() + 1,
        month: purchaseDate.end.month(),
        year: purchaseDate.end.year(),
      });
      inputData = inputData.filter((purchase: ReadPurchase) => {
        // Only compare the date
        return (
          purchase.purchaseDate.slice(0, 10) >= start &&
          purchase.purchaseDate.slice(0, 10) <= end
        );
      });
    }
  }

  if (expectedDate.start && expectedDate.end) {
    // check if they are != null
    if (expectedDate.start.isValid() && expectedDate.end.isValid()) {
      // check if they are valid
      const start = fDateISO8601({
        day: expectedDate.start.date() + 1,
        month: expectedDate.start.month(),
        year: expectedDate.start.year(),
      });
      const end = fDateISO8601({
        day: expectedDate.end.date() + 1,
        month: expectedDate.end.month(),
        year: expectedDate.end.year(),
      });
      inputData = inputData.filter((purchase: ReadPurchase) => {
        // Only compare the date
        if (purchase.deliveryDate)
          return (
            purchase.deliveryDate.slice(0, 10) >= start &&
            purchase.deliveryDate.slice(0, 10) <= end
          );
      });
    }
  }

  return inputData;
}
