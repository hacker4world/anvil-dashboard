import { useState, useCallback } from "react";
import { useSupplierStore } from "@/store/supplierStore";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterSuppliersModalReturn {
  /** Local input value for the contact filter */
  contactInput: string;
  /** Setter for the local contact input */
  setContactInput: (value: string) => void;
  /** Whether the filter operation is loading */
  isLoading: boolean;
  /** Error message to display in the modal (or null) */
  error: string | null;
  /** Applies the contact filter and closes the modal */
  handleApply: () => Promise<void>;
  /** Resets the contact filter and closes the modal */
  handleReset: () => Promise<void>;
  /** Clears the local error */
  clearError: () => void;
}

export function useFilterSuppliersModal(
  onClose: () => void,
): UseFilterSuppliersModalReturn {
  const { contactFilter, applyFilters, clearFilters } = useSupplierStore();

  const [contactInput, setContactInput] = useState(contactFilter);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set the contact filter in the store
      useSupplierStore.getState().setContactFilter(contactInput);
      // Apply filters (combines searchQuery + contactFilter)
      await useSupplierStore.getState().applyFilters();
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
  }, [contactInput, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setContactInput("");

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
    contactInput,
    setContactInput,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  };
}
