import useSWR from "swr";
import { dataFetcher } from "./fetcher";
import { API_URL } from "./config";
import axios from "axios";
import { CreateInventory, UpdateInventory } from "@wac/types/inventory";

/** CREATE - Create new inventory */
const createInventory = async (newInventory: CreateInventory) => {
  const url = `${API_URL}/inventory`;
  const config = { "Content-Type": "application/json" };
  try {
    // Make POST request
    const response = await axios.post(url, newInventory, { headers: config });
    console.log(response.data);
  } catch (error) {
    console.error("Error creating new inventory", error);
  }
};

/** GET -  Get inventory of ingredients by inventoryId */
const getInventoryById = (locale: string, id: string) => {
  const { data, error, isLoading } = useSWR(`/inventory/${id}`, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    data: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get inventory of ingredients from a wac shop */
const getInventoryByShop = (locale: string, shopId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/inventory/shop/${shopId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    inventory: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

/** GET -  Get inventory by purchaseItemId */
const getInventoryyByPurchaseItem = (
  locale: string,
  purchaseItemId: string
) => {
  const { data, error, isLoading } = useSWR(
    `/inventory/purchaseItem/${purchaseItemId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    inventory: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get inventory of ingredients by shopId and ingredientId */
const getInventoryByShopAndIngredient = (
  locale: string,
  shopId: string,
  ingredientId: string
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/inventory/shop/${shopId}?ingredientId=${ingredientId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    inventoryByIngredient: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

const updateInventory = async (
  inventoryId: string,
  newInventory: UpdateInventory
) => {
  const url = `${API_URL}/inventory/${inventoryId}`;
  const config = { "Content-Type": "application/json" };
  try {
    // Make PATCH request
    const response = await axios.patch(url, newInventory, { headers: config });
    console.log(response.data);
  } catch (error) {
    console.error("Error updating inventory content", error);
  }
};

export {
  createInventory,
  getInventoryById,
  getInventoryByShop,
  //getInventoryByShopAndDispenser,
  getInventoryByShopAndIngredient,
  updateInventory,
  getInventoryyByPurchaseItem
};
