import {
  CreateSubfamilyDto,
  ListSubfamilyRequest,
  Subfamily,
  UpdateSubfamilyDto,
} from "@/models/Subfamily.model";
import { ApiResponse, PaginatedData } from "@/models/global.model";
import { apiClient } from "./axios.client";

export async function createSubfamily(
  data: CreateSubfamilyDto,
): Promise<ApiResponse<Subfamily>> {
  const response = await apiClient.post<ApiResponse<Subfamily>>(
    "/classification/subfamilies",
    data,
  );
  return response.data;
}

/** Get all subfamilies */
export async function getAllSubfamilies(): Promise<ApiResponse<Subfamily[]>> {
  const response = await apiClient.get<ApiResponse<Subfamily[]>>(
    "/classification/subfamilies",
  );
  return response.data;
}

/** Get paginated and filtered subfamilies */
export async function getFilteredSubfamilies(
  params?: ListSubfamilyRequest,
): Promise<ApiResponse<PaginatedData<Subfamily>>> {
  const response = await apiClient.post<ApiResponse<PaginatedData<Subfamily>>>(
    "/classification/subfamilies/list",
    params ?? {},
  );
  return response.data;
}

/** Get a single subfamily by ID */
export async function getSubfamilyById(
  id: number,
): Promise<ApiResponse<Subfamily>> {
  const response = await apiClient.get<ApiResponse<Subfamily>>(
    `/classification/subfamilies/${id}`,
  );
  return response.data;
}

/** Update an existing subfamily */
export async function updateSubfamily(
  id: number,
  data: UpdateSubfamilyDto,
): Promise<ApiResponse<Subfamily>> {
  const response = await apiClient.patch<ApiResponse<Subfamily>>(
    `/classification/subfamilies/${id}`,
    data,
  );
  return response.data;
}

/** Delete a subfamily */
export async function deleteSubfamily(id: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/classification/subfamilies/${id}`,
  );
  return response.data;
}
