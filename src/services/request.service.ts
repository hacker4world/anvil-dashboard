import {
  ProductRequestEntity,
  ListProductRequestDto,
  PaginatedProductRequests,
} from "@/models/request.model";
import { apiClient } from "./axios.client";
import { SuccessResponse } from "@/models/Account.model";

const BASE_PATH = "/product-request";

// GET list with query params (matches your current backend controller)
export async function findFilteredRequests(
  dto: ListProductRequestDto,
): Promise<SuccessResponse<PaginatedProductRequests>> {
  const { data } = await apiClient.post<
    SuccessResponse<PaginatedProductRequests>
  >(
    `${BASE_PATH}/list`, // POST to /product-request/list
    dto, // body – automatically JSON serialised
  );
  return data;
}

export async function removeRequest(
  id: number,
): Promise<SuccessResponse<null>> {
  const { data } = await apiClient.delete<SuccessResponse<null>>(
    `${BASE_PATH}/${id}`,
  );
  return data;
}

// src/services/request.service.ts (add to existing file)
export async function confirmRequest(
  id: number,
): Promise<SuccessResponse<ProductRequestEntity>> {
  const { data } = await apiClient.patch<SuccessResponse<ProductRequestEntity>>(
    `${BASE_PATH}/${id}/confirm`,
  );
  return data;
}

// src/services/request.service.ts (add)
export async function turnRequestIntoExport(
  id: number,
  dto: {
    transporterName: string;
    transporterMatricule: string;
    accountId: number;
    observation?: string;
    unitPrices: { productId: number; unitPrice: number }[];
  },
): Promise<SuccessResponse<any>> {
  const { data } = await apiClient.post<SuccessResponse<any>>(
    `${BASE_PATH}/${id}/turn-into-export`,
    dto,
  );
  return data;
}