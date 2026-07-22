// src/store/confirmedReturnsStore.ts
import { create } from "zustand";
import {
  ReturnEntity,
  ReturnFilters,
  ListReturnDto,
} from "@/models/return.model";
import { findFilteredReturns } from "@/services/return.service";
import { isAxiosError } from "axios";

interface ConfirmedReturnState {
  returns: ReturnEntity[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
  searchQuery: string;
  filters: ReturnFilters | null;
  isFiltered: boolean;
  isLoading: boolean;
  error: string | null;

  fetchReturns: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchReturns: () => Promise<void>;
  clearSearch: () => Promise<void>;
  applyFilters: (filters: ReturnFilters) => Promise<void>;
  clearFilters: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  returns: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  filters: null,
  isFiltered: false,
  isLoading: false,
  error: null,
};

function extractErrorMessage(err: unknown, defaultMessage: string): string {
  if (isAxiosError(err)) {
    if (err.response?.data?.message) return err.response.data.message;
    if (!err.response) return "Erreur réseau.";
  }
  return err instanceof Error ? err.message : defaultMessage;
}

function buildFilters(
  searchQuery: string,
  advancedFilters: ReturnFilters | null,
): ReturnFilters {
  const filters: ReturnFilters = { confirmed: true }; // ← only confirmed
  if (searchQuery.trim()) {
    filters.observation = searchQuery.trim();
  }
  if (advancedFilters) {
    if (advancedFilters.constructionSiteId !== undefined)
      filters.constructionSiteId = advancedFilters.constructionSiteId;
    if (advancedFilters.dateFrom !== undefined)
      filters.dateFrom = advancedFilters.dateFrom;
    if (advancedFilters.dateTo !== undefined)
      filters.dateTo = advancedFilters.dateTo;
    if (advancedFilters.productId !== undefined)
      filters.productId = advancedFilters.productId;
    if (advancedFilters.accountId !== undefined)
      filters.accountId = advancedFilters.accountId;
  }
  return filters;
}

export const useConfirmedReturnStore = create<ConfirmedReturnState>()(
  (set, get) => ({
    ...initialState,

    fetchReturns: async (reset = false) => {
      const state = get();
      const currentPage = reset ? 1 : state.page;
      set({ isLoading: true, error: null });
      if (reset) set({ returns: [], page: 1 });

      const params: ListReturnDto = {
        page: currentPage,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, state.filters),
      };

      try {
        const response = await findFilteredReturns(params);
        const { items, total, page, pageSize } = response.data;
        set((prev) => ({
          returns: reset ? items : [...prev.returns, ...items],
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        }));
      } catch (err) {
        set({
          error: extractErrorMessage(err, "Erreur de chargement"),
          isLoading: false,
        });
      }
    },

    loadNextPage: async () => {
      const state = get();
      if (state.lastPage || state.isLoading) return;
      set({ page: state.page + 1 });
      await get().fetchReturns(false);
    },

    setSearchQuery: (query) => set({ searchQuery: query }),

    searchReturns: async () => {
      set({
        returns: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });
      const state = get();
      const params = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, state.filters),
      };
      try {
        const response = await findFilteredReturns(params);
        const { items, total, page, pageSize } = response.data;
        set({
          returns: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        set({
          error: extractErrorMessage(err, "Erreur de recherche"),
          isLoading: false,
        });
      }
    },

    clearSearch: async () => {
      set({
        searchQuery: "",
        isFiltered: get().filters !== null,
        returns: [],
        page: 1,
        error: null,
        isLoading: true,
      });
      const state = get();
      const params = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters("", state.filters),
      };
      try {
        const response = await findFilteredReturns(params);
        const { items, total, page, pageSize } = response.data;
        set({
          returns: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        set({
          error: extractErrorMessage(err, "Erreur de chargement"),
          isLoading: false,
        });
      }
    },

    applyFilters: async (filters) => {
      set({
        filters,
        returns: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });
      const state = get();
      const params = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, filters),
      };
      try {
        const response = await findFilteredReturns(params);
        const { items, total, page, pageSize } = response.data;
        set({
          returns: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        set({
          error: extractErrorMessage(err, "Erreur d'application des filtres"),
          isLoading: false,
        });
      }
    },

    clearFilters: async () => {
      set({
        filters: null,
        searchQuery: "",
        isFiltered: false,
        returns: [],
        page: 1,
        error: null,
        isLoading: true,
      });
      const params = {
        page: 1,
        pageSize: get().pageSize,
        filters: buildFilters("", null),
      };
      const state = get();
      try {
        const response = await findFilteredReturns(params);
        const { items, total, page, pageSize } = response.data;
        set({
          returns: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        set({
          error: extractErrorMessage(err, "Erreur de chargement"),
          isLoading: false,
        });
      }
    },

    reset: () => set({ ...initialState }),
    clearError: () => set({ error: null }),
  }),
);
