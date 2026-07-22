import { ApiResponse, PaginatedData } from "@/models/global.model";
import { apiClient } from "./axios.client";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ListProductRequest,
} from "@/models/Product.model.ts";

const BASE_PATH = "/products";

export const productClient = {
  /** POST /products — Create a new product */
  create(data: CreateProductRequest) {
    console.log(data);

    return apiClient.post<ApiResponse<Product>>(BASE_PATH, data);
  },

  /** GET /products — Retrieve all products */
  getAll(): Promise<ApiResponse<Product[]>> {
    return apiClient.get(BASE_PATH);
  },

  /** POST /products/list — Paginated, filtered product listing */
  getFiltered(data: ListProductRequest) {
    console.log(data);

    return apiClient.post<ApiResponse<PaginatedData<Product>>>(
      `${BASE_PATH}/list`,
      data,
    );
  },

  /** GET /products/:id — Retrieve a single product by ID */
  getById(id: number): Promise<ApiResponse<Product>> {
    return apiClient.get(`${BASE_PATH}/${id}`);
  },

  /** PATCH /products/:id — Update a product */
  update(id: number, data: UpdateProductRequest) {
    return apiClient.patch<ApiResponse<Product>>(`${BASE_PATH}/${id}`, data);
  },

  /** DELETE /products/:id — Delete a product */
  delete(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete(`${BASE_PATH}/${id}`);
  },
};
