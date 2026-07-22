import {
  CreateImportDto,
  UpdateImportDto,
  ListImportDto,
  SuccessResponse,
  ImportResponse,
  PaginatedImportsResponse,
} from "@/models/import-export.dtos";
import { apiClient } from "./axios.client";

const BASE_URL = "/imports";

function buildImportFormData(
  dto: CreateImportDto | UpdateImportDto,
  files?: { bonDeCommande?: File; bonDeLivraison?: File },
): FormData {
  const formData = new FormData();

  // Append scalar fields
  if (dto.date !== undefined) formData.append("date", dto.date);
  if (dto.observation !== undefined)
    formData.append("observation", dto.observation);
  if ("supplierId" in dto && dto.supplierId !== undefined) {
    formData.append("supplierId", String(dto.supplierId));
  }
  if ("manufacturerId" in dto && dto.manufacturerId !== undefined) {
    formData.append("manufacturerId", String(dto.manufacturerId));
  }

  if ("accountId" in dto && dto.accountId !== undefined) {
    formData.append("accountId", String(dto.accountId));
  }

  // Append importItems as a JSON string (backend will parse it)
  if (dto.importItems !== undefined) {
    formData.append("importItems", JSON.stringify(dto.importItems));
  }

  // Append files under the 'files' field name (as expected by FilesInterceptor)
  if (files?.bonDeCommande) {
    formData.append("files", files.bonDeCommande);
  }
  if (files?.bonDeLivraison) {
    formData.append("files", files.bonDeLivraison);
  }

  return formData;
}

export async function createImport(
  data: CreateImportDto,
  files?: { bonDeCommande?: File; bonDeLivraison?: File },
): Promise<SuccessResponse<ImportResponse>> {
  console.log(data);

  const formData = buildImportFormData(data, files);
  const response = await apiClient.post<SuccessResponse<ImportResponse>>(
    BASE_URL,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function findAllImports(): Promise<
  SuccessResponse<ImportResponse[]>
> {
  const response =
    await apiClient.get<SuccessResponse<ImportResponse[]>>(BASE_URL);
  return response.data;
}

export async function findFilteredImports(
  listDto: ListImportDto,
): Promise<SuccessResponse<PaginatedImportsResponse>> {
  const response = await apiClient.post<
    SuccessResponse<PaginatedImportsResponse>
  >(`${BASE_URL}/list`, listDto);
  return response.data;
}

export async function findImportById(
  id: number,
): Promise<SuccessResponse<ImportResponse>> {
  const response = await apiClient.get<SuccessResponse<ImportResponse>>(
    `${BASE_URL}/${id}`,
  );
  return response.data;
}

export async function updateImport(
  id: number,
  data: UpdateImportDto,
  files?: { bonDeCommande?: File; bonDeLivraison?: File },
): Promise<SuccessResponse<ImportResponse>> {
  const formData = buildImportFormData(data, files);
  const response = await apiClient.patch<SuccessResponse<ImportResponse>>(
    `${BASE_URL}/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function confirmImport(
  id: number,
): Promise<SuccessResponse<ImportResponse>> {
  const response = await apiClient.patch<SuccessResponse<ImportResponse>>(
    `${BASE_URL}/${id}/confirm`,
  );
  return response.data;
}

export async function deleteImport(id: number): Promise<SuccessResponse<null>> {
  const response = await apiClient.delete<SuccessResponse<null>>(
    `${BASE_URL}/${id}`,
  );
  return response.data;
}
