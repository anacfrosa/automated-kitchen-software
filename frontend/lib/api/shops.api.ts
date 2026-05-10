import useSWR from "swr";
import { dataFetcher } from "../../utils/api/fetcher";

const SHOPID: string = "26977ff5-9bf4-4680-8e78-8c07e20ef79e"; // Fixed for now

// Get all wish and cook shops
const getShopsWAC = (locale: string) => {
  return useSWR("/shops", (uri) => dataFetcher(uri, locale));
};

export { SHOPID, getShopsWAC };
