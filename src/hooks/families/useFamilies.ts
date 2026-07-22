import { FamilyModel } from "@/models/Family.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFamilyStore } from "@/store/familyStore";
import { deleteFamily } from "@/services/family.service";

export function useFamilies() {
  const [selectedFamily, setSelectedFamily] = useState<FamilyModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Zustand store
  const {
    families,
    total,
    isFiltered,
    isLoading,
    error,
    fetchFamilies,
    setSearchQuery,
    searchFamilies,
    clearSearch,
    removeFamily,
    clearError,
  } = useFamilyStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load all families on mount if empty
  useEffect(() => {
    if (families.length === 0 && !isLoading) {
      fetchFamilies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchFamilies();
    }
  };

  // Handle delete
  const handleConfirmDeleteFamily = async () => {
    if (!selectedFamily) return;

    try {
      await deleteFamily(selectedFamily.id);
      removeFamily(selectedFamily.id);
      toast("Famille supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedFamily(undefined);
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

  return {
    // Data
    families,
    total,
    isLoading,
    error,
    isFiltered,

    // Search
    searchInput,
    setSearchInput,
    clearSearch,
    handleSearchSubmit,

    // Selected
    selectedFamily,
    setSelectedFamily,

    // Modals
    showCreateModal,
    setShowCreateModal,
    showDeleteModal,
    setShowDeleteModal,
    showDetailsModal,
    setShowDetailsModal,

    // Actions
    handleConfirmDeleteFamily,
    handleClearError,
  };
}
