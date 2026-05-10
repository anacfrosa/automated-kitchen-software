import axios from "axios";
import { API_URL } from "./config";

const dataFetcher = async (uri: string, locale: string): Promise<any> => {
  const url = `${API_URL}${uri}`;
  const config = { "Accept-Language": locale };
  try {
    const res = await axios.get(url, { headers: config });
    return res.data;
  } catch (error) {
    // Handle error appropriately, e.g., log or throw
    console.error("Error while fetching data !", error);
    throw error;
  }
};

export { dataFetcher };
