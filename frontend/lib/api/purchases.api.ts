import useSWR from "swr";
import { dataFetcher } from "../../utils/api/fetcher";
import { API_URL } from "../../utils/api/config";
import axios from "axios";
import {
  CreatePurchase,
  UpdatePurchase,
  UpdatePurchaseItem,
} from "../interfaces/purchases.interface";

/** CREATE - Create new purchase */
const createPurchase = async (purchase: CreatePurchase): Promise<number> => {
  const url = `${API_URL}/purchases`;
  const config = { "Content-Type": "application/json" };

  //console.log(purchase);

  try {
    const response = await axios.post(url, purchase, { headers: config });
    console.log(response.data);
    return response.status;
  } catch (error: any) {
    console.error("Error creating a new purchase", error);
    if (error.response) {
      return error.response.status;
    } else {
      // If there is no response from the server, you can handle it accordingly.
      return -1;
    }
  }
};

/** GET -  Get purchases by shop */
const getPurchasesByShop = (locale: string, shopId: string) => {
  const { data, error, isLoading } = useSWR(
    `/purchases/shop/${shopId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    purchases: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get purchases by id */
const getPurchasesById = (locale: string, id: string) => {
  const { data, error, isLoading, mutate } = useSWR(`/purchases/${id}`, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    purchase: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

/** PATCH - update purchase */
const updatePurchase = async (purchaseId: string, data: UpdatePurchase) => {
  const url = `${API_URL}/purchases/${purchaseId}`;
  const config = { "Content-Type": "application/json" };
  try {
    const response = await axios.patch(url, data, { headers: config });
    console.log(response.data);
  } catch (error) {
    console.error("Error updating purchase content", error);
  }
};

/** PATCH - update purchase item */
const updatePurchaseItem = async (
  purchaseId: string,
  itemId: string,
  data: UpdatePurchaseItem
) => {
  const url = `${API_URL}/purchases/${purchaseId}?itemId=${itemId}`;
  const config = { "Content-Type": "application/json" };
  try {
    const response = await axios.patch(url, data, { headers: config });
    console.log(response.data);
  } catch (error) {
    console.error("Error updating purchase item content", error);
  }
};

export {
  getPurchasesByShop,
  getPurchasesById,
  createPurchase,
  updatePurchase,
  updatePurchaseItem,
};
