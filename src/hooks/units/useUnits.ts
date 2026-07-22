import { UnitModel } from "@/models/Unit.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUnitStore } from "@/store/unitStore";
import { deleteUnit } from "@/services/unit.service";
import axios from "axios";

export function useUnits() {
  const [selectedUnit, setSelectedUnit] = useState<UnitModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Zustand store
  const {
    units,
    total,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchUnits,
    setSearchQuery,
    searchUnits,
    clearSearch,
    removeUnit,
    clearError,
  } = useUnitStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load all units on mount if empty
  useEffect(() => {
    if (units.length === 0 && !isLoading) {
      fetchUnits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchUnits();
    }
  };

  // Handle delete
  const handleConfirmDeleteUnit = async () => {
    if (!selectedUnit) return;

    try {
      await deleteUnit(selectedUnit.id);
      removeUnit(selectedUnit.id);
      toast("Unité supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedUnit(undefined);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          toast(err.response.data.message);
        } else if (!err.response) {
          toast(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          toast("Erreur lors de la suppression de l'unité");
        }
      } else {
        toast("Erreur lors de la suppression de l'unité");
      }
    }
  };

  // Clear error
  const handleClearError = () => {
    clearError();
  };

  return {
    // Data
    units,
    total,
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
    selectedUnit,
    setSelectedUnit,

    // Modals
    showCreateModal,
    setShowCreateModal,
    showDeleteModal,
    setShowDeleteModal,
    showDetailsModal,
    setShowDetailsModal,

    // Actions
    handleConfirmDeleteUnit,
    handleClearError,
  };
}
