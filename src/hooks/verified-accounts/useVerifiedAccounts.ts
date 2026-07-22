import { Account } from "@/models/Account.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVerifiedAccountStore } from "@/store/verifiedAccountStore";
import { deleteAccount } from "@/services/account.service";

export function useVerifiedAccounts() {
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    accounts,
    total,
    page,
    pageSize,
    lastPage,
    isFiltered,
    isLoading,
    error,
    stats,
    statsLoading,
    fetchAccounts,
    fetchStats,
    loadNextPage,
    setSearchQuery,
    searchAccounts,
    clearSearch,
    removeAccount,
    clearError,
  } = useVerifiedAccountStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page and stats on mount if empty
  useEffect(() => {
    if (accounts.length === 0 && !isLoading) {
      fetchAccounts(true);
    }
    if (!stats && !statsLoading) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search API call
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchAccounts();
    }
  };

  // Handle delete
  const handleConfirmDeleteAccount = async () => {
    if (!selectedAccount) return;

    try {
      await deleteAccount(selectedAccount.id);
      removeAccount(selectedAccount.id);
      toast("Compte supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedAccount(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast(message);
    }
  };

  // Handle next page
  const handleLoadNextPage = () => {
    if (!lastPage && !isLoading) {
      loadNextPage();
    }
  };

  // Clear error
  const handleClearError = () => {
    clearError();
  };

  return {
    // Data
    accounts,
    total,
    page,
    pageSize,
    lastPage,
    isLoading,
    error,
    isFiltered,

    // Stats
    stats,
    statsLoading,

    // Search
    searchInput,
    setSearchInput,
    clearSearch,
    handleSearchSubmit,

    // Selected
    selectedAccount,
    setSelectedAccount,

    // Modals
    showDeleteModal,
    setShowDeleteModal,
    showDetailsModal,
    setShowDetailsModal,
    filterModal,
    setFilterModal,

    // Actions
    handleConfirmDeleteAccount,
    handleLoadNextPage,
    handleClearError,
  };
}
