import {
  ManufacturerModel,
  ManufacturerFilters,
} from "@/models/Manufacturer.model";
import { ListManufacturerRequest } from "@/models/Manufacturer.model";
import { getFilteredManufacturers } from "@/services/manufacturer.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface ManufacturerState {
  // Data
  manufacturers: ManufacturerModel[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  contactFilter: string;
  addressFilter: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchManufacturers: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchManufacturers: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setContactFilter: (contact: string) => void;
  setAddressFilter: (address: string) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  addManufacturer: (manufacturer: ManufacturerModel) => void;
  updateManufacturer: (id: number, data: Partial<ManufacturerModel>) => void;
  removeManufacturer: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  manufacturers: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  contactFilter: "",
  addressFilter: "",
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
 * Builds the filters object from the current search query, contact filter,
 * and address filter.
 * Returns undefined if no filters are active.
 */
function buildFilters(
  searchQuery: string,
  contactFilter: string,
  addressFilter: string,
): ManufacturerFilters | undefined {
  const filters: ManufacturerFilters = {};
  if (searchQuery.trim()) filters.name = searchQuery.trim();
  if (contactFilter.trim()) filters.contact = contactFilter.trim();
  if (addressFilter.trim()) filters.address = addressFilter.trim();
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export const useManufacturerStore = create<ManufacturerState>()((set, get) => ({
  ...initialState,

  fetchManufacturers: async (reset = false) => {
    const state = get();
    const currentPage = reset ? 1 : state.page;

    set({ isLoading: true, error: null });

    if (reset) {
      set({ manufacturers: [], page: 1 });
    }

    const params: ListManufacturerRequest = {
      page: currentPage,
      pageSize: state.pageSize,
      filters: buildFilters(
        state.searchQuery,
        state.contactFilter,
        state.addressFilter,
      ),
    };

    try {
      const response = await getFilteredManufacturers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      console.log(items.length);
      

      set((prev) => ({
        manufacturers: reset ? items : [...prev.manufacturers, ...items],
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des fabricants",
      );
      set({ error: message, isLoading: false });
    }
  },

  loadNextPage: async () => {
    const state = get();
    if (state.lastPage || state.isLoading) return;

    set({ page: state.page + 1 });
    await get().fetchManufacturers(false);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchManufacturers: async () => {
    set({
      manufacturers: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListManufacturerRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(
        state.searchQuery,
        state.contactFilter,
        state.addressFilter,
      ),
    };

    try {
      const response = await getFilteredManufacturers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        manufacturers: items,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des fabricants",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      contactFilter: "",
      addressFilter: "",
      isFiltered: false,
      manufacturers: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const params: ListManufacturerRequest = {
      page: 1,
      pageSize: get().pageSize,
    };

    try {
      const response = await getFilteredManufacturers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        manufacturers: items,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des fabricants",
      );
      set({ error: message, isLoading: false });
    }
  },

  setContactFilter: (contact: string) => {
    set({ contactFilter: contact });
  },

  setAddressFilter: (address: string) => {
    set({ addressFilter: address });
  },

  applyFilters: async () => {
    set({
      manufacturers: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListManufacturerRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(
        state.searchQuery,
        state.contactFilter,
        state.addressFilter,
      ),
    };

    try {
      const response = await getFilteredManufacturers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        manufacturers: items,
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
      addressFilter: "",
      isFiltered: get().searchQuery ? true : false,
      manufacturers: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListManufacturerRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, "", ""),
    };

    try {
      const response = await getFilteredManufacturers(params);
      const { items, total, page, pageSize, lastPage } = response.data;

      set({
        manufacturers: items,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des fabricants",
      );
      set({ error: message, isLoading: false });
    }
  },

  addManufacturer: (manufacturer: ManufacturerModel) => {
    set((prev) => ({
      manufacturers: [manufacturer, ...prev.manufacturers],
      total: prev.total + 1,
    }));
  },

  updateManufacturer: (id: number, data: Partial<ManufacturerModel>) => {
    set((prev) => ({
      manufacturers: prev.manufacturers.map((m) =>
        m.id === id ? { ...m, ...data } : m,
      ),
    }));
  },

  removeManufacturer: (id: number) => {
    set((prev) => ({
      manufacturers: prev.manufacturers.filter((m) => m.id !== id),
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
