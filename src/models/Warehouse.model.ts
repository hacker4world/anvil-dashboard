export interface WarehouseModel {
  id: number;
  name: string;
}

export interface CreateWarehouseRequest {
  name: string;
  address?: string;
}

export interface UpdateWarehouseRequest {
  name?: string;
  address?: string;
}

export interface WarehouseResponse {
  id: number;
  name: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}