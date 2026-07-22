import {
  Category,
  CreateCategoryDto,
  ListCategoryRequest,
  UpdateCategoryDto,
} from "@/models/Category.model";
import { ApiResponse, PaginatedData } from "@/models/global.model";
import { apiClient } from "./axios.client";

export async function createCategory(
  data: CreateCategoryDto,
): Promise<ApiResponse<Category>> {
  const response = await apiClient.post<ApiResponse<Category>>(
    "/classification/categories",
    data,
  );
  return response.data;
}

/** Get all categories */
export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
  const response = await apiClient.get<ApiResponse<Category[]>>(
    "/classification/categories",
  );
  return response.data;
}

/** Get paginated and filtered categories */
export async function getFilteredCategories(
  params?: ListCategoryRequest,
): Promise<ApiResponse<PaginatedData<Category>>> {
  const response = await apiClient.post<ApiResponse<PaginatedData<Category>>>(
    "/classification/categories/list",
    params ?? {},
  );
  return response.data;
}

/** Get a single category by ID */
export async function getCategoryById(
  id: number,
): Promise<ApiResponse<Category>> {
  const response = await apiClient.get<ApiResponse<Category>>(
    `/classification/categories/${id}`,
  );
  return response.data;
}

/** Update an existing category */
export async function updateCategory(
  id: number,
  data: UpdateCategoryDto,
): Promise<ApiResponse<Category>> {
  const response = await apiClient.patch<ApiResponse<Category>>(
    `/classification/categories/${id}`,
    data,
  );
  return response.data;
}

/** Delete a category */
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/classification/categories/${id}`,
  );
  return response.data;
}
