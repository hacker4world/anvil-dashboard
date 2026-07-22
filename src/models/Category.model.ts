import { Subfamily } from "./Subfamily.model";

export interface Category {
  id: number;
  name: string;
  subfamily?: Subfamily;
  createdAt: string;
  updatedAt: string;
}

/** Simplified model used in the UI (includes subfamilyId and subfamilyName for display) */
export interface CategoryModel {
  id: number;
  name: string;
  subfamilyId?: number;
  subfamilyName?: string;
  createdAt: string;
  updatedAt: string;
}

/** Maps an API Category (with nested subfamily object) into a UI-friendly CategoryModel */
export function mapToCategoryModel(category: Category): CategoryModel {
  return {
    id: category.id,
    name: category.name,
    subfamilyId: category.subfamily?.id,
    subfamilyName: category.subfamily?.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export interface CreateCategoryDto {
  name: string;
  subfamilyId: number;
}

export interface UpdateCategoryDto {
  name?: string;
  subfamilyId?: number;
}

export interface CategoryFilters {
  name?: string;
  subfamilyId?: number;
}

export interface ListCategoryRequest {
  page?: number;
  pageSize?: number;
  filters?: CategoryFilters;
}
