import useSWR from "swr";
import { dataFetcher } from "./fetcher";

/** GET -  Get dispenser from a wac shop */
const getDispenserByShop = (locale: string, shopId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/dispensers/shop/${shopId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    dispensers: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

/** GET -  Get dispensers by shopId and ingredientId */
const getDispenserByShopAndIngredient = (
  locale: string,
  shopId: string,
  ingredientId: string
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/dispensers/shop/${shopId}?ingredientId=${ingredientId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    dispensers: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

/** GET -  Get dispensers by shopId and storage */
const getDispenserByShopAndStorage = (
  locale: string,
  shopId: string,
  storage: string
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/dispensers/shop/${shopId}?storage=${storage}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    dispensers: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

export {
  getDispenserByShop,
  getDispenserByShopAndIngredient,
  getDispenserByShopAndStorage,
};
