// src/hooks/confirmed-requests/useConfirmedRequests.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ProductRequestEntity } from "@/models/request.model";
import { useConfirmedRequestStore } from "@/store/confirmedRequestsStore";
import { turnRequestIntoExport } from "@/services/request.service";
import { useAuthStore } from "@/store/authStore"; // adjust the import path to your actual auth store
import axios from "axios";

export function useConfirmedRequests() {
  const store = useConfirmedRequestStore();

  // ── Search & Pagination ─────────────────────────
  const [searchInput, setSearchInput] = useState("");

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

  const handleLoadNextPage = () => {
    if (!store.lastPage && !store.isLoading) {
      store.loadNextPage();
    }
  };

  const clearAllFilters = () => {
    useConfirmedRequestStore.getState().clearFilters();
  };

  // ── Details modal ──────────────────────────────
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<
    ProductRequestEntity | undefined
  >();

  // ── Convert to export modal ────────────────────
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [requestToConvert, setRequestToConvert] = useState<
    ProductRequestEntity | undefined
  >();
  const [isConverting, setIsConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  // ── Filter modal ───────────────────────────────
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ── Open convert modal (from table or details) ──
  const openConvertModal = useCallback((req: ProductRequestEntity) => {
    setRequestToConvert(req);
    setConvertError(null);
    setShowConvertModal(true);
  }, []);

  const closeConvertModal = useCallback(() => {
    setShowConvertModal(false);
    setRequestToConvert(undefined);
    setConvertError(null);
  }, []);

  // ── Handle conversion submission ───────────────
  const handleConvertSubmit = useCallback(
    async (payload: {
      transporterName: string;
      transporterMatricule: string;
      observation?: string;
      unitPrices: { productId: number; unitPrice: number }[];
    }) => {
      if (!requestToConvert) return;

      // Retrieve the current account ID from the auth store (same pattern as exports)
      const currentAccountId = useAuthStore.getState().account?.id;
      if (!currentAccountId) {
        toast.error(
          "Compte utilisateur introuvable. Veuillez vous reconnecter.",
        );
        return;
      }

      setIsConverting(true);
      setConvertError(null);

      try {
        await turnRequestIntoExport(requestToConvert.id, {
          ...payload,
          accountId: currentAccountId,
        });
        store.removeRequest(requestToConvert.id);
        toast.success("Demande convertie en exportation avec succès");
        closeConvertModal();
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Erreur lors de la conversion";
        setConvertError(message);
      } finally {
        setIsConverting(false);
      }
    },
    [requestToConvert, store, closeConvertModal],
  );

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

    // Pagination
    handleLoadNextPage,

    // Filter
    showFilterModal,
    setShowFilterModal,
    clearAllFilters,

    // Details modal
    showDetailsModal,
    setShowDetailsModal,
    selectedRequestForDetails,
    setSelectedRequestForDetails,

    // Convert modal
    showConvertModal,
    requestToConvert,
    isConverting,
    convertError,
    openConvertModal,
    closeConvertModal,
    handleConvertSubmit,
  };
}
