import { useState, useCallback, useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useFamilyStore } from "@/store/familyStore";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { getAllSubfamilies } from "@/services/subfamily.service";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterCategoriesModalReturn {
  /** Local state for the selected family ID */
  selectedFamilyId: string;
  /** Setter for the local family ID input */
  setSelectedFamilyId: (value: string) => void;
  /** Local state for the selected subfamily ID */
  selectedSubfamilyId: string;
  /** Setter for the local subfamily ID input */
  setSelectedSubfamilyId: (value: string) => void;
  /** Whether the filter operation is loading */
  isLoading: boolean;
  /** Error message to display in the modal (or null) */
  error: string | null;
  /** Family options for the CustomSelect */
  familyOptions: IconSelectOption[];
  /** Whether families are still loading */
  loadingFamilies: boolean;
  /** Error loading families (shown below the select) */
  familyError: string | null;
  /** Subfamily options for the CustomSelect (filtered by selected family) */
  subfamilyOptions: IconSelectOption[];
  /** Whether subfamilies are still loading */
  loadingSubfamilies: boolean;
  /** Error loading subfamilies (shown below the select) */
  subfamilyError: string | null;
  /** Applies the filters and closes the modal */
  handleApply: () => Promise<void>;
  /** Resets the filters and closes the modal */
  handleReset: () => Promise<void>;
  /** Clears the local error */
  clearError: () => void;
}

export function useFilterCategoriesModal(
  onClose: () => void,
): UseFilterCategoriesModalReturn {
  const { subfamilyFilter, clearFilters } = useCategoryStore();

  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedSubfamilyId, setSelectedSubfamilyId] =
    useState(subfamilyFilter);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Family state
  const [familyOptions, setFamilyOptions] = useState<IconSelectOption[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  const [familyError, setFamilyError] = useState<string | null>(null);

  // Subfamily state — we keep the full list and a filtered view
  const [allSubfamilyOptions, setAllSubfamilyOptions] = useState<
    { option: IconSelectOption; familyId: number | undefined }[]
  >([]);
  const [subfamilyOptions, setSubfamilyOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingSubfamilies, setLoadingSubfamilies] = useState(false);
  const [subfamilyError, setSubfamilyError] = useState<string | null>(null);

  // Load families on mount: zustand first, then API if store is empty
  useEffect(() => {
    const store = useFamilyStore.getState();
    if (store.families.length > 0) {
      setFamilyOptions(
        store.families.map((f) => ({ value: String(f.id), label: f.name })),
      );
      return;
    }
    loadFamiliesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFamiliesFromApi = async () => {
    setLoadingFamilies(true);
    setFamilyError(null);

    await useFamilyStore.getState().fetchFamilies();

    const store = useFamilyStore.getState();
    if (store.error) {
      setFamilyError(store.error);
      useFamilyStore.getState().clearError();
    } else {
      setFamilyOptions(
        store.families.map((f) => ({ value: String(f.id), label: f.name })),
      );
    }

    setLoadingFamilies(false);
  };

  // Load all subfamilies on mount from API
  useEffect(() => {
    loadSubfamiliesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubfamiliesFromApi = async () => {
    setLoadingSubfamilies(true);
    setSubfamilyError(null);

    try {
      const response = await getAllSubfamilies();
      const items = response.data;
      const mapped = items.map((s) => ({
        option: { value: String(s.id), label: s.name },
        familyId: s.familyId ?? s.family?.id,
      }));
      setAllSubfamilyOptions(mapped);
      // Initially show all subfamilies
      setSubfamilyOptions(mapped.map((m) => m.option));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setSubfamilyError(err.response.data.message);
        } else if (!err.response) {
          setSubfamilyError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          setSubfamilyError("Erreur lors du chargement des sous-familles");
        }
      } else {
        setSubfamilyError("Erreur lors du chargement des sous-familles");
      }
    } finally {
      setLoadingSubfamilies(false);
    }
  };

  // Filter subfamily options when the selected family changes
  useEffect(() => {
    if (selectedFamilyId) {
      const filtered = allSubfamilyOptions.filter(
        (s) => s.familyId === Number(selectedFamilyId),
      );
      setSubfamilyOptions(filtered.map((m) => m.option));

      // If the currently selected subfamily doesn't belong to the selected family, clear it
      const stillBelongs = allSubfamilyOptions.some(
        (s) =>
          s.option.value === selectedSubfamilyId &&
          s.familyId === Number(selectedFamilyId),
      );
      if (selectedSubfamilyId && !stillBelongs) {
        setSelectedSubfamilyId("");
      }
    } else {
      setSubfamilyOptions(allSubfamilyOptions.map((m) => m.option));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFamilyId]);

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set the subfamily filter in the store
      useCategoryStore.getState().setSubfamilyFilter(selectedSubfamilyId);

      // Apply filters (this will read subfamilyFilter from the store)
      await useCategoryStore.getState().applyFilters();

      // Check if the store captured an error during applyFilters
      const storeError = useCategoryStore.getState().error;
      if (storeError) {
        setError(storeError);
        useCategoryStore.getState().clearError();
        return;
      }

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
  }, [selectedSubfamilyId, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedFamilyId("");
    setSelectedSubfamilyId("");

    try {
      await clearFilters();

      // Check if the store captured an error during clearFilters
      const storeError = useCategoryStore.getState().error;
      if (storeError) {
        setError(storeError);
        useCategoryStore.getState().clearError();
        return;
      }

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
    selectedFamilyId,
    setSelectedFamilyId,
    selectedSubfamilyId,
    setSelectedSubfamilyId,
    isLoading,
    error,
    familyOptions,
    loadingFamilies,
    familyError,
    subfamilyOptions,
    loadingSubfamilies,
    subfamilyError,
    handleApply,
    handleReset,
    clearError,
  };
}
