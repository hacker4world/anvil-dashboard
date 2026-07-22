import { apiClient } from "./axios.client";

export async function fetchGlobalCalendarMonth(params: {
  month: number;
  year: number;
  productId?: number;
  constructionSiteId?: number;
}) {
  const { data } = await apiClient.post("/calendar/month", {
    month: params.month,
    year: params.year,
  });
  return data;
}

export async function fetchProductCalendarMonth(params: {
  month: number;
  year: number;
  productId: number;
}) {
  const { data } = await apiClient.post("/calendar/product", {
    month: params.month,
    year: params.year,
    productId: params.productId,
  });
  return data;
}

export async function fetchSiteCalendarMonth(params: {
  month: number;
  year: number;
  constructionSiteId: number;
}) {
  const { data } = await apiClient.get("/calendar/construction-site", {
    params,
  });
  return data;
}

export interface SiteCalendarParams {
  month: number; // 1-12
  year: number;
  constructionSiteId: number;
}

// The raw API response shape
export interface SiteCalendarResponse {
  success: boolean;
  message: string;
  data: {
    exports: any[];
    requests: any[];
    returns: any[];
  };
}

export const fetchSiteCalendar = (
  params: SiteCalendarParams,
): Promise<SiteCalendarResponse> => {
  return apiClient.post("/calendar/site", params).then((res) => res.data);
};