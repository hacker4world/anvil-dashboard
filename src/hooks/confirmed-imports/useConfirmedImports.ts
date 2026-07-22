import { ImportResponse } from "@/models/import-export.dtos";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirmedImportStore } from "@/store/confirmedImportsStore";
import { deleteImport } from "@/services/import-export.service";

export function useConfirmedImports() {
  const [selectedImport, setSelectedImport] = useState<ImportResponse>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedImportForDetails, setSelectedImportForDetails] = useState<
    ImportResponse | undefined
  >();

  // ── Filter modal state ───────────────────────────
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Zustand store
  const {
    imports,
    total,
    page,
    pageSize,
    lastPage,
    isFiltered,
    isLoading,
    error,
    fetchImports,
    loadNextPage,
    setSearchQuery,
    searchImports,
    clearSearch,
    removeImport,
    clearError,
    clearFilters,
  } = useConfirmedImportStore();

  // Search input local state
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (imports.length === 0 && !isLoading) {
      fetchImports(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchImports();
    }
  };

  // Handle delete
  const handleConfirmDeleteImport = async () => {
    if (!selectedImport) return;

    setDeletingId(selectedImport.id);
    try {
      await deleteImport(selectedImport.id);
      removeImport(selectedImport.id);
      toast.success("Entrée supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedImport(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de l'entrée";
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
    imports,
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
    selectedImport,
    setSelectedImport,

    // Modals
    showDeleteModal,
    setShowDeleteModal,

    // Actions
    handleConfirmDeleteImport,
    handleLoadNextPage,
    deletingId,
    showDetailsModal,
    setShowDetailsModal,
    selectedImportForDetails,
    setSelectedImportForDetails,

    // ── Filter modal ───────────────────────────────
    showFilterModal,
    setShowFilterModal,
    clearFilters,

    clearError,
  };
}
