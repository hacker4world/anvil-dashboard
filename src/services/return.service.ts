import { SuccessResponse } from "@/models/Account.model";
import { apiClient } from "./axios.client";
import {
  ReturnEntity,
  ListReturnDto,
  PaginatedReturns,
} from "@/models/return.model";

const BASE_PATH = "/product-return";

export async function findFilteredReturns(
  dto: ListReturnDto,
): Promise<SuccessResponse<PaginatedReturns>> {
  const { data } = await apiClient.post<SuccessResponse<PaginatedReturns>>(
    `${BASE_PATH}/list`,
    dto,
  );
  return data;
}

export async function removeReturn(id: number): Promise<SuccessResponse<null>> {
  const { data } = await apiClient.delete<SuccessResponse<null>>(
    `${BASE_PATH}/${id}`,
  );
  return data;
}

// src/services/return.service.ts (add at the bottom)

export async function confirmReturn(
  id: number,
  dto: {
    items: { productId: number; restock: boolean }[];
    transporterName: string;
    transporterMatricule: string;
  },
): Promise<SuccessResponse<ReturnEntity>> {
  const { data } = await apiClient.patch<SuccessResponse<ReturnEntity>>(
    `${BASE_PATH}/${id}/confirm`,
    dto,
  );
  return data;
}
