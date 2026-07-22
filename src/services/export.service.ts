import {
  CreateExportDto,
  ExportEntity,
  ListExportDto,
  PaginatedExports,
  SuccessResponse,
  UpdateExportDto,
} from "@/models/export.model";
import { apiClient } from "./axios.client";
import { ProductRequestEntity } from "@/models/request.model";

const BASE_PATH = "/exports";

export async function createExport(
  dto: CreateExportDto,
): Promise<SuccessResponse<ExportEntity>> {
  const { data } = await apiClient.post<SuccessResponse<ExportEntity>>(
    BASE_PATH,
    dto,
  );
  return data;
}

export async function findAllExports(): Promise<
  SuccessResponse<ExportEntity[]>
> {
  const { data } =
    await apiClient.get<SuccessResponse<ExportEntity[]>>(BASE_PATH);
  return data;
}

export async function findFilteredExports(
  dto: ListExportDto,
): Promise<SuccessResponse<PaginatedExports>> {
  const { data } = await apiClient.post<SuccessResponse<PaginatedExports>>(
    `${BASE_PATH}/list`,
    dto,
  );
  return data;
}

export async function findOneExport(
  id: number,
): Promise<SuccessResponse<ExportEntity>> {
  const { data } = await apiClient.get<SuccessResponse<ExportEntity>>(
    `${BASE_PATH}/${id}`,
  );
  return data;
}

export async function updateExport(
  id: number,
  dto: UpdateExportDto,
): Promise<SuccessResponse<ExportEntity>> {
  const { data } = await apiClient.patch<SuccessResponse<ExportEntity>>(
    `${BASE_PATH}/${id}`,
    dto,
  );
  return data;
}

export async function confirmExport(
  id: number,
): Promise<SuccessResponse<ExportEntity>> {
  const { data } = await apiClient.patch<SuccessResponse<ExportEntity>>(
    `${BASE_PATH}/${id}/confirm`,
  );
  return data;
}

export async function removeExport(id: number): Promise<SuccessResponse<null>> {
  const { data } = await apiClient.delete<SuccessResponse<null>>(
    `${BASE_PATH}/${id}`,
  );
  return data;
}