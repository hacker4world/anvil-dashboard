// ============================================================
// Import/Export Module - DTOs (TypeScript interfaces)
// These mirror the backend's class-validator DTOs for frontend use
// ============================================================

import { Account } from "./Account.model";

// ---------- Request DTOs ----------

export interface CreateImportItemDto {
  productId: number;
  enteredStock: number;
  unitPrice: number;
}

export interface CreateImportDto {
  date: string; // ISO date string (e.g. "2024-01-15")
  observation?: string;
  supplierId: number;
  manufacturerId: number;
  importItems?: CreateImportItemDto[];
  accountId: number;
}

export interface UpdateImportItemDto {
  id?: number;
  productId: number;
  enteredStock: number;
  unitPrice: number;
}

export interface UpdateImportDto {
  date?: string;
  observation?: string;
  confirmed?: boolean;
  supplierId?: number;
  manufacturerId?: number;
  importItems?: UpdateImportItemDto[];
}

export interface ImportFilters {
  observation?: string;
  supplierId?: number;
  manufacturerId?: number;
  confirmed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  accountId?: number; // <-- NEW

  // --- Filters on ImportItem ---
  productId?: number;
  unitPriceFrom?: number;
  unitPriceTo?: number;
  enteredStockFrom?: number;
  enteredStockTo?: number;
}

export interface ListImportDto {
  page?: number;
  pageSize?: number;
  filters?: ImportFilters;
}

// ---------- Response DTOs ----------

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export interface SupplierResponse {
  id: number;
  name: string;
  contact: string;
  // ... other supplier fields as returned by the API
}

export interface ManufacturerResponse {
  id: number;
  name: string;
  contact: string;
  address: string;
  // ... other manufacturer fields
}

export interface ProductResponse {
  id: number;
  name: string;
  stock: number;
  averagePrice: number;
  // ... other product fields
}

export interface ImportItemResponse {
  id: number;
  enteredStock: number;
  unitPrice: number;
  product: ProductResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ImportResponse {
  id: number;
  date: string;
  observation: string;
  confirmed: boolean;
  bonDeCommande: string;
  bonDeLivraison: string;
  supplier: SupplierResponse;
  manufacturer: ManufacturerResponse;
  importItems: ImportItemResponse[];
  createdAt: string;
  updatedAt: string;
  account: Account;
}

export interface PaginatedImportsResponse {
  items: ImportResponse[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
}
