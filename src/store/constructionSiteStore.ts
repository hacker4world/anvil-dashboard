import {
  ConstructionSiteFilters,
  ListConstructionSiteRequest,
} from "@/models/ConstructionSite.model";
import { SiteModel, mapToSiteModel } from "@/models/Site.model";
import { getFilteredConstructionSites } from "@/services/construction-site.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface ConstructionSiteState {
  // Data
  sites: SiteModel[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: boolean;

  // Search & filters
  searchQuery: string;
  addressFilter: string;
  managerIdFilter: number | undefined;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSites: (reset?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchSites: () => Promise<void>;
  clearSearch: () => Promise<void>;
  setAddressFilter: (address: string) => void;
  setManagerIdFilter: (managerId: number | undefined) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  addSite: (site: SiteModel) => void;
  updateSite: (id: number, data: Partial<SiteModel>) => void;
  removeSite: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  sites: [],
  total: 0,
  page: 1,
  pageSize: 20,
  lastPage: false,
  searchQuery: "",
  addressFilter: "",
  managerIdFilter: undefined as number | undefined,
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
  addressFilter: string,
  managerIdFilter: number | undefined,
): ConstructionSiteFilters | undefined {
  const filters: ConstructionSiteFilters = {};
  if (searchQuery.trim()) filters.name = searchQuery.trim();
  if (addressFilter.trim()) filters.address = addressFilter.trim();
  if (managerIdFilter !== undefined && managerIdFilter !== null) {
    filters.managerId = managerIdFilter;
  }
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export const useConstructionSiteStore = create<ConstructionSiteState>()(
  (set, get) => ({
    ...initialState,

    fetchSites: async (reset = false) => {
      const state = get();
      const currentPage = reset ? 1 : state.page;

      set({ isLoading: true, error: null });

      if (reset) {
        set({ sites: [], page: 1 });
      }

      const params: ListConstructionSiteRequest = {
        page: currentPage,
        pageSize: state.pageSize,
        filters: buildFilters(
          state.searchQuery,
          state.addressFilter,
          state.managerIdFilter,
        ),
      };

      try {
        const response = await getFilteredConstructionSites(params);
        const { items, total, page, pageSize, lastPage } = response.data;
        const mappedItems = items.map(mapToSiteModel);

        set((prev) => ({
          sites: reset ? mappedItems : [...prev.sites, ...mappedItems],
          total,
          page,
          pageSize,
          lastPage,
          isLoading: false,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des chantiers",
        );
        set({ error: message, isLoading: false });
      }
    },

    loadNextPage: async () => {
      const state = get();
      if (state.lastPage || state.isLoading) return;

      set({ page: state.page + 1 });
      await get().fetchSites(false);
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    searchSites: async () => {
      set({
        sites: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListConstructionSiteRequest = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(
          state.searchQuery,
          state.addressFilter,
          state.managerIdFilter,
        ),
      };

      try {
        const response = await getFilteredConstructionSites(params);
        const { items, total, page, pageSize, lastPage } = response.data;
        const mappedItems = items.map(mapToSiteModel);

        set({
          sites: mappedItems,
          total,
          page,
          pageSize,
          lastPage,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors de la recherche des chantiers",
        );
        set({ error: message, isLoading: false });
      }
    },

    clearSearch: async () => {
      set({
        searchQuery: "",
        isFiltered: false,
        sites: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const params: ListConstructionSiteRequest = {
        page: 1,
        pageSize: get().pageSize,
        filters: buildFilters("", "", undefined),
      };

      try {
        const response = await getFilteredConstructionSites(params);
        const { items, total, page, pageSize, lastPage } = response.data;
        const mappedItems = items.map(mapToSiteModel);

        set({
          sites: mappedItems,
          total,
          page,
          pageSize,
          lastPage,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des chantiers",
        );
        set({ error: message, isLoading: false });
      }
    },

    setAddressFilter: (address: string) => {
      set({ addressFilter: address });
    },

    setManagerIdFilter: (managerId: number | undefined) => {
      set({ managerIdFilter: managerId });
    },

    applyFilters: async () => {
      set({
        sites: [],
        page: 1,
        isFiltered: true,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListConstructionSiteRequest = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(
          state.searchQuery,
          state.addressFilter,
          state.managerIdFilter,
        ),
      };

      try {
        const response = await getFilteredConstructionSites(params);
        const { items, total, page, pageSize, lastPage } = response.data;
        const mappedItems = items.map(mapToSiteModel);

        set({
          sites: mappedItems,
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
        addressFilter: "",
        managerIdFilter: undefined,
        isFiltered: get().searchQuery ? true : false,
        sites: [],
        page: 1,
        error: null,
        isLoading: true,
      });

      const state = get();
      const params: ListConstructionSiteRequest = {
        page: 1,
        pageSize: state.pageSize,
        filters: buildFilters(state.searchQuery, "", undefined),
      };

      try {
        const response = await getFilteredConstructionSites(params);
        const { items, total, page, pageSize, lastPage } = response.data;
        const mappedItems = items.map(mapToSiteModel);

        set({
          sites: mappedItems,
          total,
          page,
          pageSize,
          lastPage,
          isLoading: false,
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          "Erreur lors du chargement des chantiers",
        );
        set({ error: message, isLoading: false });
      }
    },

    addSite: (site: SiteModel) => {
      set((prev) => ({
        sites: [site, ...prev.sites],
        total: prev.total + 1,
      }));
    },

    updateSite: (id: number, data: Partial<SiteModel>) => {
      set((prev) => ({
        sites: prev.sites.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }));
    },

    removeSite: (id: number) => {
      set((prev) => ({
        sites: prev.sites.filter((s) => s.id !== id),
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
