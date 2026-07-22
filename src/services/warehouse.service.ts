import { ApiResponse } from "@/models/global.model";
import {
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  WarehouseResponse,
} from "@/models/Warehouse.model";
import { AxiosResponse } from "axios";
import { apiClient } from "./axios.client";

export async function createWarehouse(
  data: CreateWarehouseRequest,
): Promise<ApiResponse<WarehouseResponse>> {
  const response: AxiosResponse<ApiResponse<WarehouseResponse>> =
    await apiClient.post("/configuration/warehouses", data);
  return response.data;
}

/**
 * Retrieve all warehouses.
 */
export async function getAllWarehouses(): Promise<
  ApiResponse<WarehouseResponse[]>
> {
  const response: AxiosResponse<ApiResponse<WarehouseResponse[]>> =
    await apiClient.get("/configuration/warehouses");
  return response.data;
}

/**
 * Retrieve a single warehouse by its ID.
 */
export async function getWarehouseById(
  id: number,
): Promise<ApiResponse<WarehouseResponse>> {
  const response: AxiosResponse<ApiResponse<WarehouseResponse>> =
    await apiClient.get(`/configuration/warehouses/${id}`);
  return response.data;
}

/**
 * Update an existing warehouse.
 */
export async function updateWarehouse(
  id: number,
  data: UpdateWarehouseRequest,
): Promise<ApiResponse<WarehouseResponse>> {
  console.log(id);

  const response: AxiosResponse<ApiResponse<WarehouseResponse>> =
    await apiClient.patch(`/configuration/warehouses/${id}`, data);
  return response.data;
}

/**
 * Delete a warehouse by its ID.
 */
export async function deleteWarehouse(id: number): Promise<ApiResponse<null>> {
  const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(
    `/configuration/warehouses/${id}`,
  );
  return response.data;
}
