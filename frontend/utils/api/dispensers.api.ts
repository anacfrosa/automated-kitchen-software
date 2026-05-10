import useSWR from "swr";
import { dataFetcher } from "./fetcher";
import { API_URL } from "./config";
import axios from "axios";
import { UpdateDispenser } from "@wac/types/dispenser";

/** GET -  Get dispenser from a wac shop */
const getDispenserByShop = (
  locale: string,
  shopId: string,
  ingredientId?: string,
  storage?: string
) => {
  let uri: string = `/dispensers/shop/${shopId}`;
  if (ingredientId) {
    uri = `/dispensers/shop/${shopId}?ingredientId=${ingredientId}`;
  } else if (storage) {
    uri = `/dispensers/shop/${shopId}?storage=${storage}`;
  }

  const { data, error, isLoading, mutate } = useSWR(uri, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    dispensers: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

/** GET -  Get dispenser by id */
const getDispenserById = (locale: string, dispenserId: string) => {
  const { data, error, isLoading } = useSWR(
    `/dispensers/${dispenserId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    dispenser: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get all the lots in a dispenser */
const findLotsInDispenser = (locale: string, dispenserId: string) => {
  const { data, error, isLoading } = useSWR(
    `/dispensers/${dispenserId}/lots`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    lots: data,
    isLotsLoading: isLoading,
    isLotsError: error,
  };
};

/** PATCH - update dispenser */
const updateDispenserById = async (
  dispenserId: string,
  data: UpdateDispenser,
  action?: string
) => {
  const url = `${API_URL}/dispensers/${dispenserId}`;
  const config = { "Content-Type": "application/json" };

  try {
    let dispenser = data;

    if (action != undefined) {
      // Fill dispenser with new ingredient
      if (action == "fill") {
        dispenser = {
          initQuantity: Number(data.initQuantity),
          initMeasureUnit: data.initMeasureUnit,
          isFree: false,
          ingredientId: data.ingredientId,
          inventories: data.inventories,
        };
      } else if (action == "refill") {
        dispenser = {
          quantityIn: Number(data.quantityIn),
          measureUnit: data.measureUnit,
        };
      }
    }

    // Make PATCH request
    const response = await axios.patch(url, dispenser, { headers: config });
    console.log(response.data);
  } catch (error) {
    console.error("Error updating dispenser content", error);
  }
};

export {
  getDispenserByShop,
  getDispenserById,
  updateDispenserById,
  findLotsInDispenser,
};
