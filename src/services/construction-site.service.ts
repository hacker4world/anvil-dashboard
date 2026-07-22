import {
  ConstructionSite,
  CreateConstructionSiteRequest,
  ListConstructionSiteRequest,
  PaginatedList,
  SuccessResponse,
  UpdateConstructionSiteRequest,
} from "@/models/ConstructionSite.model";
import { apiClient } from "./axios.client";
import { PaginatedAccounts } from "@/models/Account.model";

export async function createConstructionSite(
  data: CreateConstructionSiteRequest,
): Promise<SuccessResponse<ConstructionSite>> {
  const response = await apiClient.post<SuccessResponse<ConstructionSite>>(
    "/construction-sites",
    data,
  );
  return response.data;
}

export async function getAllConstructionSites(): Promise<
  SuccessResponse<ConstructionSite[]>
> {
  const response = await apiClient.get<SuccessResponse<ConstructionSite[]>>(
    "/construction-sites",
  );
  return response.data;
}

/**
 * Get a paginated, filtered list of construction sites.
 * POST /construction-sites/list
 */
export async function getFilteredConstructionSites(
  params: ListConstructionSiteRequest,
): Promise<SuccessResponse<PaginatedList<ConstructionSite>>> {
  const response = await apiClient.post<
    SuccessResponse<PaginatedList<ConstructionSite>>
  >("/construction-sites/list", params);
  return response.data;
}

/**
 * Get a single construction site by ID.
 * GET /construction-sites/:id
 */
export async function getConstructionSite(
  id: number,
): Promise<SuccessResponse<ConstructionSite>> {
  const response = await apiClient.get<SuccessResponse<ConstructionSite>>(
    `/construction-sites/${id}`,
  );
  return response.data;
}

/**
 * Update an existing construction site.
 * PATCH /construction-sites/:id
 */
export async function updateConstructionSite(
  id: number,
  data: UpdateConstructionSiteRequest,
): Promise<SuccessResponse<ConstructionSite>> {
  const response = await apiClient.patch<SuccessResponse<ConstructionSite>>(
    `/construction-sites/${id}`,
    data,
  );
  return response.data;
}

/**
 * Delete a construction site by ID.
 * DELETE /construction-sites/:id
 */
export async function deleteConstructionSite(
  id: number,
): Promise<SuccessResponse<null>> {
  const response = await apiClient.delete<SuccessResponse<null>>(
    `/construction-sites/${id}`,
  );
  return response.data;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export const getSiteExports = (
  siteId: number,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<any>> => {
  return apiClient
    .get(`/construction-sites/${siteId}/exports`, {
      params: { page, pageSize },
    })
    .then((res) => res.data);
};

export const getSiteReturns = (
  siteId: number,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<any>> => {
  return apiClient
    .get(`/construction-sites/${siteId}/returns`, {
      params: { page, pageSize },
    })
    .then((res) => res.data);
};

export const getSiteRequests = (
  siteId: number,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<any>> => {
  return apiClient
    .get(`/construction-sites/${siteId}/requests`, {
      params: { page, pageSize },
    })
    .then((res) => res.data);
};
