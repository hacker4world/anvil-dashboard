import { apiClient } from "./axios.client";
import {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  ListAccountDto,
  SuccessResponse,
  PaginatedAccounts,
  AccountStats,
  LoginDto,
  LoginResponseData,
} from "../models/Account.model";

const BASE_URL = "/accounts";

export const createAccount = async (
  dto: CreateAccountDto,
): Promise<SuccessResponse<Account>> => {
  const { data } = await apiClient.post<SuccessResponse<Account>>(
    BASE_URL,
    dto,
  );
  return data;
};

export const listAccounts = async (
  dto: ListAccountDto = {},
): Promise<SuccessResponse<PaginatedAccounts>> => {
  const { data } = await apiClient.post<SuccessResponse<PaginatedAccounts>>(
    `${BASE_URL}/list`,
    dto,
  );
  return data;
};

export const acceptAccount = async (
  id: number,
): Promise<SuccessResponse<Account>> => {
  const { data } = await apiClient.patch<SuccessResponse<Account>>(
    `${BASE_URL}/${id}/accept`,
  );
  return data;
};

export const updateAccount = async (
  id: number,
  dto: UpdateAccountDto,
): Promise<SuccessResponse<Account>> => {
  const { data } = await apiClient.patch<SuccessResponse<Account>>(
    `${BASE_URL}/${id}`,
    dto,
  );
  return data;
};

export const deleteAccount = async (
  id: number,
): Promise<SuccessResponse<null>> => {
  const { data } = await apiClient.delete<SuccessResponse<null>>(
    `${BASE_URL}/${id}`,
  );
  return data;
};

export const getAccountStats = async (): Promise<
  SuccessResponse<AccountStats>
> => {
  const { data } = await apiClient.get<SuccessResponse<AccountStats>>(
    `${BASE_URL}/stats`,
  );
  return data;
};

export const login = async (
  dto: LoginDto,
): Promise<SuccessResponse<LoginResponseData>> => {
  const { data } = await apiClient.post<SuccessResponse<LoginResponseData>>(
    `${BASE_URL}/login`,
    dto,
  );
  return data;
};