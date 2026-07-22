import { SubfamilyModel } from "@/models/Subfamily.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSubfamilyStore } from "@/store/subfamilyStore";
import { deleteSubfamily } from "@/services/subfamily.service";

export function useSubfamilies() {
  const [selectedSubfamily, setSelectedSubfamily] = useState<SubfamilyModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    subfamilies,
    total,
    page,
    pageSize,
    lastPage,
    isFiltered,
    isLoading,
    error,
    fetchSubfamilies,
    loadNextPage,
    setSearchQuery,
    searchSubfamilies,
    clearSearch,
    removeSubfamily,
    clearError,
  } = useSubfamilyStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (subfamilies.length === 0 && !isLoading) {
      fetchSubfamilies(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchSubfamilies();
    }
  };

  // Handle delete
  const handleConfirmDeleteSubfamily = async () => {
    if (!selectedSubfamily) return;

    try {
      await deleteSubfamily(selectedSubfamily.id);
      removeSubfamily(selectedSubfamily.id);
      toast("Sous-famille supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedSubfamily(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast(message);
    }
  };

  // Clear error
  const handleClearError = () => {
    clearError();
  };

  // Load next page (for "Load more" or infinite scroll)
  const handleLoadNextPage = () => {
    loadNextPage();
  };

  return {
    // Data
    subfamilies,
    total,
    isLoading,
    error,
    isFiltered,

    // Pagination
    loadNextPage: handleLoadNextPage,
    hasMore: !useSubfamilyStore.getState().lastPage,

    // Search
    searchInput,
    setSearchInput,
    clearSearch,
    handleSearchSubmit,

    // Selected
    selectedSubfamily,
    setSelectedSubfamily,

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
    handleConfirmDeleteSubfamily,
    handleClearError,
    fetchSubfamilies,
    page,
    pageSize,
    lastPage,
  };
}
