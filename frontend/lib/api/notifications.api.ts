import useSWR from "swr";
import { dataFetcher } from "./fetcher";
import { API_URL } from "@wac/utils/api/config";
import axios from "axios";

/** POST -  Notice supply notif service to generate new notifications */
export const generateNewSupplyNotifs = async (shopId: string) => {
  const url = `${API_URL}/notifications/shop/${shopId}`;
  const config = { "Content-Type": "application/json" };

  try {
    const response = await axios.post(url, { headers: config });
    console.log(response.status);
  } catch (error: any) {
    console.error("Error creating a new purchase", error);
  }
};

/** GET -  Get supply notifications by shop */
export const getSupplyNotifByShop = (locale: string, shopId: string) => {
  const { data, error, isLoading } = useSWR(
    `/notifications/shop/${shopId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    notifications: data,
    isNotifLoading: isLoading,
    isNotifError: error,
  };
};
