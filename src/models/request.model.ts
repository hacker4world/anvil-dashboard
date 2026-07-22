// Same pattern as ExportEntity, ExportFilters, ListExportDto, PaginatedExports
export interface ProductRequestEntity {
  id: number;
  date: string;
  observation?: string;
  confirmed: boolean;
  constructionSite?: {
    id: number;
    name: string; // display name
  };
  account?: {
    id: number;
    firstname: string;
    lastname: string;
  };
  requestItems?: Array<{
    id: number;
    requestedStock: number;
    product: {
      id: number;
      name: string;
    };
  }>;
  ficheExpedition: string;
}

export interface ProductRequestFilters {
  observation?: string;
  confirmed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  constructionSiteId?: number;
  accountId?: number;
  productId?: number;
}

export interface ListProductRequestDto {
  page?: number;
  pageSize?: number;
  filters?: ProductRequestFilters;
}

export interface PaginatedProductRequests {
  items: ProductRequestEntity[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
}
