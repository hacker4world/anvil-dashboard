import { ExportEntity } from "./export.model";
import { ImportResponse } from "./import-export.dtos";
import { ProductRequestEntity } from "./request.model";
import { ReturnEntity } from "./return.model";

export interface CalendarDto {
  month: number; // 1-12
  year: number; // 1900-2100
  productId?: number;
  constructionSiteId?: number;
}

// src/models/calendar.model.ts
export interface CustomEventData {
  id: number;
  name: string;
  description: string;
  date: string;
}

export interface CalendarMonthData {
  imports: ImportResponse[];
  exports: ExportEntity[];
  events: CustomEventData[];
  requests: ProductRequestEntity[];
  returns: ReturnEntity[];
}
