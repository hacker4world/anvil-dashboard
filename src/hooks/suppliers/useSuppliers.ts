import { SupplierModel } from "@/models/Supplier.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSupplierStore } from "@/store/supplierStore";
import { deleteSupplier } from "@/services/supplier.service";

export function useSuppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    suppliers,
    total,
    page,
    pageSize,
    lastPage,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchSuppliers,
    loadNextPage,
    setSearchQuery,
    searchSuppliers,
    clearSearch,
    removeSupplier,
    clearError,
  } = useSupplierStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (suppliers.length === 0 && !isLoading) {
      fetchSuppliers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search API call
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchSuppliers();
    }
  };

  // Handle delete
  const handleConfirmDeleteSupplier = async () => {
    if (!selectedSupplier) return;

    try {
      await deleteSupplier(selectedSupplier.id);
      removeSupplier(selectedSupplier.id);
      toast("Fournisseur supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedSupplier(undefined);
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
    suppliers,
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
    searchQuery,
    clearSearch,
    handleSearchSubmit,

    // Selected
    selectedSupplier,
    setSelectedSupplier,

    // Modals
    showCreateModal,
    setShowCreateModal,
    showDeleteModal,
    setShowDeleteModal,
    showDetailsModal,
    setShowDetailsModal,
    filterModal,
    setFilterModal,

    // Actions
    handleConfirmDeleteSupplier,
    handleLoadNextPage,
    handleClearError,
  };
}
