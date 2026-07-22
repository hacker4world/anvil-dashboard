export enum AccountRole {
  ADMIN = "admin",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  CONSTRUCTION_SITE_MANAGER = "construction_site_manager",
  PRODUCT_KEEPER = "product_keeper",
}

export interface Account {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  role: AccountRole;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export interface UpdateAccountDto {
  firstname?: string;
  lastname?: string;
  username?: string;
  role?: AccountRole;
}

export interface AccountFilters {
  role?: AccountRole;
  username?: string;
  firstname?: string;
  lastname?: string;
}

export interface ListAccountDto {
  page?: number;
  pageSize?: number;
  filters?: AccountFilters;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedAccounts {
  items: Account[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AccountFilters {
  role?: AccountRole;
  username?: string;
  firstname?: string;
  lastname?: string;
  confirmed?: boolean;
}

export interface AccountStats {
  admins: number;
  constructionSiteManagers: number;
  productKeepers: number;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseData {
  account: Account;
  token: string;
}

export const roleLabels: Record<AccountRole, string> = {
  [AccountRole.ADMIN]: "Administrateur",
  [AccountRole.ADMIN1]: "Administrateur 1",
  [AccountRole.ADMIN2]: "Administrateur 2",
  [AccountRole.PRODUCT_KEEPER]: "Magazinier",
  [AccountRole.CONSTRUCTION_SITE_MANAGER]: "Responsable Chantier",
};