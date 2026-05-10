interface Supplier {
  id?: string;
  name: string;
  address: string;
  country: string;
  city: string;
  zipcode: string;
  phone: number;
  email: string;
  website?: string;
}

interface ExportSupplier {
  Supplier: string;
  "Phone Number": number;
  Email: string;
  Location: string;
  Address: string;
  Website: string;
}

export type { Supplier, ExportSupplier };
