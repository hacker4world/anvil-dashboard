import { ApiResponse } from "@/models/global.model";
import {
  CreateUnitRequest,
  UnitResponse,
  UpdateUnitRequest,
} from "@/models/Unit.model";
import { AxiosResponse } from "axios";
import { apiClient } from "./axios.client";

export async function createUnit(
  data: CreateUnitRequest,
): Promise<ApiResponse<UnitResponse>> {
  const response: AxiosResponse<ApiResponse<UnitResponse>> =
    await apiClient.post("/configuration/units", data);
  return response.data;
}

/**
 * Retrieve all units.
 */
export async function getAllUnits(): Promise<ApiResponse<UnitResponse[]>> {
  const response: AxiosResponse<ApiResponse<UnitResponse[]>> =
    await apiClient.get("/configuration/units");
  return response.data;
}

/**
 * Retrieve a single unit by its ID.
 */
export async function getUnitById(
  id: number,
): Promise<ApiResponse<UnitResponse>> {
  const response: AxiosResponse<ApiResponse<UnitResponse>> =
    await apiClient.get(`/configuration/units/${id}`);
  return response.data;
}

/**
 * Update an existing unit.
 */
export async function updateUnit(
  id: number,
  data: UpdateUnitRequest,
): Promise<ApiResponse<UnitResponse>> {
  const response: AxiosResponse<ApiResponse<UnitResponse>> =
    await apiClient.patch(`/configuration/units/${id}`, data);
  return response.data;
}

/**
 * Delete a unit by its ID.
 */
export async function deleteUnit(id: number): Promise<ApiResponse<null>> {
  const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(
    `/configuration/units/${id}`,
  );
  return response.data;
}
