import { WarehouseModel } from "@/models/Warehouse.model";
import { getAllWarehouses } from "@/services/warehouse.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface WarehouseState {
  // Data
  warehouses: WarehouseModel[];
  total: number;

  // Search & filters
  searchQuery: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWarehouses: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchWarehouses: () => Promise<void>;
  clearSearch: () => Promise<void>;
  addWarehouse: (warehouse: WarehouseModel) => void;
  updateWarehouse: (id: number, data: Partial<WarehouseModel>) => void;
  removeWarehouse: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  warehouses: [],
  total: 0,
  searchQuery: "",
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

export const useWarehouseStore = create<WarehouseState>()((set, get) => ({
  ...initialState,

  fetchWarehouses: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllWarehouses();
      const items = response.data;

      set({
        warehouses: items,
        total: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des dépôts",
      );
      set({ error: message, isLoading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchWarehouses: async () => {
    const state = get();
    set({
      isLoading: true,
      error: null,
      isFiltered: true,
    });

    try {
      const response = await getAllWarehouses();
      const allItems = response.data;

      const query = state.searchQuery.trim().toLowerCase();
      const filtered = query
        ? allItems.filter((w) => w.name.toLowerCase().includes(query))
        : allItems;

      set({
        warehouses: filtered,
        total: filtered.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des dépôts",
      );
      set({ error: message, isLoading: false });
    }
  },

  clearSearch: async () => {
    set({
      searchQuery: "",
      isFiltered: false,
      isLoading: true,
      error: null,
    });

    try {
      const response = await getAllWarehouses();
      const items = response.data;

      set({
        warehouses: items,
        total: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des dépôts",
      );
      set({ error: message, isLoading: false });
    }
  },

  addWarehouse: (warehouse: WarehouseModel) => {
    set((prev) => ({
      warehouses: [warehouse, ...prev.warehouses],
      total: prev.total + 1,
    }));
  },

  updateWarehouse: (id: number, data: Partial<WarehouseModel>) => {
    set((prev) => ({
      warehouses: prev.warehouses.map((w) =>
        w.id === id ? { ...w, ...data } : w,
      ),
    }));
  },

  removeWarehouse: (id: number) => {
    set((prev) => ({
      warehouses: prev.warehouses.filter((w) => w.id !== id),
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
