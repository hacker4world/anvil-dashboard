import { WarehouseModel } from "@/models/Warehouse.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWarehouseStore } from "@/store/warehouseStore";
import { deleteWarehouse } from "@/services/warehouse.service";
import axios from "axios";

export function useWarehouses() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Zustand store
  const {
    warehouses,
    total,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchWarehouses,
    setSearchQuery,
    searchWarehouses,
    clearSearch,
    removeWarehouse,
    clearError,
  } = useWarehouseStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load all warehouses on mount if empty
  useEffect(() => {
    if (warehouses.length === 0 && !isLoading) {
      fetchWarehouses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchWarehouses();
    }
  };

  // Handle delete
  const handleConfirmDeleteWarehouse = async () => {
    if (!selectedWarehouse) return;

    try {
      await deleteWarehouse(selectedWarehouse.id);
      removeWarehouse(selectedWarehouse.id);
      toast("Dépôt supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedWarehouse(undefined);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          toast(err.response.data.message);
        } else if (!err.response) {
          toast(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          toast("Erreur lors de la suppression du dépôt");
        }
      } else {
        toast("Erreur lors de la suppression du dépôt");
      }
    }
  };

  // Clear error
  const handleClearError = () => {
    clearError();
  };

  return {
    // Data
    warehouses,
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
    selectedWarehouse,
    setSelectedWarehouse,

    // Modals
    showCreateModal,
    setShowCreateModal,
    showDeleteModal,
    setShowDeleteModal,
    showDetailsModal,
    setShowDetailsModal,

    // Actions
    handleConfirmDeleteWarehouse,
    handleClearError,
  };
}
