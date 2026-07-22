// src/hooks/confirmed-returns/useConfirmedReturns.ts
import { useState, useEffect } from "react";
import { useConfirmedReturnStore } from "@/store/confirmedReturnsStore";
import { ReturnEntity } from "@/models/return.model";

export function useConfirmedReturns() {
  const store = useConfirmedReturnStore();
  const [searchInput, setSearchInput] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<
    ReturnEntity | undefined
  >();
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  const handleLoadNextPage = () => {
    if (!store.lastPage && !store.isLoading) store.loadNextPage();
  };

  const clearAllFilters = () => {
    useConfirmedReturnStore.getState().clearFilters();
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
    handleLoadNextPage,
    showDetailsModal,
    setShowDetailsModal,
    selectedReturn,
    setSelectedReturn,
    showFilterModal,
    setShowFilterModal,
    clearAllFilters,
  };
}
