import { CategoryModel } from "@/models/Category.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/store/categoryStore";
import { deleteCategory } from "@/services/category.service";

export function useCategories() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    categories,
    total,
    page,
    pageSize,
    lastPage,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchCategories,
    loadNextPage,
    setSearchQuery,
    searchCategories,
    clearSearch,
    removeCategory,
    clearError,
  } = useCategoryStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      fetchCategories(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search API call
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchCategories();
    }
  };

  // Handle delete
  const handleConfirmDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id);
      removeCategory(selectedCategory.id);
      toast("Catégorie supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedCategory(undefined);
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
    categories,
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
    selectedCategory,
    setSelectedCategory,

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
    handleConfirmDeleteCategory,
    handleLoadNextPage,
    handleClearError,
  };
}
