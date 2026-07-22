import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ReturnEntity } from "@/models/return.model";
import { usePendingReturnStore } from "@/store/pendingReturnsStore";
import { removeReturn } from "@/services/return.service";

export function usePendingReturns() {
  const store = usePendingReturnStore();

  const [searchInput, setSearchInput] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<
    ReturnEntity | undefined
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReturnForDetails, setSelectedReturnForDetails] = useState<
    ReturnEntity | undefined
  >();

  useEffect(() => {
    if (store.returns.length === 0 && !store.isLoading) {
      store.fetchReturns(true);
    }
  }, []);

  const handleSearchSubmit = () => {
    store.setSearchQuery(searchInput);
    if (searchInput.trim() === "") {
      store.clearSearch();
    } else {
      store.searchReturns();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedReturn) return;
    setDeletingId(selectedReturn.id);
    try {
      await removeReturn(selectedReturn.id);
      store.removeReturn(selectedReturn.id);
      toast.success("Retour supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedReturn(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur de suppression";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadNextPage = () => {
    if (!store.lastPage && !store.isLoading) store.loadNextPage();
  };

  return {
    returns: store.returns,
    total: store.total,
    page: store.page,
    pageSize: store.pageSize,
    lastPage: store.lastPage,
    isLoading: store.isLoading,
    error: store.error,
    isFiltered: store.isFiltered,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    selectedReturn,
    setSelectedReturn,
    showDeleteModal,
    setShowDeleteModal,
    deletingId,
    handleConfirmDelete,
    handleLoadNextPage,
    showDetailsModal,
    setShowDetailsModal,
    selectedReturnForDetails,
    setSelectedReturnForDetails,
    clearAllFilters: () => {}, // will be implemented later
  };
}
