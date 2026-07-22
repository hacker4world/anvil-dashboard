import { ExportEntity } from "@/models/export.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirmedExportStore } from "@/store/confirmedExportsStore";
import { removeExport } from "@/services/export.service";

export function useConfirmedExports() {
  const [selectedExport, setSelectedExport] = useState<
    ExportEntity | undefined
  >();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExportForDetails, setSelectedExportForDetails] = useState<
    ExportEntity | undefined
  >();

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Zustand store
  const {
    exports,
    total,
    page,
    pageSize,
    lastPage,
    isFiltered,
    isLoading,
    error,
    fetchExports,
    loadNextPage,
    setSearchQuery,
    searchExports,
    clearSearch,
    removeExport: removeExportFromStore,
    clearError,
    clearFilters,
  } = useConfirmedExportStore();

  // Search input local state
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (exports.length === 0 && !isLoading) {
      fetchExports(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchExports();
    }
  };

  // Handle delete
  const handleConfirmDeleteExport = async () => {
    if (!selectedExport) return;

    setDeletingId(selectedExport.id);
    try {
      await removeExport(selectedExport.id);
      removeExportFromStore(selectedExport.id);
      toast.success("Sortie supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedExport(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la sortie";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle next page
  const handleLoadNextPage = () => {
    if (!lastPage && !isLoading) {
      loadNextPage();
    }
  };

  return {
    // Data
    exports,
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
    selectedExport,
    setSelectedExport,

    // Modals
    showDeleteModal,
    setShowDeleteModal,

    // Actions
    handleConfirmDeleteExport,
    handleLoadNextPage,
    deletingId,
    showDetailsModal,
    setShowDetailsModal,
    selectedExportForDetails,
    setSelectedExportForDetails,

    // Filter modal
    showFilterModal,
    setShowFilterModal,
    clearFilters,
    clearError,
  };
}
