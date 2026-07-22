export interface SupplierModel {
  id: number;
  name: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFilters {
  name?: string;
  contact?: string;
}

export interface ListSupplierRequest {
  page?: number;
  pageSize?: number;
  filters?: SupplierFilters;
}

export interface CreateSupplierRequest {
  name: string;
  contact: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contact?: string;
}