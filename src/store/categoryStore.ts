import {
  CategoryModel,
  CategoryFilters,
  ListCategoryRequest,
  mapToCategoryModel,
} from "@/models/Category.model";
import { getFilteredCategories } from "@/services/category.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface CategoryState {
  // Data
  categories: CategoryModel[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  subfamilyFilter: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchCategories: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setSubfamilyFilter: (subfamilyId: string) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  addCategory: (category: CategoryModel) => void;
  updateCategory: (id: number, data: Partial<CategoryModel>) => void;
  removeCategory: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  categories: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  subfamilyFilter: "",
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
  subfamilyFilter: string,
): CategoryFilters | undefined {
  const filters: CategoryFilters = {};
  if (searchQuery.trim()) filters.name = searchQuery.trim();
  if (subfamilyFilter.trim())
    filters.subfamilyId = Number(subfamilyFilter.trim());
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  ...initialState,

  fetchCategories: async (reset = false) => {
    const state = get();
    const currentPage = reset ? 1 : state.page;

    set({ isLoading: true, error: null });

    if (reset) {
      set({ categories: [], page: 1 });
    }

    const params: ListCategoryRequest = {
      page: currentPage,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.subfamilyFilter),
    };

    try {
      const response = await getFilteredCategories(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToCategoryModel);

      set((prev) => ({
        categories: reset ? mappedItems : [...prev.categories, ...mappedItems],
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des catégories",
      );
      set({ error: message, isLoading: false });
    }
  },

  loadNextPage: async () => {
    const state = get();
    if (state.lastPage || state.isLoading) return;

    set({ page: state.page + 1 });
    await get().fetchCategories(false);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchCategories: async () => {
    set({
      categories: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListCategoryRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.subfamilyFilter),
    };

    try {
      const response = await getFilteredCategories(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToCategoryModel);

      set({
        categories: mappedItems,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des catégories",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      subfamilyFilter: "",
      isFiltered: false,
      categories: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const params: ListCategoryRequest = {
      page: 1,
      pageSize: get().pageSize,
    };

    try {
      const response = await getFilteredCategories(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToCategoryModel);

      set({
        categories: mappedItems,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des catégories",
      );
      set({ error: message, isLoading: false });
    }
  },

  setSubfamilyFilter: (subfamilyId: string) => {
    set({ subfamilyFilter: subfamilyId });
  },

  applyFilters: async () => {
    set({
      categories: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListCategoryRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, state.subfamilyFilter),
    };

    try {
      const response = await getFilteredCategories(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToCategoryModel);

      set({
        categories: mappedItems,
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
      subfamilyFilter: "",
      isFiltered: get().searchQuery ? true : false,
      categories: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListCategoryRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, ""),
    };

    try {
      const response = await getFilteredCategories(params);
      const { items, total, page, pageSize, lastPage } = response.data;
      const mappedItems = items.map(mapToCategoryModel);

      set({
        categories: mappedItems,
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des catégories",
      );
      set({ error: message, isLoading: false });
    }
  },

  addCategory: (category: CategoryModel) => {
    set((prev) => ({
      categories: [category, ...prev.categories],
      total: prev.total + 1,
    }));
  },

  updateCategory: (id: number, data: Partial<CategoryModel>) => {
    set((prev) => ({
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      ),
    }));
  },

  removeCategory: (id: number) => {
    set((prev) => ({
      categories: prev.categories.filter((c) => c.id !== id),
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
