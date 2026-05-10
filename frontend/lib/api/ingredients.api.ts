import useSWR from "swr";
import { dataFetcher } from "./fetcher";

const getIngredients = (locale: string) => {
  const { data, error, isLoading } = useSWR("/ingredients", (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    ingredients: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get ingredient by id */
const getIngredientById = (locale: string, id: string) => {
  const { data, error, isLoading } = useSWR(
    `/ingredients/${id}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    ingredient: data,
    isLoading,
    isError: error,
  };
};

export { getIngredients, getIngredientById };
