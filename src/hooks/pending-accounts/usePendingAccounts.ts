import { Account } from "@/models/Account.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePendingAccountStore } from "@/store/pendingAccountStore";
import { acceptAccount, deleteAccount } from "@/services/account.service";

export function usePendingAccounts() {
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

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
    fetchAccounts,
    loadNextPage,
    setSearchQuery,
    searchAccounts,
    clearSearch,
    removeAccount,
    clearError,
  } = usePendingAccountStore();

  // Search input local state
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (accounts.length === 0 && !isLoading) {
      fetchAccounts(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchAccounts();
    }
  };

  const handleConfirmAccount = async (account: Account) => {
    setConfirmingId(account.id);
    try {
      await acceptAccount(account.id);
      removeAccount(account.id);
      toast.success("Compte confirmé avec succès");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la confirmation du compte";
      toast.error(message);
    } finally {
      setConfirmingId(null);
    }
  };

  // Open confirm modal for a given account
  const handleOpenConfirmModal = (account: Account) => {
    setSelectedAccount(account);
    setShowConfirmModal(true);
  };

  // Confirm account from modal
  const handleConfirmAccountModal = async () => {
    if (!selectedAccount) return;

    await handleConfirmAccount(selectedAccount);
    setShowConfirmModal(false);
    setSelectedAccount(undefined);
  };

  // Handle delete
  const handleConfirmDeleteAccount = async () => {
    if (!selectedAccount) return;

    try {
      await deleteAccount(selectedAccount.id);
      removeAccount(selectedAccount.id);
      toast.success("Compte supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedAccount(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du compte";
      toast.error(message);
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
    showConfirmModal,
    setShowConfirmModal,
    showDetailsModal,
    setShowDetailsModal,
    filterModal,
    setFilterModal,

    // Actions
    handleConfirmDeleteAccount,
    handleConfirmAccountModal,
    handleOpenConfirmModal,
    handleLoadNextPage,
    handleClearError,
    handleConfirmAccount,
    confirmingId,
  };
}
