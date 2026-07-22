import { useState, useEffect, useCallback } from "react";
import { useUnitStore } from "@/store/unitStore";
import { useWarehouseStore } from "@/store/warehouseStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { getAllUnits } from "@/services/unit.service";
import { getAllWarehouses } from "@/services/warehouse.service";
import { getFilteredCategories } from "@/services/category.service";
import { mapToCategoryModel } from "@/models/Category.model";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { toast } from "sonner";
import axios from "axios";

interface UseFilterProductsModalReturn {
  // Local form state
  currentStockInput: string;
  setCurrentStockInput: (value: string) => void;
  minimumStockInput: string;
  setMinimumStockInput: (value: string) => void;
  averagePriceInput: string;
  setAveragePriceInput: (value: string) => void;
  unitInput: string;
  setUnitInput: (value: string) => void;
  warehouseInput: string;
  setWarehouseInput: (value: string) => void;
  categoryInput: string;
  setCategoryInput: (value: string) => void;

  // Unit
  unitOptions: IconSelectOption[];
  loadingUnits: boolean;
  unitsError: string | null;

  // Warehouse
  warehouseOptions: IconSelectOption[];
  loadingWarehouses: boolean;
  warehousesError: string | null;

  // Category
  categoryOptions: IconSelectOption[];
  loadingCategories: boolean;
  categoriesError: string | null;
  handleCategorySearch: (query: string) => Promise<void>;

  // Actions
  isLoading: boolean;
  error: string | null;
  handleApply: () => Promise<void>;
  handleReset: () => Promise<void>;
  clearError: () => void;
}

export function useFilterProductsModal(
  onClose: () => void,
): UseFilterProductsModalReturn {
  const {
    currentStockFilter,
    minimumStockFilter,
    averagePriceFilter,
    unitFilter,
    warehouseFilter,
    categoryFilter,
    applyFilters,
    clearFilters,
  } = useProductStore();

  // ── Local form state (initialized from store) ────────────
  const [currentStockInput, setCurrentStockInput] =
    useState(currentStockFilter);
  const [minimumStockInput, setMinimumStockInput] =
    useState(minimumStockFilter);
  const [averagePriceInput, setAveragePriceInput] =
    useState(averagePriceFilter);
  const [unitInput, setUnitInput] = useState(unitFilter);
  const [warehouseInput, setWarehouseInput] = useState(warehouseFilter);
  const [categoryInput, setCategoryInput] = useState(categoryFilter);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Unit state ──────────────────────────────────────────
  const [unitOptions, setUnitOptions] = useState<IconSelectOption[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [unitsError, setUnitsError] = useState<string | null>(null);

  // ── Warehouse state ─────────────────────────────────────
  const [warehouseOptions, setWarehouseOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [warehousesError, setWarehousesError] = useState<string | null>(null);

  // ── Category state ──────────────────────────────────────
  const [categoryOptions, setCategoryOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // ── Load units on mount ─────────────────────────────────
  useEffect(() => {
    const store = useUnitStore.getState();

    if (store.units.length > 0) {
      setUnitOptions(store.units.map((u) => ({ value: u.id, label: u.name })));
      return;
    }

    loadUnitsFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load warehouses on mount ────────────────────────────
  useEffect(() => {
    const store = useWarehouseStore.getState();

    if (store.warehouses.length > 0) {
      setWarehouseOptions(
        store.warehouses.map((w) => ({ value: w.id, label: w.name })),
      );
      return;
    }

    loadWarehousesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load categories on mount ────────────────────────────
  useEffect(() => {
    const store = useCategoryStore.getState();

    if (store.categories.length > 0) {
      setCategoryOptions(
        store.categories.map((c) => ({ value: c.id, label: c.name })),
      );
      return;
    }

    loadCategoriesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API loaders ─────────────────────────────────────────

  const loadUnitsFromApi = async () => {
    setLoadingUnits(true);
    setUnitsError(null);

    try {
      const response = await getAllUnits();
      const items = response.data;
      setUnitOptions(items.map((u) => ({ value: u.id, label: u.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setUnitsError(apiMessage || "Erreur lors du chargement des unités");
        } else {
          setUnitsError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setUnitsError("Erreur lors du chargement des unités");
      }
    } finally {
      setLoadingUnits(false);
    }
  };

  const loadWarehousesFromApi = async () => {
    setLoadingWarehouses(true);
    setWarehousesError(null);

    try {
      const response = await getAllWarehouses();
      const items = response.data;
      setWarehouseOptions(items.map((w) => ({ value: w.id, label: w.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setWarehousesError(
            apiMessage || "Erreur lors du chargement des dépôts",
          );
        } else {
          setWarehousesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setWarehousesError("Erreur lors du chargement des dépôts");
      }
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const loadCategoriesFromApi = async () => {
    setLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await getFilteredCategories({
        page: 1,
        pageSize: 50,
      });
      const items = response.data.items.map(mapToCategoryModel);
      setCategoryOptions(items.map((c) => ({ value: c.id, label: c.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setCategoriesError(
            apiMessage || "Erreur lors du chargement des catégories",
          );
        } else {
          setCategoriesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setCategoriesError("Erreur lors du chargement des catégories");
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  // ── Category search (triggered on Enter key) ────────────
  const handleCategorySearch = async (query: string) => {
    setLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await getFilteredCategories({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      const items = response.data.items.map(mapToCategoryModel);
      setCategoryOptions(items.map((c) => ({ value: c.id, label: c.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setCategoriesError(
            apiMessage || "Erreur lors de la recherche des catégories",
          );
        } else {
          setCategoriesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setCategoriesError("Erreur lors de la recherche des catégories");
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  // ── Apply filters ───────────────────────────────────────
  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set all filter values in the store
      useProductStore.getState().setCurrentStockFilter(currentStockInput);
      useProductStore.getState().setMinimumStockFilter(minimumStockInput);
      useProductStore.getState().setAveragePriceFilter(averagePriceInput);
      useProductStore.getState().setUnitFilter(unitInput);
      useProductStore.getState().setWarehouseFilter(warehouseInput);
      useProductStore.getState().setCategoryFilter(categoryInput);

      // Apply filters (combines searchQuery + all advanced filters)
      await useProductStore.getState().applyFilters();
      toast("Filtres appliqués avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (!err.response) {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          setError("Erreur lors de l'application des filtres");
        }
      } else {
        setError("Erreur lors de l'application des filtres");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    currentStockInput,
    minimumStockInput,
    averagePriceInput,
    unitInput,
    warehouseInput,
    categoryInput,
    onClose,
  ]);

  // ── Reset filters ───────────────────────────────────────
  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Clear local inputs
    setCurrentStockInput("");
    setMinimumStockInput("");
    setAveragePriceInput("");
    setUnitInput("");
    setWarehouseInput("");
    setCategoryInput("");

    try {
      await clearFilters();
      toast("Filtres réinitialisés avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (!err.response) {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          setError("Erreur lors de la réinitialisation des filtres");
        }
      } else {
        setError("Erreur lors de la réinitialisation des filtres");
      }
    } finally {
      setIsLoading(false);
    }
  }, [onClose, clearFilters]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Local form state
    currentStockInput,
    setCurrentStockInput,
    minimumStockInput,
    setMinimumStockInput,
    averagePriceInput,
    setAveragePriceInput,
    unitInput,
    setUnitInput,
    warehouseInput,
    setWarehouseInput,
    categoryInput,
    setCategoryInput,

    // Unit
    unitOptions,
    loadingUnits,
    unitsError,

    // Warehouse
    warehouseOptions,
    loadingWarehouses,
    warehousesError,

    // Category
    categoryOptions,
    loadingCategories,
    categoriesError,
    handleCategorySearch,

    // Actions
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  };
}
