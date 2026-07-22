import {
  ArticleModel,
  ListProductRequest,
  ProductFilters,
  productToArticleModel,
} from "@/models/Product.model";
import { productClient } from "@/services/product.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface ProductState {
  // Data
  articles: ArticleModel[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  isFiltered: boolean;

  // Advanced filter state
  currentStockFilter: string;
  minimumStockFilter: string;
  averagePriceFilter: string;
  unitFilter: string;
  warehouseFilter: string;
  categoryFilter: string;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchArticles: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchArticles: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setCurrentStockFilter: (value: string) => void;
  setMinimumStockFilter: (value: string) => void;
  setAveragePriceFilter: (value: string) => void;
  setUnitFilter: (value: string) => void;
  setWarehouseFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  addArticle: (article: ArticleModel) => void;
  updateArticle: (id: number, data: Partial<ArticleModel>) => void;
  removeArticle: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  articles: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  isFiltered: false,
  currentStockFilter: "",
  minimumStockFilter: "",
  averagePriceFilter: "",
  unitFilter: "",
  warehouseFilter: "",
  categoryFilter: "",
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
 * Builds the filters object from the current search query and advanced filters.
 * Returns undefined if no filters are active.
 */
function buildFilters(
  searchQuery: string,
  currentStockFilter: string,
  minimumStockFilter: string,
  averagePriceFilter: string,
  unitFilter: string,
  warehouseFilter: string,
  categoryFilter: string,
): ProductFilters | undefined {
  const filters: ProductFilters = {};
  if (searchQuery.trim()) filters.name = searchQuery.trim();
  if (currentStockFilter.trim())
    filters.stock = Number(currentStockFilter.trim()); // ← changed from currentStock to stock
  if (minimumStockFilter.trim())
    filters.minimumStock = Number(minimumStockFilter.trim());
  if (averagePriceFilter.trim())
    filters.averagePrice = Number(averagePriceFilter.trim());
  if (unitFilter.trim()) filters.unitId = Number(unitFilter.trim());
  if (warehouseFilter.trim())
    filters.warehouseId = Number(warehouseFilter.trim());
  if (categoryFilter.trim()) filters.categoryId = Number(categoryFilter.trim());
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  ...initialState,

  fetchArticles: async (reset = false) => {
    const state = get();
    const currentPage = reset ? 1 : state.page;

    set({ isLoading: true, error: null });

    if (reset) {
      set({ articles: [], page: 1 });
    }

    const params: ListProductRequest = {
      page: currentPage,
      pageSize: state.pageSize,
      filters: buildFilters(
        state.searchQuery,
        state.currentStockFilter,
        state.minimumStockFilter,
        state.averagePriceFilter,
        state.unitFilter,
        state.warehouseFilter,
        state.categoryFilter,
      ),
    };

    try {
      const response = await productClient.getFiltered(params);
      const { items, total, page, pageSize, lastPage } = response.data.data;

      set((prev) => ({
        articles: reset
          ? items.map(productToArticleModel)
          : [...prev.articles, ...items.map(productToArticleModel)],
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des produits",
      );
      set({ error: message, isLoading: false });
    }
  },

  loadNextPage: async () => {
    const state = get();
    if (state.lastPage || state.isLoading) return;

    set({ page: state.page + 1 });
    await get().fetchArticles(false);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchArticles: async () => {
    set({
      articles: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListProductRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(
        state.searchQuery,
        state.currentStockFilter,
        state.minimumStockFilter,
        state.averagePriceFilter,
        state.unitFilter,
        state.warehouseFilter,
        state.categoryFilter,
      ),
    };

    try {
      const response = await productClient.getFiltered(params);
      const { items, total, page, pageSize, lastPage } = response.data.data;

      set({
        articles: items.map(productToArticleModel),
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des produits",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      isFiltered: false,
      articles: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const params: ListProductRequest = {
      page: 1,
      pageSize: get().pageSize,
    };

    try {
      const response = await productClient.getFiltered(params);
      const { items, total, page, pageSize, lastPage } = response.data.data;

      set({
        articles: items.map(productToArticleModel),
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des produits",
      );
      set({ error: message, isLoading: false });
    }
  },

  // ── Advanced filter setters ──────────────────────────────

  setCurrentStockFilter: (value: string) => {
    set({ currentStockFilter: value });
  },

  setMinimumStockFilter: (value: string) => {
    set({ minimumStockFilter: value });
  },

  setAveragePriceFilter: (value: string) => {
    set({ averagePriceFilter: value });
  },

  setUnitFilter: (value: string) => {
    set({ unitFilter: value });
  },

  setWarehouseFilter: (value: string) => {
    set({ warehouseFilter: value });
  },

  setCategoryFilter: (value: string) => {
    set({ categoryFilter: value });
  },

  // ── Apply / Clear filters ────────────────────────────────

  applyFilters: async () => {
    set({
      articles: [],
      page: 1,
      isFiltered: true,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListProductRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(
        state.searchQuery,
        state.currentStockFilter,
        state.minimumStockFilter,
        state.averagePriceFilter,
        state.unitFilter,
        state.warehouseFilter,
        state.categoryFilter,
      ),
    };

    try {
      const response = await productClient.getFiltered(params);
      const { items, total, page, pageSize, lastPage } = response.data.data;

      set({
        articles: items.map(productToArticleModel),
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
      currentStockFilter: "",
      minimumStockFilter: "",
      averagePriceFilter: "",
      unitFilter: "",
      warehouseFilter: "",
      categoryFilter: "",
      isFiltered: get().searchQuery ? true : false,
      articles: [],
      page: 1,
      error: null,
      isLoading: true,
    });

    const state = get();
    const params: ListProductRequest = {
      page: 1,
      pageSize: state.pageSize,
      filters: buildFilters(state.searchQuery, "", "", "", "", "", ""),
    };

    try {
      const response = await productClient.getFiltered(params);
      const { items, total, page, pageSize, lastPage } = response.data.data;

      set({
        articles: items.map(productToArticleModel),
        total,
        page,
        pageSize,
        lastPage,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des produits",
      );
      set({ error: message, isLoading: false });
    }
  },

  addArticle: (article: ArticleModel) => {
    set((prev) => ({
      articles: [article, ...prev.articles],
      total: prev.total + 1,
    }));
  },

  updateArticle: (id: number, data: Partial<ArticleModel>) => {
    set((prev) => ({
      articles: prev.articles.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }));
  },

  removeArticle: (id: number) => {
    set((prev) => ({
      articles: prev.articles.filter((a) => a.id !== id),
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
