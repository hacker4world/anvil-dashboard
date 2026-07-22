import {
  SubfamilyModel,
  SubfamilyFilters,
  ListSubfamilyRequest,
  mapToSubfamilyModel,
} from "@/models/Subfamily.model";
import { getFilteredSubfamilies } from "@/services/subfamily.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface SubfamilyState {
  // Data
  subfamilies: SubfamilyModel[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  familyFilter: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubfamilies: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchSubfamilies: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setFamilyFilter: (familyId: string) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  addSubfamily: (subfamily: SubfamilyModel) => void;
  updateSubfamily: (id: number, data: Partial<SubfamilyModel>) => void;
  removeSubfamily: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  subfamilies: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  familyFilter: "",
  isFiltered: false,
  isLoading: false,
  error: null,
};

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

function buildFilters(
  searchQuery: string,
  familyFilter: string,
): SubfamilyFilters | undefined {
  const filters: SubfamilyFilters = {};
  if (searchQuery.trim()) filters.name = searchQuery.trim();
  if (familyFilter.trim()) filters.familyId = Number(familyFilter.trim());
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export const useSubfamilyStore = create<SubfamilyState>()((set, get) => ({
  ...initialState,

  fetchSubfamilies: async (reset = false) => {
    const state = get();
    const currentPage = reset ? 1 : state.page;

    set({ isLoading: true, error: null });

    if (reset) {
      set({ subfamilies: [], page: 1 });
    }

    const params: ListSubfamilyRequest = {
      page: currentPage,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.familyFilter),
    };

    try {
      const response = await getFilteredSubfamilies(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToSubfamilyModel);

      set((prev) => ({
        subfamilies: reset
          ? mappedItems
          : [...prev.subfamilies, ...mappedItems],
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des sous-familles",
      );
      set({ error: message, isLoading: false });
    }
  },

  loadNextPage: async () => {
    const state = get();
    if (state.lastPage || state.isLoading) return;

    set({ page: state.page + 1 });
    await get().fetchSubfamilies(false);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchSubfamilies: async () => {
    set({
      subfamilies: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListSubfamilyRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.familyFilter),
    };

    try {
      const response = await getFilteredSubfamilies(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToSubfamilyModel);

      set({
        subfamilies: mappedItems,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des sous-familles",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      familyFilter: "",
      isFiltered: false,
      subfamilies: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const params: ListSubfamilyRequest = {
      page: 1,
      pageSize: get().pageSize,
    };

    try {
      const response = await getFilteredSubfamilies(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToSubfamilyModel);

      set({
        subfamilies: mappedItems,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des sous-familles",
      );
      set({ error: message, isLoading: false });
    }
  },

  setFamilyFilter: (familyId: string) => {
    set({ familyFilter: familyId });
  },

  applyFilters: async () => {
    set({
      subfamilies: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListSubfamilyRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.familyFilter),
    };

    try {
      const response = await getFilteredSubfamilies(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToSubfamilyModel);

      set({
        subfamilies: mappedItems,
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
      familyFilter: "",
      isFiltered: get().searchQuery ? true : false,
      subfamilies: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListSubfamilyRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, ""),
    };

    try {
      const response = await getFilteredSubfamilies(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToSubfamilyModel);

      set({
        subfamilies: mappedItems,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des sous-familles",
      );
      set({ error: message, isLoading: false });
    }
  },

  addSubfamily: (subfamily: SubfamilyModel) => {
    set((prev) => ({
      subfamilies: [subfamily, ...prev.subfamilies],
      total: prev.total + 1,
    }));
  },

  updateSubfamily: (id: number, data: Partial<SubfamilyModel>) => {
    set((prev) => ({
      subfamilies: prev.subfamilies.map((s) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    }));
  },

  removeSubfamily: (id: number) => {
    set((prev) => ({
      subfamilies: prev.subfamilies.filter((s) => s.id !== id),
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
