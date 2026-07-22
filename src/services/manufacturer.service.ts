// frontend/src/services/manufacturer.service.ts
import { apiClient } from "./axios.client";
import type {
  CreateManufacturerRequest,
  UpdateManufacturerRequest,
  ListManufacturerRequest,
  ManufacturerModel,
} from "../models/Manufacturer.model";
import { ApiResponse, PaginatedData } from "@/models/global.model";

/** Create a new manufacturer */
export async function createManufacturer(
  data: CreateManufacturerRequest,
): Promise<ApiResponse<ManufacturerModel>> {
  const response = await apiClient.post<ApiResponse<ManufacturerModel>>(
    "/manufacturers",
    data,
  );
  return response.data;
}

/** Get all manufacturers */
export async function getAllManufacturers(): Promise<
  ApiResponse<ManufacturerModel[]>
> {
  const response =
    await apiClient.get<ApiResponse<ManufacturerModel[]>>("/manufacturers");
  return response.data;
}

/** Get paginated and filtered manufacturers (POST /manufacturers/list) */
export async function getFilteredManufacturers(
  params?: ListManufacturerRequest,
): Promise<ApiResponse<PaginatedData<ManufacturerModel>>> {
  const response = await apiClient.post<
    ApiResponse<PaginatedData<ManufacturerModel>>
  >("/manufacturers/list", params ?? {});
  return response.data;
}

/** Get a single manufacturer by ID */
export async function getManufacturerById(
  id: number,
): Promise<ApiResponse<ManufacturerModel>> {
  const response = await apiClient.get<ApiResponse<ManufacturerModel>>(
    `/manufacturers/${id}`,
  );
  return response.data;
}

/** Update an existing manufacturer */
export async function updateManufacturer(
  id: number,
  data: UpdateManufacturerRequest,
): Promise<ApiResponse<ManufacturerModel>> {
  const response = await apiClient.patch<ApiResponse<ManufacturerModel>>(
    `/manufacturers/${id}`,
    data,
  );
  return response.data;
}

/** Delete a manufacturer */
export async function deleteManufacturer(
  id: number,
): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/manufacturers/${id}`,
  );
  return response.data;
}
