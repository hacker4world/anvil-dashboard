import { Account } from "./Account.model";

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

/** The ConstructionSite entity shape as returned by the API */
export interface ConstructionSite {
  id: number;
  name: string;
  address: string;
  manager: Account | null;
  createdAt: string;
  updatedAt: string;
}

/** Paginated list shape returned by findFiltered */
export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
}

// ---------------------------------------------------------------------------
// Request DTOs (mirroring the backend validation DTOs for client-side use)
// ---------------------------------------------------------------------------

export interface CreateConstructionSiteRequest {
  name: string;
  address: string;
  managerId: number;
}

export interface UpdateConstructionSiteRequest {
  name?: string;
  address?: string;
  managerId?: number;
}

export interface ConstructionSiteFilters {
  name?: string;
  address?: string;
  managerId?: number;
}

export interface ListConstructionSiteRequest {
  page?: number;
  pageSize?: number;
  filters?: ConstructionSiteFilters;
}
