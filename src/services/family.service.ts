import {
  CreateFamilyDto,
  Family,
  ListFamilyRequest,
  UpdateFamilyDto,
} from "@/models/family.model";
import { ApiResponse, PaginatedData } from "@/models/global.model";
import { apiClient } from "./axios.client";

export async function createFamily(
  data: CreateFamilyDto,
): Promise<ApiResponse<Family>> {
  const response = await apiClient.post<ApiResponse<Family>>(
    "/classification/families",
    data,
  );
  return response.data;
}

/** Get all families */
export async function getAllFamilies(): Promise<ApiResponse<Family[]>> {
  const response = await apiClient.get<ApiResponse<Family[]>>(
    "/classification/families",
  );
  return response.data;
}

/** Get paginated and filtered families */
export async function getFilteredFamilies(
  params?: ListFamilyRequest,
): Promise<ApiResponse<PaginatedData<Family>>> {
  const response = await apiClient.post<ApiResponse<PaginatedData<Family>>>(
    "/classification/families/list",
    params ?? {},
  );
  return response.data;
}

/** Get a single family by ID */
export async function getFamilyById(id: number): Promise<ApiResponse<Family>> {
  const response = await apiClient.get<ApiResponse<Family>>(
    `/classification/families/${id}`,
  );
  return response.data;
}

/** Update an existing family */
export async function updateFamily(
  id: number,
  data: UpdateFamilyDto,
): Promise<ApiResponse<Family>> {
  const response = await apiClient.patch<ApiResponse<Family>>(
    `/classification/families/${id}`,
    data,
  );
  return response.data;
}

/** Delete a family */
export async function deleteFamily(id: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/classification/families/${id}`,
  );
  return response.data;
}
