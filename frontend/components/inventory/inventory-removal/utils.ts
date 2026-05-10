import { Inventory } from "@wac/types/inventory";
import { getInventoryById } from "@wac/utils/api/inventory.api";

export interface removalFieldsType {
  id?: string;
  quantity: number;
  measureUnit: string;
}

export const getInventoryList = ({
  inventoryIDList,
  lng,
}: {
  inventoryIDList: string[];
  lng: string;
}) => {
  let inventoryList: Inventory[] = [];

  for (const id of inventoryIDList) {
    const { data, isLoading, isError } = getInventoryById(lng, id);

    if (!isLoading && !isError) {
      inventoryList.push(data);
    }
  }

  return inventoryList;
};
