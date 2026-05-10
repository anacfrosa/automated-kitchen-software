import useSWR from "swr";
import { dataFetcher } from "./fetcher";
import { CreateWastage } from "../interfaces/wastage.interface";
import { API_URL } from "@wac/utils/api/config";
import axios from "axios";

/** CREATE - Create new wastage */
export const createWastage = async (newWastage: CreateWastage) => {
  const url = `${API_URL}/wastage`;
  const config = { "Content-Type": "application/json" };
  try {
    // Make POST request
    const response = await axios.post(url, newWastage, { headers: config });
    console.log(response.data);
  } catch (error) {
    console.error("Error creating new inventory", error);
  }
};

/** GET -  Get wastages by shop */
export const getWastagesByShop = (locale: string, shopId: string) => {
  const { data, error, isLoading } = useSWR(`/wastage/shop/${shopId}`, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    wastage: data,
    isLoading,
    isError: error,
  };
};
