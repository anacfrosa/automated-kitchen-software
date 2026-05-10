import useSWR from "swr";
import { dataFetcher } from "./fetcher";

/** GET -  Get ingredients forecasts by shop */
export const getForecastsByShop = (locale: string, shopId: string) => {
  const { data, error, isLoading } = useSWR(
    `/forecasts/shop/${shopId}`,
    (uri) => dataFetcher(uri, locale)
  );

  return {
    data: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get all the forecast dates */
export const getForecastDates = (locale: string) => {
  const { data, error, isLoading } = useSWR(`/forecasts/dates`, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    dates: data,
    isLoading,
    isError: error,
  };
};
