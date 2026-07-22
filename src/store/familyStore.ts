import { FamilyModel } from "@/models/Family.model";
import { getAllFamilies } from "@/services/family.service";
import { create } from "zustand";
import { isAxiosError } from "axios";

interface FamilyState {
  // Data
  families: FamilyModel[];
  total: number;

  // Search & filters
  searchQuery: string;
  isFiltered: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFamilies: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchFamilies: () => Promise<void>;
  clearSearch: () => Promise<void>;
  addFamily: (family: FamilyModel) => void;
  updateFamily: (id: number, data: Partial<FamilyModel>) => void;
  removeFamily: (id: number) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  families: [],
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

export const useFamilyStore = create<FamilyState>()((set, get) => ({
  ...initialState,

  fetchFamilies: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllFamilies();
      const items = response.data;

      set({
        families: items,
        total: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des familles",
      );
      set({ error: message, isLoading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  searchFamilies: async () => {
    const state = get();
    set({
      isLoading: true,
      error: null,
      isFiltered: true,
    });

    try {
      const response = await getAllFamilies();
      const allItems = response.data;

      const query = state.searchQuery.trim().toLowerCase();
      const filtered = query
        ? allItems.filter((f) => f.name.toLowerCase().includes(query))
        : allItems;

      set({
        families: filtered,
        total: filtered.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors de la recherche des familles",
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
      const response = await getAllFamilies();
      const items = response.data;

      set({
        families: items,
        total: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "Erreur lors du chargement des familles",
      );
      set({ error: message, isLoading: false });
    }
  },

  addFamily: (family: FamilyModel) => {
    set((prev) => ({
      families: [family, ...prev.families],
      total: prev.total + 1,
    }));
  },

  updateFamily: (id: number, data: Partial<FamilyModel>) => {
    set((prev) => ({
      families: prev.families.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }));
  },

  removeFamily: (id: number) => {
    set((prev) => ({
      families: prev.families.filter((f) => f.id !== id),
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
