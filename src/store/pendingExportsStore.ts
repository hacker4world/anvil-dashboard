import {
  ExportEntity,
  ExportFilters,
  ListExportDto,
  PaginatedExports,
} from "@/models/export.model";
import { findFilteredExports } from "@/services/export.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface PendingExportState {
  // Data
  exports: ExportEntity[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  filters: ExportFilters | null;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchExports: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchExports: () => Promise<void>;
  clearSearch: () => Promise<void>;
  removeExport: (id: number) => void;
  reset: () => void;
  clearError: () => void;
  addExport: (exportItem: ExportEntity) => void;

  // Advanced filters
  applyFilters: (filters: ExportFilters) => Promise<void>;
  clearFilters: () => Promise<void>;
}

const initialState = {
  exports: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  filters: null as ExportFilters | null,
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
 * Builds the full filters object by merging the search query and
 * the currently applied advanced filters. Always includes confirmed: false
 * for pending exports.
 */
function buildFilters(
  searchQuery: string,
  advancedFilters: ExportFilters | null,
): ExportFilters {
  const filters: ExportFilters = {
    confirmed: false,
  };

  if (searchQuery.trim()) {
    filters.observation = searchQuery.trim();
  }

  if (advancedFilters) {
    if (advancedFilters.exportType !== undefined)
      filters.exportType = advancedFilters.exportType;
    if (advancedFilters.warehouseId !== undefined)
      filters.warehouseId = advancedFilters.warehouseId;
    if (advancedFilters.constructionSiteId !== undefined)
      filters.constructionSiteId = advancedFilters.constructionSiteId;
    if (advancedFilters.dateFrom !== undefined)
      filters.dateFrom = advancedFilters.dateFrom;
    if (advancedFilters.dateTo !== undefined)
      filters.dateTo = advancedFilters.dateTo;
    if (advancedFilters.productId !== undefined)
      filters.productId = advancedFilters.productId;
    if (advancedFilters.accountId !== undefined)
      // ← NEW
      filters.accountId = advancedFilters.accountId; // ← NEW
  }

  return filters;
}

export const usePendingExportStore = create<PendingExportState>()(
  (set, get) => ({
    ...initialState,

    fetchExports: async (reset = false) => {
      const state = get();
      const currentPage = reset ? 1 : state.page;

      set({ isLoading: true, error: null });

      if (reset) {
        set({ exports: [], page: 1 });
      }

      const params: ListExportDto = {
        page: currentPage,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, state.filters),
      };

      try {
        const response = await findFilteredExports(params);
        const { items, total, page, pageSize } = response.data;

        set((prev) => ({
          exports: reset ? items : [...prev.exports, ...items],
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des sorties en attente",
        );
        set({ error: message, isLoading: false });
      }
    },

    loadNextPage: async () => {
      const state = get();
      if (state.lastPage || state.isLoading) return;

      set({ page: state.page + 1 });
      await get().fetchExports(false);
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    searchExports: async () => {
      set({
        exports: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListExportDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, state.filters),
      };

      try {
        const response = await findFilteredExports(params);
        const { items, total, page, pageSize } = response.data;

        set({
          exports: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors de la recherche des sorties",
        );
        set({ error: message, isLoading: false });
      }
    },

    clearSearch: async () => {
      set({
        searchQuery: "",
        isFiltered: get().filters !== null,
        exports: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListExportDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters("", state.filters),
      };

      try {
        const response = await findFilteredExports(params);
        const { items, total, page, pageSize } = response.data;

        set({
          exports: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des sorties",
        );
        set({ error: message, isLoading: false });
      }
    },

    removeExport: (id: number) => {
      set((prev) => ({
        exports: prev.exports.filter((exp) => exp.id !== id),
        total: prev.total - 1,
      }));
    },

    reset: () => {
      set({ ...initialState });
    },

    clearError: () => {
      set({ error: null });
    },

    addExport: (exportItem: ExportEntity) => {
      set((prev) => ({
        exports: [exportItem, ...prev.exports],
        total: prev.total + 1,
      }));
    },

    // ── Advanced filters ─────────────────────────

    applyFilters: async (filters: ExportFilters) => {
      set({
        filters,
        exports: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListExportDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, filters),
      };

      try {
        const response = await findFilteredExports(params);
        const { items, total, page, pageSize } = response.data;

        set({
          exports: items,
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
        filters: null,
        searchQuery: "",
        isFiltered: false,
        exports: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListExportDto = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters("", null),
      };

      try {
        const response = await findFilteredExports(params);
        const { items, total, page, pageSize } = response.data;

        set({
          exports: items,
          total,
          page,
          pageSize,
          lastPage: items.length < state.pageSize,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des sorties",
        );
        set({ error: message, isLoading: false });
      }
    },
  }),
);
