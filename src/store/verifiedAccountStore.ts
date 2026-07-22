import {
  Account,
  AccountFilters,
  AccountRole,
  AccountStats,
  ListAccountDto,
} from "@/models/Account.model";
import { listAccounts, getAccountStats } from "@/services/account.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface VerifiedAccountState {
  // Data
  accounts: Account[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Stats
  stats: AccountStats | null;
  statsLoading: boolean;

  // Search & filters
  searchQuery: string;
  firstnameFilter: string;
  lastnameFilter: string;
  usernameFilter: string;
  roleFilter: AccountRole | "";
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAccounts: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  fetchStats: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchAccounts: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setFirstnameFilter: (value: string) => void;
  setLastnameFilter: (value: string) => void;
  setUsernameFilter: (value: string) => void;
  setRoleFilter: (value: AccountRole | "") => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  removeAccount: (id: number) => void;
  updateAccount: (id: number, updatedAccount: Account) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  accounts: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  stats: null as AccountStats | null,
  statsLoading: false,
  searchQuery: "",
  firstnameFilter: "",
  lastnameFilter: "",
  usernameFilter: "",
  roleFilter: "" as AccountRole | "",
  isFiltered: false,
  isLoading: false,
  error: null,
};

/**
 * Extracts a user-friendly error message from an unknown error.
 */
function extractErrorMessage(err: unknown, defaultMessage: string): string {
  if (isAxiosError(err)) {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (!err.response) {
      return "Une erreur est survenue lors de la connexion au serveur. Veuillez rafraîchir la page et réessayer.";
    }
  }
  return err instanceof Error ? err.message : defaultMessage;
}

/**
 * Builds the filters object. Always includes confirmed: true for verified accounts.
 * Combines the search query with the dedicated filter fields.
 */
function buildFilters(
  searchQuery: string,
  firstnameFilter: string,
  lastnameFilter: string,
  usernameFilter: string,
  roleFilter: AccountRole | "",
): AccountFilters {
  const filters: AccountFilters = {
    confirmed: true,
  };
  if (searchQuery.trim()) {
    filters.lastname = searchQuery.trim();
  }
  if (firstnameFilter.trim()) {
    filters.firstname = firstnameFilter.trim();
  }
  if (lastnameFilter.trim()) {
    filters.lastname = lastnameFilter.trim();
  }
  if (usernameFilter.trim()) {
    filters.username = usernameFilter.trim();
  }
  if (roleFilter) {
    filters.role = roleFilter;
  }
  return filters;
}

function isAdminRole(role: AccountRole): boolean {
  return (
    role === AccountRole.ADMIN ||
    role === AccountRole.ADMIN1 ||
    role === AccountRole.ADMIN2
  );
}

function decrementStatsByRole(
  stats: AccountStats,
  role: AccountRole,
): AccountStats {
  if (isAdminRole(role)) {
    return { ...stats, admins: Math.max(0, stats.admins - 1) };
  }
  if (role === AccountRole.PRODUCT_KEEPER) {
    return { ...stats, productKeepers: Math.max(0, stats.productKeepers - 1) };
  }
  if (role === AccountRole.CONSTRUCTION_SITE_MANAGER) {
    return {
      ...stats,
      constructionSiteManagers: Math.max(0, stats.constructionSiteManagers - 1),
    };
  }
  return stats;
}

function incrementStatsByRole(
  stats: AccountStats,
  role: AccountRole,
): AccountStats {
  if (isAdminRole(role)) {
    return { ...stats, admins: stats.admins + 1 };
  }
  if (role === AccountRole.PRODUCT_KEEPER) {
    return { ...stats, productKeepers: stats.productKeepers + 1 };
  }
  if (role === AccountRole.CONSTRUCTION_SITE_MANAGER) {
    return {
      ...stats,
      constructionSiteManagers: stats.constructionSiteManagers + 1,
    };
  }
  return stats;
}

export const useVerifiedAccountStore = create<VerifiedAccountState>()(
  (set, get) => ({
    ...initialState,

    fetchAccounts: async (reset = false) => {
      const state = get();
      const currentPage = reset ? 1 : state.page;

      set({ isLoading: true, error: null });

      if (reset) {
        set({ accounts: [], page: 1 });
      }

      const params: ListAccountDto = {
        page: currentPage,
        pageSize: state.pageSize,
        filters: buildFilters(
          state.searchQuery,
          state.firstnameFilter,
          state.lastnameFilter,
          state.usernameFilter,
          state.roleFilter,
        ),
      };

      try {
        const response = await listAccounts(params);
        const { items, total, page, pageSize } = response.data;

        set((prev) => ({
          accounts: reset ? items : [...prev.accounts, ...items],
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des comptes confirmés",
        );
        set({ error: message, isLoading: false });
      }
    },

    loadNextPage: async () => {
      const state = get();
      if (state.lastPage || state.isLoading) return;

      set({ page: state.page + 1 });
      await get().fetchAccounts(false);
    },

    fetchStats: async () => {
      set({ statsLoading: true });
      try {
        const response = await getAccountStats();
        set({ stats: response.data, statsLoading: false });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des statistiques",
        );
        set({ error: message, statsLoading: false });
      }
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    searchAccounts: async () => {
      set({
        accounts: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListAccountDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(
          state.searchQuery,
          state.firstnameFilter,
          state.lastnameFilter,
          state.usernameFilter,
          state.roleFilter,
        ),
      };

      try {
        const response = await listAccounts(params);
        const { items, total, page, pageSize } = response.data;

        set({
          accounts: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors de la recherche des comptes",
        );
        set({ error: message, isLoading: false });
      }
    },

    clearSearch: async () => {
      set({
        searchQuery: "",
        firstnameFilter: "",
        lastnameFilter: "",
        usernameFilter: "",
        roleFilter: "" as AccountRole | "",
        isFiltered: false,
        accounts: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const params: ListAccountDto = {
        page: 1,
        pageSize: get().pageSize,
        filters: { confirmed: true },
      };

      try {
        const response = await listAccounts(params);
        const { items, total, page, pageSize } = response.data;

        set({
          accounts: items,
          total,
          page,
          pageSize,
          lastPage: items.length < get().pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des comptes",
        );
        set({ error: message, isLoading: false });
      }
    },

    setFirstnameFilter: (value: string) => {
      set({ firstnameFilter: value });
    },

    setLastnameFilter: (value: string) => {
      set({ lastnameFilter: value });
    },

    setUsernameFilter: (value: string) => {
      set({ usernameFilter: value });
    },

    setRoleFilter: (value: AccountRole | "") => {
      set({ roleFilter: value });
    },

    applyFilters: async () => {
      set({
        accounts: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListAccountDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(
          state.searchQuery,
          state.firstnameFilter,
          state.lastnameFilter,
          state.usernameFilter,
          state.roleFilter,
        ),
      };

      try {
        const response = await listAccounts(params);
        const { items, total, page, pageSize } = response.data;

        set({
          accounts: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors de l'application des filtres",
        );
        set({ error: message, isLoading: false });
      }
    },

    clearFilters: async () => {
      set({
        firstnameFilter: "",
        lastnameFilter: "",
        usernameFilter: "",
        roleFilter: "" as AccountRole | "",
        isFiltered: get().searchQuery ? true : false,
        accounts: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListAccountDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, "", "", "", ""),
      };

      try {
        const response = await listAccounts(params);
        const { items, total, page, pageSize } = response.data;

        set({
          accounts: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des comptes",
        );
        set({ error: message, isLoading: false });
      }
    },

    removeAccount: (id: number) => {
      set((prev) => {
        const accountToRemove = prev.accounts.find((a) => a.id === id);
        if (!accountToRemove) {
          return {
            accounts: prev.accounts.filter((a) => a.id !== id),
            total: prev.total - 1,
          };
        }
        return {
          accounts: prev.accounts.filter((a) => a.id !== id),
          total: prev.total - 1,
          stats: prev.stats
            ? decrementStatsByRole(prev.stats, accountToRemove.role)
            : null,
        };
      });
    },

    updateAccount: (id: number, updatedAccount: Account) => {
      set((prev) => {
        const oldAccount = prev.accounts.find((a) => a.id === id);
        if (!oldAccount) {
          return {
            accounts: prev.accounts.map((a) =>
              a.id === id ? updatedAccount : a,
            ),
          };
        }

        let updatedStats = prev.stats;
        if (updatedStats && oldAccount.role !== updatedAccount.role) {
          updatedStats = decrementStatsByRole(updatedStats, oldAccount.role);
          updatedStats = incrementStatsByRole(
            updatedStats,
            updatedAccount.role,
          );
        }

        return {
          accounts: prev.accounts.map((a) =>
            a.id === id ? updatedAccount : a,
          ),
          stats: updatedStats,
        };
      });
    },

    reset: () => {
      set({ ...initialState });
    },

    clearError: () => {
      set({ error: null });
    },
  }),
);
