import { ArrowUpRight, HardHat, LucideIcon, Warehouse } from "lucide-react";
import { Account } from "./Account.model";
import { ConstructionSite } from "./ConstructionSite.model";
import { Product } from "./Product.model";
import { WarehouseModel } from "./Warehouse.model";

export enum ExportType {
  TO_WAREHOUSE = "to-warehouse",
  TO_CONSTRUCTION_SITE = "to-construction-site",
  EXTERNAL = "external",
}

export interface CreateExportItemDto {
  productId: number;
  exitedStock: number;
  unitPrice: number;
}

export interface CreateExportDto {
  date: string;
  observation?: string;
  exportType: ExportType;
  warehouseId?: number;
  constructionSiteId?: number;
  entrepriseName?: string;
  address?: string;
  matriculeFiscale?: string;
  clientName?: string;
  withTransporter?: boolean;
  transporterName?: string;
  transporterMatricule?: string;
  exportItems?: CreateExportItemDto[];
  accountId: number;
}

export interface UpdateExportItemDto {
  id?: number;
  productId: number;
  exitedStock: number;
  unitPrice: number;
}

export interface UpdateExportDto {
  date?: string;
  observation?: string;
  exportType?: ExportType;
  warehouseId?: number;
  constructionSiteId?: number;
  entrepriseName?: string;
  address?: string;
  matriculeFiscale?: string;
  clientName?: string;
  withTransporter?: boolean;
  transporterName?: string;
  transporterMatricule?: string;
  exportItems?: UpdateExportItemDto[];
}

export interface ExportFilters {
  observation?: string;
  exportType?: ExportType;
  warehouseId?: number;
  constructionSiteId?: number;
  confirmed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  productId?: number;
}

export interface ListExportDto {
  page?: number;
  pageSize?: number;
  filters?: ExportFilters;
  accountId?: number;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface ExportItem {
  id: number;
  exitedStock: number;
  unitPrice: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface ExportEntity {
  id: number;
  date: string;
  observation: string | null;
  confirmed: boolean;
  exportType: ExportType;
  warehouse: WarehouseModel;
  constructionSite: ConstructionSite;
  entrepriseName: string | null;
  address: string | null;
  matriculeFiscale: string | null;
  clientName: string | null;
  withTransporter: boolean;
  transporterName: string | null;
  transporterMatricule: string | null;
  exportItems: ExportItem[];
  account: Account;
  createdAt: string;
  updatedAt: string;
  ficheExpedition: string;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedExports {
  items: ExportEntity[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
}

/** French labels for each export type */
export const EXPORT_TYPE_LABELS: Record<ExportType, string> = {
  [ExportType.TO_WAREHOUSE]: "Vers un dépôt",
  [ExportType.TO_CONSTRUCTION_SITE]: "Vers un chantier",
  [ExportType.EXTERNAL]: "Externe",
};

/** Tailwind badge color classes for each export type */
export const EXPORT_TYPE_BADGE_CLASSES: Record<ExportType, string> = {
  [ExportType.TO_WAREHOUSE]:
    "bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 text-sm gap-1.5",
  [ExportType.TO_CONSTRUCTION_SITE]:
    "bg-amber-50 text-amber-700 border-amber-200 px-3 py-1.5 text-sm gap-1.5",
  [ExportType.EXTERNAL]:
    "bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5 text-sm gap-1.5",
};

/** Icon component for each export type */
export const EXPORT_TYPE_ICONS: Record<ExportType, LucideIcon> = {
  [ExportType.TO_WAREHOUSE]: Warehouse,
  [ExportType.TO_CONSTRUCTION_SITE]: HardHat,
  [ExportType.EXTERNAL]: ArrowUpRight,
};

export interface ExportFilters {
  observation?: string;
  exportType?: ExportType;
  warehouseId?: number;
  constructionSiteId?: number;
  confirmed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  productId?: number;
  accountId?: number; // ← NEW
}