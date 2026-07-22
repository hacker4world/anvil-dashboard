import { SupplierModel, SupplierFilters } from "@/models/Supplier.model";
import { ListSupplierRequest } from "@/models/Supplier.model";
import { getFilteredSuppliers } from "@/services/supplier.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface SupplierState {
  // Data
  suppliers: SupplierModel[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  contactFilter: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSuppliers: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchSuppliers: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setContactFilter: (contact: string) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  addSupplier: (supplier: SupplierModel) => void;
  updateSupplier: (id: number, data: Partial<SupplierModel>) => void;
  removeSupplier: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  suppliers: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  contactFilter: "",
  isFiltered: false,
  isLoading: false,
  error: null,
};

/**
 * Extracts a user-friendly error message from an unknown error.
 * - API errors: uses the `message` field from the API response body.
 * - Network errors (no response): returns a generic helpful message.
 * - Other errors: falls back to `err.message` or a default string.
 */
function extractErrorMessage(err: unknown, defaultMessage: string): string {
  if (isAxiosError(err)) {
    // API responded with an error status — use its message field
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    // Network error (no response received, e.g. server is unreachable)
    if (!err.response) {
      return "Une erreur est survenue lors de la connexion au serveur. Veuillez rafraîchir la page et réessayer.";
    }
  }
  // Fallback: standard Error instance or generic message
  return err instanceof Error ? err.message : defaultMessage;
}

/**
 * Builds the filters object from the current search query and contact filter.
 * Returns undefined if no filters are active.
 */
function buildFilters(
  searchQuery: string,
  contactFilter: string,
): SupplierFilters | undefined {
  const filters: SupplierFilters = {};
  if (searchQuery.trim()) filters.name = searchQuery.trim();
  if (contactFilter.trim()) filters.contact = contactFilter.trim();
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export const useSupplierStore = create<SupplierState>()((set, get) => ({
  ...initialState,

  fetchSuppliers: async (reset = false) => {
    const state = get();
    const currentPage = reset ? 1 : state.page;

    set({ isLoading: true, error: null });

    // If reset is true, clear the list and start from page 1
    if (reset) {
      set({ suppliers: [], page: 1 });
    }

    const params: ListSupplierRequest = {
      page: currentPage,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.contactFilter),
    };

    try {
      const response = await getFilteredSuppliers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set((prev) => ({
        suppliers: reset ? items : [...prev.suppliers, ...items],
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des fournisseurs",
      );
      set({ error: message, isLoading: false });
    }
  },

  loadNextPage: async () => {
    const state = get();
    if (state.lastPage || state.isLoading) return;

    set({ page: state.page + 1 });
    await get().fetchSuppliers(false);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchSuppliers: async () => {
    // Reset to first page and fetch with search filter
    set({
      suppliers: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListSupplierRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.contactFilter),
    };

    try {
      const response = await getFilteredSuppliers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        suppliers: items,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des fournisseurs",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      contactFilter: "",
      isFiltered: false,
      suppliers: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const params: ListSupplierRequest = {
      page: 1,
      pageSize: get().pageSize,
    };

    try {
      const response = await getFilteredSuppliers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        suppliers: items,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des fournisseurs",
      );
      set({ error: message, isLoading: false });
    }
  },

  setContactFilter: (contact: string) => {
    set({ contactFilter: contact });
  },

  applyFilters: async () => {
    set({
      suppliers: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListSupplierRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.contactFilter),
    };

    try {
      const response = await getFilteredSuppliers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        suppliers: items,
        total,
        page,
        pageSize,
        lastPage,
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
      contactFilter: "",
      isFiltered: get().searchQuery ? true : false,
      suppliers: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListSupplierRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, ""),
    };

    try {
      const response = await getFilteredSuppliers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        suppliers: items,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des fournisseurs",
      );
      set({ error: message, isLoading: false });
    }
  },

  addSupplier: (supplier: SupplierModel) => {
    set((prev) => ({
      suppliers: [supplier, ...prev.suppliers],
      total: prev.total + 1,
    }));
  },

  updateSupplier: (id: number, data: Partial<SupplierModel>) => {
    set((prev) => ({
      suppliers: prev.suppliers.map((s) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    }));
  },

  removeSupplier: (id: number) => {
    set((prev) => ({
      suppliers: prev.suppliers.filter((s) => s.id !== id),
      total: prev.total - 1,
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  clearError: () => {
    set({ error: null });
  },
}));
