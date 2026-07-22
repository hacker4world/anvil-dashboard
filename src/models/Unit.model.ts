export interface UnitModel {
  id: number;
  name: string;
}

export interface CreateUnitRequest {
  name: string;
}

export interface UpdateUnitRequest {
  name?: string;
}

export interface UnitResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

