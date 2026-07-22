// ---------- Generic API response wrapper ----------
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// ---------- Paginated response shape ----------
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
}
