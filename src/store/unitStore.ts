import { UnitModel } from "@/models/Unit.model";
import { getAllUnits } from "@/services/unit.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface UnitState {
  // Data
  units: UnitModel[];
  total: number;

  // Search & filters
  searchQuery: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUnits: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchUnits: () => Promise<void>;
  clearSearch: () => Promise<void>;
  addUnit: (unit: UnitModel) => void;
  updateUnit: (id: number, data: Partial<UnitModel>) => void;
  removeUnit: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  units: [],
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

export const useUnitStore = create<UnitState>()((set, get) => ({
  ...initialState,

  fetchUnits: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllUnits();
      const items = response.data;

      set({
        units: items,
        total: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des unités",
      );
      set({ error: message, isLoading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchUnits: async () => {
    const state = get();
    set({
      isLoading: true,
      error: null,
      isFiltered: true,
    });

    try {
      const response = await getAllUnits();
      const allItems = response.data;

      const query = state.searchQuery.trim().toLowerCase();
      const filtered = query
        ? allItems.filter((u) => u.name.toLowerCase().includes(query))
        : allItems;

      set({
        units: filtered,
        total: filtered.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des unités",
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
      const response = await getAllUnits();
      const items = response.data;

      set({
        units: items,
        total: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des unités",
      );
      set({ error: message, isLoading: false });
    }
  },

  addUnit: (unit: UnitModel) => {
    set((prev) => ({
      units: [unit, ...prev.units],
      total: prev.total + 1,
    }));
  },

  updateUnit: (id: number, data: Partial<UnitModel>) => {
    set((prev) => ({
      units: prev.units.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
  },

  removeUnit: (id: number) => {
    set((prev) => ({
      units: prev.units.filter((u) => u.id !== id),
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
