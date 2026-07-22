import { ManufacturerModel } from "@/models/Manufacturer.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useManufacturerStore } from "@/store/manufacturerStore";
import { deleteManufacturer } from "@/services/manufacturer.service";

export function useManufacturers() {
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<ManufacturerModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    manufacturers,
    total,
    page,
    pageSize,
    lastPage,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchManufacturers,
    loadNextPage,
    setSearchQuery,
    searchManufacturers,
    clearSearch,
    removeManufacturer,
    clearError,
  } = useManufacturerStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (manufacturers.length === 0 && !isLoading) {
      fetchManufacturers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search API call
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchManufacturers();
    }
  };

  // Handle delete
  const handleConfirmDeleteManufacturer = async () => {
    if (!selectedManufacturer) return;

    try {
      await deleteManufacturer(selectedManufacturer.id);
      removeManufacturer(selectedManufacturer.id);
      toast("Fabricant supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedManufacturer(undefined);
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
    manufacturers,
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
    selectedManufacturer,
    setSelectedManufacturer,

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
    handleConfirmDeleteManufacturer,
    handleLoadNextPage,
    handleClearError,
  };
}
