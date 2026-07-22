export interface ReturnEntity {
  id: number;
  date: string;
  observation?: string;
  confirmed: boolean;
  constructionSite?: {
    id: number;
    name: string;
  };
  account?: {
    id: number;
    firstname: string;
    lastname: string;
  };
  transporterName: string;
  transporterMatricule: string;
  bonRetour: string;
  returnItems?: ReturnItemEntity[];
}

export interface ReturnItemEntity {
  id: number;
  returnedStock: number;
  reason?: string;
  product: {
    id: number;
    name: string;
  };
}

export interface ReturnFilters {
  observation?: string;
  confirmed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  constructionSiteId?: number;
  accountId?: number;
  productId?: number;
}

export interface ListReturnDto {
  page?: number;
  pageSize?: number;
  filters?: ReturnFilters;
}

export interface PaginatedReturns {
  items: ReturnEntity[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
}
