// frontend/src/services/supplier.service.ts
import { apiClient } from "./axios.client";
import type {
  SupplierModel,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  ListSupplierRequest,
} from "../models/Supplier.model";
import { ApiResponse, PaginatedData } from "@/models/global.model";

/** Create a new supplier */
export async function createSupplier(
  data: CreateSupplierRequest,
): Promise<ApiResponse<SupplierModel>> {
  const response = await apiClient.post<ApiResponse<SupplierModel>>(
    "/suppliers",
    data,
  );
  return response.data;
}

/** Get all suppliers */
export async function getAllSuppliers(): Promise<ApiResponse<SupplierModel[]>> {
  const response =
    await apiClient.get<ApiResponse<SupplierModel[]>>("/suppliers");
  return response.data;
}

/** Get paginated and filtered suppliers (POST /suppliers/list) */
export async function getFilteredSuppliers(
  params?: ListSupplierRequest,
): Promise<ApiResponse<PaginatedData<SupplierModel>>> {
  const response = await apiClient.post<
    ApiResponse<PaginatedData<SupplierModel>>
  >("/suppliers/list", params ?? {});
  return response.data;
}

/** Get a single supplier by ID */
export async function getSupplierById(
  id: number,
): Promise<ApiResponse<SupplierModel>> {
  const response = await apiClient.get<ApiResponse<SupplierModel>>(
    `/suppliers/${id}`,
  );
  return response.data;
}

/** Update an existing supplier */
export async function updateSupplier(
  id: number,
  data: UpdateSupplierRequest,
): Promise<ApiResponse<SupplierModel>> {
  const response = await apiClient.patch<ApiResponse<SupplierModel>>(
    `/suppliers/${id}`,
    data,
  );
  return response.data;
}

/** Delete a supplier */
export async function deleteSupplier(id: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/suppliers/${id}`,
  );
  return response.data;
}
