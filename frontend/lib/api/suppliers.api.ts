import useSWR from "swr";
import { dataFetcher } from "./fetcher";
import axios from "axios";
import { API_URL } from "@wac/utils/api/config";
import { Supplier } from "../interfaces/supplier.interface";

/** CREATE - Create new a supplier */
const createSupplier = async (data: Supplier): Promise<number | undefined> => {
  const url = `${API_URL}/suppliers`;
  const config = { "Content-Type": "application/json" };
  try {
    const supplier = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      country: data.country,
      city: data.city,
      zipcode: data.zipcode,
    };
    // Make POST request
    const response = await axios.post(url, supplier, { headers: config });
    console.log(response.data);
    return response.status;
  } catch (error) {
    console.error("Error while creating a new supplier", error);
    return undefined;
  }
};

// Get all suppliers register
const getSuppliers = (locale: string) => {
  const { data, error, isLoading } = useSWR(`/suppliers`, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    suppliers: data,
    isLoading,
    isError: error,
  };
};

/** GET -  Get supplier by id */
const getSupplierById = (locale: string, id: string) => {
  const { data, error, isLoading, mutate } = useSWR(`/suppliers/${id}`, (uri) =>
    dataFetcher(uri, locale)
  );

  return {
    supplier: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

/** PATCH - update supplir  */
const updateSupplierById = async (
  id: string,
  data: Supplier
): Promise<number | undefined> => {
  const url = `${API_URL}/suppliers/${id}`;
  const config = { "Content-Type": "application/json" };
  try {
    // Make PATCH request
    const response = await axios.patch(url, data, { headers: config });
    console.log(response.data);
    return response.status;
  } catch (error) {
    console.error("Error updating inventory content", error);
    return undefined;
  }
};

export { createSupplier, getSuppliers, getSupplierById, updateSupplierById };
