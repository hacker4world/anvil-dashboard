import {
  ImportFilters,
  ImportResponse,
  ListImportDto,
} from "@/models/import-export.dtos";
import { findFilteredImports } from "@/services/import-export.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface ConfirmedImportState {
  // Data
  imports: ImportResponse[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  filters: ImportFilters | null;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchImports: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchImports: () => Promise<void>;
  clearSearch: () => Promise<void>;
  removeImport: (id: number) => void;
  reset: () => void;
  clearError: () => void;

  addImport: (importItem: ImportResponse) => void;

  // Advanced filters
  applyFilters: (filters: ImportFilters) => Promise<void>;
  clearFilters: () => Promise<void>;
}

const initialState = {
  imports: [] as ImportResponse[],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  filters: null as ImportFilters | null,
  isFiltered: false,
  isLoading: false,
  error: null as string | null,
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
 * Builds the filters object with confirmed: true, optional observation search,
 * and optional advanced filters.
 */
function buildFilters(
  searchQuery: string,
  advancedFilters: ImportFilters | null,
): ImportFilters {
  const filters: ImportFilters = {
    confirmed: true,
  };

  // Search query → observation filter
  if (searchQuery.trim()) {
    filters.observation = searchQuery.trim();
  }

  // Merge advanced filters if present
  if (advancedFilters) {
    if (advancedFilters.supplierId !== undefined)
      filters.supplierId = advancedFilters.supplierId;
    if (advancedFilters.manufacturerId !== undefined)
      filters.manufacturerId = advancedFilters.manufacturerId;
    if (advancedFilters.dateFrom !== undefined)
      filters.dateFrom = advancedFilters.dateFrom;
    if (advancedFilters.dateTo !== undefined)
      filters.dateTo = advancedFilters.dateTo;
    if (advancedFilters.productId !== undefined)
      filters.productId = advancedFilters.productId;
    if (advancedFilters.unitPriceFrom !== undefined)
      filters.unitPriceFrom = advancedFilters.unitPriceFrom;
    if (advancedFilters.unitPriceTo !== undefined)
      filters.unitPriceTo = advancedFilters.unitPriceTo;
    if (advancedFilters.enteredStockFrom !== undefined)
      filters.enteredStockFrom = advancedFilters.enteredStockFrom;
    if (advancedFilters.enteredStockTo !== undefined)
      filters.enteredStockTo = advancedFilters.enteredStockTo;
    if (advancedFilters.accountId !== undefined)
      filters.accountId = advancedFilters.accountId;
  }

  return filters;
}

export const useConfirmedImportStore = create<ConfirmedImportState>()((set, get) => ({
  ...initialState,

  addImport: (importItem: ImportResponse) => {
    set((prev) => ({
      imports: [importItem, ...prev.imports],
      total: prev.total + 1,
    }));
  },

  fetchImports: async (reset = false) => {
    const state = get();
    const currentPage = reset ? 1 : state.page;

    set({ isLoading: true, error: null });

    if (reset) {
      set({ imports: [], page: 1 });
    }

    const params: ListImportDto = {
      page: currentPage,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.filters),
    };

    try {
      const response = await findFilteredImports(params);
      const { items, total, page, pageSize } = response.data;

      set((prev) => ({
        imports: reset ? items : [...prev.imports, ...items],
        total,
        page,
        pageSize,
        lastPage: items.length < state.pageSize,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des entrées confirmées",
      );
      set({ error: message, isLoading: false });
    }
  },

  loadNextPage: async () => {
    const state = get();
    if (state.lastPage || state.isLoading) return;

    set({ page: state.page + 1 });
    await get().fetchImports(false);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchImports: async () => {
    set({
      imports: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListImportDto = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.filters),
    };

    try {
      const response = await findFilteredImports(params);
      const { items, total, page, pageSize } = response.data;

      set({
        imports: items,
        total,
        page,
        pageSize,
        lastPage: items.length < state.pageSize,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des entrées",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      isFiltered: get().filters !== null,
      imports: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListImportDto = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters("", state.filters),
    };

    try {
      const response = await findFilteredImports(params);
      const { items, total, page, pageSize } = response.data;

      set({
        imports: items,
        total,
        page,
        pageSize,
        lastPage: items.length < state.pageSize,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des entrées",
      );
      set({ error: message, isLoading: false });
    }
  },

  removeImport: (id: number) => {
    set((prev) => ({
      imports: prev.imports.filter((imp) => imp.id !== id),
      total: prev.total - 1,
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  clearError: () => {
    set({ error: null });
  },

  // ── Advanced filters ─────────────────────────

  applyFilters: async (filters: ImportFilters) => {
    set({
      filters,
      imports: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListImportDto = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, filters),
    };

    try {
      const response = await findFilteredImports(params);
      const { items, total, page, pageSize } = response.data;

      set({
        imports: items,
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
      imports: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListImportDto = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters("", null),
    };

    try {
      const response = await findFilteredImports(params);
      const { items, total, page, pageSize } = response.data;

      set({
        imports: items,
        total,
        page,
        pageSize,
        lastPage: items.length < state.pageSize,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des entrées",
      );
      set({ error: message, isLoading: false });
    }
  },
}));
