export interface CreateSupplier {
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

export interface ReadSupplier {
  id: string;
  name: string;
  address: string;
  country: string;
  city: string;
  zipcode: string;
  phone: number;
  email: string;
  website: string;
}

export interface UpdateSupplier {
  name?: string;
  address?: string;
  country?: string;
  city?: string;
  zipcode?: string;
  phone?: number;
  email?: string;
  website?: string;
}
