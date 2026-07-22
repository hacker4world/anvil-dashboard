import { Subfamily } from "./Subfamily.model";

export interface Family {
  id: number;
  name: string;
  subfamilies?: Subfamily[];
  createdAt: string;
  updatedAt: string;
}

export interface FamilyFilters {
  name?: string;
}

export interface ListFamilyRequest {
  page?: number;
  pageSize?: number;
  filters?: FamilyFilters;
}

export interface CreateFamilyDto {
  name: string;
}

export interface UpdateFamilyDto {
  name?: string;
}