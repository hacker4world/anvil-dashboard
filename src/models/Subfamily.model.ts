import { Category } from "./Category.model";
import { Family } from "./family.model";

export interface Subfamily {
  id: number;
  name: string;
  familyId?: number;
  family?: Family; // <-- The API returns the full family object
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

/** Simplified model used in the UI (includes familyName for display) */
export interface SubfamilyModel {
  id: number;
  name: string;
  familyId?: number;
  familyName?: string;
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

/** Maps an API Subfamily (with nested family object) into a UI-friendly SubfamilyModel */
export function mapToSubfamilyModel(subfamily: Subfamily): SubfamilyModel {
  return {
    id: subfamily.id,
    name: subfamily.name,
    familyId: subfamily.family?.id ?? subfamily.familyId,
    familyName: subfamily.family?.name,
    categories: subfamily.categories,
    createdAt: subfamily.createdAt,
    updatedAt: subfamily.updatedAt,
  };
}

export interface SubfamilyFilters {
  name?: string;
  familyId?: number;
}

export interface ListSubfamilyRequest {
  page?: number;
  pageSize?: number;
  filters?: SubfamilyFilters;
}

export interface CreateSubfamilyDto {
  name: string;
  familyId: number;
}

export interface UpdateSubfamilyDto {
  name?: string;
  familyId?: number;
}
