import {
  ExportSupplier,
  Supplier,
} from "@wac/lib/interfaces/supplier.interface";

export function processDataToExport(data: Supplier[]): ExportSupplier[] {
  const dataToExport: ExportSupplier[] = [];
  data.forEach((supplier) => {
    dataToExport.push({
      Supplier: supplier.name,
      "Phone Number": supplier.phone,
      Email: supplier.email,
      Location: supplier.country + ", " + supplier.city,
      Address: supplier.address + ", " + supplier.zipcode,
      Website: supplier.website ? supplier.website : "",
    });
  });

  return dataToExport;
}

export function applySupplierFilter({
  inputData,
  filter,
}: {
  inputData: Supplier[];
  filter: string;
}) {
  let filteredData: Supplier[] = [];

  if (filter) {
    //search by name
    if (filteredData.length === 0) {
      filteredData = inputData.filter(
        (supplier: Supplier) =>
          supplier.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      );
    }

    //search by contact
    if (filteredData.length === 0) {
      filteredData = inputData.filter(
        (supplier: Supplier) =>
          supplier.phone.toString().indexOf(filter.toLowerCase()) !== -1
      );
    }

    //search by email
    if (filteredData.length === 0) {
      filteredData = inputData.filter(
        (supplier: Supplier) =>
          supplier.email.indexOf(filter.toLowerCase()) !== -1
      );
    }

    return filteredData;
  }
  return inputData;
}
