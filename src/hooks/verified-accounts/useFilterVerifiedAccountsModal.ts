import { AccountRole } from "@/models/Account.model";
import { useState, useCallback } from "react";
import { useVerifiedAccountStore } from "@/store/verifiedAccountStore";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterVerifiedAccountsModalReturn {
  /** Local input value for the firstname filter */
  firstnameInput: string;
  /** Setter for the local firstname input */
  setFirstnameInput: (value: string) => void;
  /** Local input value for the lastname filter */
  lastnameInput: string;
  /** Setter for the local lastname input */
  setLastnameInput: (value: string) => void;
  /** Local input value for the username filter */
  usernameInput: string;
  /** Setter for the local username input */
  setUsernameInput: (value: string) => void;
  /** Local input value for the role filter */
  roleInput: AccountRole | "";
  /** Setter for the local role input */
  setRoleInput: (value: AccountRole | "") => void;
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

export function useFilterVerifiedAccountsModal(
  onClose: () => void,
): UseFilterVerifiedAccountsModalReturn {
  const {
    firstnameFilter,
    lastnameFilter,
    usernameFilter,
    roleFilter,
    applyFilters,
    clearFilters,
  } = useVerifiedAccountStore();

  const [firstnameInput, setFirstnameInput] = useState(firstnameFilter);
  const [lastnameInput, setLastnameInput] = useState(lastnameFilter);
  const [usernameInput, setUsernameInput] = useState(usernameFilter);
  const [roleInput, setRoleInput] = useState<AccountRole | "">(roleFilter);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set the filters in the store
      useVerifiedAccountStore.getState().setFirstnameFilter(firstnameInput);
      useVerifiedAccountStore.getState().setLastnameFilter(lastnameInput);
      useVerifiedAccountStore.getState().setUsernameFilter(usernameInput);
      useVerifiedAccountStore.getState().setRoleFilter(roleInput);
      // Apply filters (combines searchQuery + all filter fields)
      await useVerifiedAccountStore.getState().applyFilters();
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
  }, [firstnameInput, lastnameInput, usernameInput, roleInput, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFirstnameInput("");
    setLastnameInput("");
    setUsernameInput("");
    setRoleInput("");

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
    firstnameInput,
    setFirstnameInput,
    lastnameInput,
    setLastnameInput,
    usernameInput,
    setUsernameInput,
    roleInput,
    setRoleInput,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  };
}
