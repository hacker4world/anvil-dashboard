import { Account, AccountFilters } from "@/models/Account.model";
import { ListAccountDto } from "@/models/Account.model";
import { listAccounts } from "@/services/account.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface PendingAccountState {
  // Data
  accounts: Account[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAccounts: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchAccounts: () => Promise<void>;
  clearSearch: () => Promise<void>;
  removeAccount: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  accounts: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
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
 * Builds the filters object. Always includes confirmed: false for pending accounts.
 */
function buildFilters(searchQuery: string): AccountFilters {
  const filters: AccountFilters = {
    confirmed: false,
  };
  if (searchQuery.trim()) {
    filters.lastname = searchQuery.trim();
  }
  return filters;
}

export const usePendingAccountStore = create<PendingAccountState>()(
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
        filters: buildFilters(state.searchQuery),
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
          "Erreur lors du chargement des comptes en attente",
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
        filters: buildFilters(state.searchQuery),
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
        isFiltered: false,
        accounts: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const params: ListAccountDto = {
        page: 1,
        pageSize: get().pageSize,
        filters: buildFilters(""),
      };

      try {
        const response = await listAccounts(params);
        const { items, total, page, pageSize } = response.data;
        const state = get();
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
      set((prev) => ({
        accounts: prev.accounts.filter((a) => a.id !== id),
        total: prev.total - 1,
      }));
    },

    reset: () => {
      set({ ...initialState });
    },

    clearError: () => {
      set({ error: null });
    },
  }),
);
