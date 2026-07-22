// src/hooks/pending-requests/useFilterPendingRequestsModal.ts
import { useState, useEffect, useCallback } from "react";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { usePendingRequestStore } from "@/store/pendingRequestsStore";
import { ProductRequestFilters } from "@/models/request.model";
import { getAllConstructionSites } from "@/services/construction-site.service";
import { productClient } from "@/services/product.service";
import { productToArticleModel } from "@/models/Product.model";
import { listAccounts } from "@/services/account.service";
import { AccountRole } from "@/models/Account.model";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterPendingRequestsModalReturn {
  constructionSiteInput: string;
  setConstructionSiteInput: (value: string) => void;
  dateFromInput: string;
  setDateFromInput: (value: string) => void;
  dateToInput: string;
  setDateToInput: (value: string) => void;
  productInput: string;
  setProductInput: (value: string) => void;
  accountInput: string;
  setAccountInput: (value: string) => void;

  // Construction site options
  constructionSiteOptions: IconSelectOption[];
  loadingConstructionSites: boolean;
  constructionSitesError: string | null;

  // Product options
  productOptions: IconSelectOption[];
  loadingProducts: boolean;
  productsError: string | null;
  handleProductSearch: (query: string) => Promise<void>;

  // Account options
  accountOptions: IconSelectOption[];
  loadingAccounts: boolean;
  accountsError: string | null;
  handleAccountSearch: (query: string) => Promise<void>;

  isLoading: boolean;
  error: string | null;
  handleApply: () => Promise<void>;
  handleReset: () => Promise<void>;
  clearError: () => void;
}

export function useFilterPendingRequestsModal(
  onClose: () => void,
): UseFilterPendingRequestsModalReturn {
  const storeFilters = usePendingRequestStore((s) => s.filters);

  // Local form state
  const [constructionSiteInput, setConstructionSiteInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [accountInput, setAccountInput] = useState("");

  // Init from existing store filters
  useEffect(() => {
    if (storeFilters) {
      if (storeFilters.constructionSiteId !== undefined)
        setConstructionSiteInput(String(storeFilters.constructionSiteId));
      if (storeFilters.dateFrom) setDateFromInput(storeFilters.dateFrom);
      if (storeFilters.dateTo) setDateToInput(storeFilters.dateTo);
      if (storeFilters.productId !== undefined)
        setProductInput(String(storeFilters.productId));
      if (storeFilters.accountId !== undefined)
        setAccountInput(String(storeFilters.accountId));
    }
  }, [storeFilters]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construction site state
  const [constructionSiteOptions, setConstructionSiteOptions] = useState<
    IconSelectOption[]
  >([]);
  const [loadingConstructionSites, setLoadingConstructionSites] =
    useState(false);
  const [constructionSitesError, setConstructionSitesError] = useState<
    string | null
  >(null);

  // Product state
  const [productOptions, setProductOptions] = useState<IconSelectOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Account state
  const [accountOptions, setAccountOptions] = useState<IconSelectOption[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Load construction sites
  useEffect(() => {
    loadConstructionSitesFromApi();
  }, []);

  // Load products
  useEffect(() => {
    loadProductsFromApi();
  }, []);

  // Load accounts (demandeurs)
  useEffect(() => {
    loadAccountsFromApi();
  }, []);

  const loadConstructionSitesFromApi = async () => {
    setLoadingConstructionSites(true);
    setConstructionSitesError(null);
    try {
      const response = await getAllConstructionSites();
      setConstructionSiteOptions(
        response.data.map((s) => ({ value: s.id, label: s.name })),
      );
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur de chargement des chantiers";
      setConstructionSitesError(msg);
    } finally {
      setLoadingConstructionSites(false);
    }
  };

  const loadProductsFromApi = async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const response = await productClient.getFiltered({
        page: 1,
        pageSize: 50,
      });
      const items = response.data.data.items.map(productToArticleModel);
      setProductOptions(items.map((p) => ({ value: p.id, label: p.name })));
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur de chargement des produits";
      setProductsError(msg);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSearch = async (query: string) => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const response = await productClient.getFiltered({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      const items = response.data.data.items.map(productToArticleModel);
      setProductOptions(items.map((p) => ({ value: p.id, label: p.name })));
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur de recherche de produits";
      setProductsError(msg);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadAccountsFromApi = async (searchQuery?: string) => {
    setLoadingAccounts(true);
    setAccountsError(null);
    try {
      const response = await listAccounts({
        page: 1,
        pageSize: 50,
        filters: {
          role: AccountRole.PRODUCT_KEEPER,
          ...(searchQuery?.trim() ? { username: searchQuery.trim() } : {}),
        },
      });
      setAccountOptions(
        response.data.items.map((a) => ({
          value: a.id,
          label: `${a.firstname} ${a.lastname} (${a.username})`,
        })),
      );
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur de chargement des comptes";
      setAccountsError(msg);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleAccountSearch = async (query: string) => {
    await loadAccountsFromApi(query);
  };

  const buildFilterFromInputs = useCallback((): ProductRequestFilters => {
    const filters: ProductRequestFilters = {};
    if (constructionSiteInput.trim())
      filters.constructionSiteId = Number(constructionSiteInput);
    if (dateFromInput.trim()) filters.dateFrom = dateFromInput.trim();
    if (dateToInput.trim()) filters.dateTo = dateToInput.trim();
    if (productInput.trim()) filters.productId = Number(productInput);
    if (accountInput.trim()) filters.accountId = Number(accountInput);
    return filters;
  }, [
    constructionSiteInput,
    dateFromInput,
    dateToInput,
    productInput,
    accountInput,
  ]);

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = buildFilterFromInputs();
      await usePendingRequestStore.getState().applyFilters(filters);
      toast.success("Filtres appliqués avec succès");
      onClose();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur lors de l'application des filtres";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [buildFilterFromInputs, onClose]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // Clear local inputs
    setConstructionSiteInput("");
    setDateFromInput("");
    setDateToInput("");
    setProductInput("");
    setAccountInput("");
    try {
      await usePendingRequestStore.getState().clearFilters();
      toast.success("Filtres réinitialisés avec succès");
      onClose();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur lors de la réinitialisation des filtres";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [onClose]);

  const clearError = useCallback(() => setError(null), []);

  return {
    constructionSiteInput,
    setConstructionSiteInput,
    dateFromInput,
    setDateFromInput,
    dateToInput,
    setDateToInput,
    productInput,
    setProductInput,
    accountInput,
    setAccountInput,
    constructionSiteOptions,
    loadingConstructionSites,
    constructionSitesError,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    accountOptions,
    loadingAccounts,
    accountsError,
    handleAccountSearch,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  };
}
