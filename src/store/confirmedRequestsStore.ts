// src/store/confirmedRequestsStore.ts
import { create } from "zustand";
import {
  ProductRequestEntity,
  ProductRequestFilters,
  ListProductRequestDto,
} from "@/models/request.model";
import { findFilteredRequests } from "@/services/request.service";
import { isAxiosError } from "axios";

interface ConfirmedRequestState {
  requests: ProductRequestEntity[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;
  searchQuery: string;
  filters: ProductRequestFilters | null;
  isFiltered: boolean;
  isLoading: boolean;
  error: string | null;

  fetchRequests: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchRequests: () => Promise<void>;
  clearSearch: () => Promise<void>;
  applyFilters: (filters: ProductRequestFilters) => Promise<void>;
  clearFilters: () => Promise<void>;
  removeRequest: (id: number) => void; // still needed if ever we want to remove from UI
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  requests: [],
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
    if (!err.response)
      return "Une erreur est survenue lors de la connexion au serveur.";
  }
  return err instanceof Error ? err.message : defaultMessage;
}

function buildFilters(
  searchQuery: string,
  advancedFilters: ProductRequestFilters | null,
): ProductRequestFilters {
  const filters: ProductRequestFilters = {
    confirmed: true, // ← ONLY DIFFERENCE
  };
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

export const useConfirmedRequestStore = create<ConfirmedRequestState>()(
  (set, get) => ({
    ...initialState,

    fetchRequests: async (reset = false) => {
      const state = get();
      const currentPage = reset ? 1 : state.page;
      set({ isLoading: true, error: null });
      if (reset) set({ requests: [], page: 1 });

      const params: ListProductRequestDto = {
        page: currentPage,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, state.filters),
      };
      try {
        const response = await findFilteredRequests(params);
        const { items, total, page, pageSize } = response.data;
        set((prev) => ({
          requests: reset ? items : [...prev.requests, ...items],
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        }));
      } catch (err) {
        const msg = extractErrorMessage(
          err,
          "Erreur lors du chargement des demandes confirmées",
        );
        set({ error: msg, isLoading: false });
      }
    },

    loadNextPage: async () => {
      const state = get();
      if (state.lastPage || state.isLoading) return;
      set({ page: state.page + 1 });
      await get().fetchRequests(false);
    },

    setSearchQuery: (query: string) => set({ searchQuery: query }),

    searchRequests: async () => {
      set({
        requests: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });
      const state = get();
      const params: ListProductRequestDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, state.filters),
      };
      try {
        const response = await findFilteredRequests(params);
        const { items, total, page, pageSize } = response.data;
        set({
          requests: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        const msg = extractErrorMessage(err, "Erreur lors de la recherche");
        set({ error: msg, isLoading: false });
      }
    },

    clearSearch: async () => {
      set({
        searchQuery: "",
        isFiltered: get().filters !== null,
        requests: [],
        page: 1,
        error: null,
        isLoading: true,
      });
      const state = get();
      const params: ListProductRequestDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters("", state.filters),
      };
      try {
        const response = await findFilteredRequests(params);
        const { items, total, page, pageSize } = response.data;
        set({
          requests: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        const msg = extractErrorMessage(err, "Erreur lors du chargement");
        set({ error: msg, isLoading: false });
      }
    },

    applyFilters: async (filters: ProductRequestFilters) => {
      set({
        filters,
        requests: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });
      const state = get();
      const params: ListProductRequestDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, filters),
      };
      try {
        const response = await findFilteredRequests(params);
        const { items, total, page, pageSize } = response.data;
        set({
          requests: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        const msg = extractErrorMessage(
          err,
          "Erreur lors de l'application des filtres",
        );
        set({ error: msg, isLoading: false });
      }
    },

    clearFilters: async () => {
      set({
        filters: null,
        searchQuery: "",
        isFiltered: false,
        requests: [],
        page: 1,
        error: null,
        isLoading: true,
      });
      const params: ListProductRequestDto = {
        page: 1,
        pageSize: get().pageSize,
        filters: buildFilters("", null),
      };
      const state = get();
      try {
        const response = await findFilteredRequests(params);
        const { items, total, page, pageSize } = response.data;
        set({
          requests: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err) {
        const msg = extractErrorMessage(err, "Erreur lors du chargement");
        set({ error: msg, isLoading: false });
      }
    },

    removeRequest: (id: number) => {
      set((prev) => ({
        requests: prev.requests.filter((r) => r.id !== id),
        total: prev.total - 1,
      }));
    },

    reset: () => set({ ...initialState }),
    clearError: () => set({ error: null }),
  }),
);
