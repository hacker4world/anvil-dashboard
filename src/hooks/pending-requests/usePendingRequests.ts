import { ProductRequestEntity } from "@/models/request.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePendingRequestStore } from "@/store/pendingRequestsStore";
import { removeRequest } from "@/services/request.service";

export function usePendingRequests() {
  const [selectedRequest, setSelectedRequest] = useState<
    ProductRequestEntity | undefined
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const store = usePendingRequestStore();

  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount
  useEffect(() => {
    if (store.requests.length === 0 && !store.isLoading) {
      store.fetchRequests(true);
    }
  }, []);

  const handleSearchSubmit = () => {
    store.setSearchQuery(searchInput);
    if (searchInput.trim() === "") {
      store.clearSearch();
    } else {
      store.searchRequests();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;
    setDeletingId(selectedRequest.id);
    try {
      await removeRequest(selectedRequest.id);
      store.removeRequest(selectedRequest.id);
      toast.success("Demande supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedRequest(undefined);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la demande";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadNextPage = () => {
    if (!store.lastPage && !store.isLoading) {
      store.loadNextPage();
    }
  };

  return {
    // Data
    requests: store.requests,
    total: store.total,
    page: store.page,
    pageSize: store.pageSize,
    lastPage: store.lastPage,
    isLoading: store.isLoading,
    error: store.error,
    isFiltered: store.isFiltered,

    // Search
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    clearSearch: store.clearSearch,

    // Delete
    selectedRequest,
    setSelectedRequest,
    showDeleteModal,
    setShowDeleteModal,
    deletingId,
    handleConfirmDelete,

    // Pagination
    handleLoadNextPage,

    // Store helpers for future
    clearFilters: () => {}, // to be implemented later
  };
}
