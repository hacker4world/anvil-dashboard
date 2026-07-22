import { ArticleModel } from "@/models/Product.model";
import { productClient } from "@/services/product.service";
import { useProductStore } from "@/store/productStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useArticles() {
  const [selectedArticle, setSelectedArticle] = useState<ArticleModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    articles,
    total,
    page,
    pageSize,
    lastPage,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchArticles,
    loadNextPage,
    setSearchQuery,
    searchArticles,
    clearSearch,
    removeArticle,
    clearError,
  } = useProductStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (articles.length === 0 && !isLoading) {
      fetchArticles(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search API call
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchArticles();
    }
  };

  // Handle delete
  const handleConfirmDeleteArticle = async () => {
    if (!selectedArticle) return;

    try {
      await productClient.delete(selectedArticle.id);
      removeArticle(selectedArticle.id);
      toast("Produit supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedArticle(undefined);
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
    articles,
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
    selectedArticle,
    setSelectedArticle,

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
    handleConfirmDeleteArticle,
    handleLoadNextPage,
    handleClearError,
  };
}
