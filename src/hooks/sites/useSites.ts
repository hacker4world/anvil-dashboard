import { SiteModel } from "@/models/Site.model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConstructionSiteStore } from "@/store/constructionSiteStore";
import { deleteConstructionSite } from "@/services/construction-site.service";
import axios from "axios";

export function useSites() {
  const [selectedSite, setSelectedSite] = useState<SiteModel>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Zustand store
  const {
    sites,
    total,
    page,
    pageSize,
    lastPage,
    searchQuery,
    isFiltered,
    isLoading,
    error,
    fetchSites,
    loadNextPage,
    setSearchQuery,
    searchSites,
    clearSearch,
    removeSite,
    clearError,
  } = useConstructionSiteStore();

  // Search input local state (only for visual display in the input field)
  const [searchInput, setSearchInput] = useState("");

  // Load first page on mount if empty
  useEffect(() => {
    if (sites.length === 0 && !isLoading) {
      fetchSites(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggered on Enter key press — performs the actual search API call
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);

    if (searchInput.trim() === "") {
      clearSearch();
    } else {
      searchSites();
    }
  };

  // Handle delete
  const handleConfirmDeleteSite = async () => {
    if (!selectedSite) return;

    try {
      await deleteConstructionSite(selectedSite.id);
      removeSite(selectedSite.id);
      toast("Chantier supprimé avec succès");
      setShowDeleteModal(false);
      setSelectedSite(undefined);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          toast(err.response.data.message);
        } else if (!err.response) {
          toast(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          toast("Erreur lors de la suppression du chantier");
        }
      } else {
        toast("Erreur lors de la suppression du chantier");
      }
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
    sites,
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
    selectedSite,
    setSelectedSite,

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
    handleConfirmDeleteSite,
    handleLoadNextPage,
    handleClearError,
  };
}
