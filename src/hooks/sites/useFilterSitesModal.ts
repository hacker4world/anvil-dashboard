import { useState, useCallback, useEffect } from "react";
import { useConstructionSiteStore } from "@/store/constructionSiteStore";
import { useVerifiedAccountStore } from "@/store/verifiedAccountStore";
import { listAccounts } from "@/services/account.service";
import { AccountRole, AccountFilters } from "@/models/Account.model";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterSitesModalReturn {
  /** Local input value for the address filter */
  addressInput: string;
  /** Setter for the local address input */
  setAddressInput: (value: string) => void;
  /** Local selected manager ID */
  managerIdInput: number | undefined;
  /** Setter for the local manager ID */
  setManagerIdInput: (value: number | undefined) => void;
  /** Manager options for the CustomSelect */
  managerOptions: IconSelectOption[];
  /** Whether managers are loading */
  loadingManagers: boolean;
  /** Manager loading error message */
  managerError: string | null;
  /** Callback when user searches for a manager */
  handleManagerSearch: (query: string) => Promise<void>;
  /** Whether the filter operation is loading */
  isLoading: boolean;
  /** Error message to display in the modal (or null) */
  error: string | null;
  /** Clears the local error */
  clearError: () => void;
  /** Applies the filters and closes the modal */
  handleApply: () => Promise<void>;
  /** Resets the filters and closes the modal */
  handleReset: () => Promise<void>;
}

export function useFilterSitesModal(
  onClose: () => void,
): UseFilterSitesModalReturn {
  const { addressFilter, managerIdFilter } = useConstructionSiteStore();

  const [addressInput, setAddressInput] = useState(addressFilter);
  const [managerIdInput, setManagerIdInput] = useState<number | undefined>(
    managerIdFilter,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manager select state
  const [managerOptions, setManagerOptions] = useState<IconSelectOption[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);

  // Load manager options on mount: check verifiedAccountStore first, then API
  useEffect(() => {
    const store = useVerifiedAccountStore.getState();
    const managers = store.accounts.filter(
      (a) => a.role === AccountRole.CONSTRUCTION_SITE_MANAGER,
    );

    if (managers.length > 0) {
      setManagerOptions(
        managers.map((m) => ({
          value: m.id,
          label: `${m.firstname} ${m.lastname}`,
        })),
      );
      return;
    }

    loadManagersFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadManagersFromApi = async (searchQuery?: string) => {
    setLoadingManagers(true);
    setManagerError(null);

    try {
      const filters: AccountFilters = {
        role: AccountRole.CONSTRUCTION_SITE_MANAGER,
        confirmed: true,
      };
      if (searchQuery?.trim()) {
        filters.lastname = searchQuery.trim();
      }

      const response = await listAccounts({
        page: 1,
        pageSize: 50,
        filters,
      });

      setManagerOptions(
        response.data.items.map((m) => ({
          value: m.id,
          label: `${m.firstname} ${m.lastname}`,
        })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setManagerError(
            apiMessage || "Erreur lors du chargement des responsables",
          );
        } else {
          setManagerError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setManagerError("Erreur lors du chargement des responsables");
      }
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleManagerSearch = async (query: string) => {
    await loadManagersFromApi(query);
  };

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const store = useConstructionSiteStore.getState();
      store.setAddressFilter(addressInput);
      store.setManagerIdFilter(managerIdInput);
      await store.applyFilters();
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
  }, [addressInput, managerIdInput, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAddressInput("");
    setManagerIdInput(undefined);

    try {
      const store = useConstructionSiteStore.getState();
      await store.clearFilters();
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
  }, [onClose]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    addressInput,
    setAddressInput,
    managerIdInput,
    setManagerIdInput,
    managerOptions,
    loadingManagers,
    managerError,
    handleManagerSearch,
    isLoading,
    error,
    clearError,
    handleApply,
    handleReset,
  };
}
