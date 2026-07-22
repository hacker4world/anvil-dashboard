import { useState, useCallback } from "react";
import { useManufacturerStore } from "@/store/manufacturerStore";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterManufacturersModalReturn {
  /** Local input value for the contact filter */
  contactInput: string;
  /** Setter for the local contact input */
  setContactInput: (value: string) => void;
  /** Local input value for the address filter */
  addressInput: string;
  /** Setter for the local address input */
  setAddressInput: (value: string) => void;
  /** Whether the filter operation is loading */
  isLoading: boolean;
  /** Error message to display in the modal (or null) */
  error: string | null;
  /** Applies the filters and closes the modal */
  handleApply: () => Promise<void>;
  /** Resets the filters and closes the modal */
  handleReset: () => Promise<void>;
  /** Clears the local error */
  clearError: () => void;
}

export function useFilterManufacturersModal(
  onClose: () => void,
): UseFilterManufacturersModalReturn {
  const { contactFilter, addressFilter, applyFilters, clearFilters } =
    useManufacturerStore();

  const [contactInput, setContactInput] = useState(contactFilter);
  const [addressInput, setAddressInput] = useState(addressFilter);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set the filters in the store
      useManufacturerStore.getState().setContactFilter(contactInput);
      useManufacturerStore.getState().setAddressFilter(addressInput);
      // Apply filters (combines searchQuery + contactFilter + addressFilter)
      await useManufacturerStore.getState().applyFilters();
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
  }, [contactInput, addressInput, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setContactInput("");
    setAddressInput("");

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
    addressInput,
    setAddressInput,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  };
}
