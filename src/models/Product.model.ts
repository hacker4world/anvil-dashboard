// /src/models/Product.model.ts
import { CategoryModel } from "./Category.model";
import { SupplierModel } from "./Supplier.model";
import { UnitModel } from "./Unit.model";
import { WarehouseModel } from "./Warehouse.model";

// ──────────────────────────────────────────────
// API Response Entity (nested objects)
// ──────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  stock: number;
  minimumStock: number;
  averagePrice: number;
  unit: UnitModel;
  warehouse: WarehouseModel;
  category: CategoryModel;
  createdAt: string;
  updatedAt: string;
  suppliers: SupplierModel[];
}

// ──────────────────────────────────────────────
// Filters (matches backend ProductFilters DTO)
// ──────────────────────────────────────────────
export interface ProductFilters {
  name?: string;
  stock?: number;
  minimumStock?: number;
  averagePrice?: number;
  unitId?: number;
  warehouseId?: number;
  categoryId?: number;
}

// ──────────────────────────────────────────────
// UI Model (flat fields — used by existing modals)
// ──────────────────────────────────────────────
export interface ArticleModel {
  id: number;
  name: string;
  currentStock: number;
  averagePrice: number;
  warehouseId: number;
  warehouseName: string;
  unitId: number;
  unitName: string;
  categoryId: number;
  categoryName: string;
  suppliers: SupplierModel[];
}

// ──────────────────────────────────────────────
// Request DTOs
// ──────────────────────────────────────────────
export interface CreateProductRequest {
  name: string;
  minimumStock: number;
  unitId: number;
  warehouseId: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name?: string;
  minimumStock?: number;
  unitId?: number;
  warehouseId?: number;
  categoryId?: number;
}

export interface ListProductRequest {
  page?: number;
  pageSize?: number;
  filters?: ProductFilters;
}

// ──────────────────────────────────────────────
// Helper: Convert Product (API) → ArticleModel (UI)
// ──────────────────────────────────────────────
export function productToArticleModel(product: Product): ArticleModel {
  return {
    id: product.id,
    name: product.name,
    currentStock: product.stock,
    averagePrice: product.averagePrice,
    warehouseId: product.warehouse.id,
    warehouseName: product.warehouse.name,
    unitId: product.unit.id,
    unitName: product.unit.name,
    categoryId: product.category.id,
    categoryName: product.category.name,
    suppliers: product.suppliers,
  };
}
