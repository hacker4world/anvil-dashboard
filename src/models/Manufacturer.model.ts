export interface ManufacturerModel {
  id: number;
  name: string;
  contact: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturerFilters {
  name?: string;
  contact?: string;
  address?: string;
}

export interface ListManufacturerRequest {
  page?: number;
  pageSize?: number;
  filters?: ManufacturerFilters;
}

export interface CreateManufacturerRequest {
  name: string;
  contact?: string;
  address?: string;
}

export interface UpdateManufacturerRequest {
  name?: string;
  contact?: string;
  address?: string;
}