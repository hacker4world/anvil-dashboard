import { useState, useCallback, useEffect } from "react";
import { useSubfamilyStore } from "@/store/subfamilyStore";
import { useFamilyStore } from "@/store/familyStore";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterSubfamiliesModalReturn {
  /** Local state for the selected family ID */
  selectedFamilyId: string;
  /** Setter for the local family ID input */
  setSelectedFamilyId: (value: string) => void;
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
  /** Applies the filters and closes the modal */
  handleApply: () => Promise<void>;
  /** Resets the filters and closes the modal */
  handleReset: () => Promise<void>;
  /** Clears the local error */
  clearError: () => void;
}

export function useFilterSubfamiliesModal(
  onClose: () => void,
): UseFilterSubfamiliesModalReturn {
  const { familyFilter, clearFilters } = useSubfamilyStore();

  const [selectedFamilyId, setSelectedFamilyId] = useState(familyFilter);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [familyOptions, setFamilyOptions] = useState<IconSelectOption[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  const [familyError, setFamilyError] = useState<string | null>(null);

  // Load family options on mount: store first, then API if store is empty
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

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set the family filter in the store
      useSubfamilyStore.getState().setFamilyFilter(selectedFamilyId);

      // Apply filters (this will read familyFilter from the store)
      await useSubfamilyStore.getState().applyFilters();

      // Check if the store captured an error during applyFilters
      const storeError = useSubfamilyStore.getState().error;
      if (storeError) {
        setError(storeError);
        useSubfamilyStore.getState().clearError();
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
  }, [selectedFamilyId, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedFamilyId("");

    try {
      await clearFilters();

      // Check if the store captured an error during clearFilters
      const storeError = useSubfamilyStore.getState().error;
      if (storeError) {
        setError(storeError);
        useSubfamilyStore.getState().clearError();
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
    isLoading,
    error,
    familyOptions,
    loadingFamilies,
    familyError,
    handleApply,
    handleReset,
    clearError,
  };
}
