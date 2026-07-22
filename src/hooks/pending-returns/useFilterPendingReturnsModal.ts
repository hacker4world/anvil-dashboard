// src/hooks/pending-returns/useFilterPendingReturnsModal.ts
import { useState, useEffect, useCallback } from "react";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { usePendingReturnStore } from "@/store/pendingReturnsStore";
import { ReturnFilters } from "@/models/return.model";
import { getAllConstructionSites } from "@/services/construction-site.service";
import { productClient } from "@/services/product.service";
import { productToArticleModel } from "@/models/Product.model";
import { listAccounts } from "@/services/account.service";
import { AccountRole } from "@/models/Account.model";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterPendingReturnsModalReturn {
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

  constructionSiteOptions: IconSelectOption[];
  loadingConstructionSites: boolean;
  constructionSitesError: string | null;

  productOptions: IconSelectOption[];
  loadingProducts: boolean;
  productsError: string | null;
  handleProductSearch: (query: string) => Promise<void>;

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

export function useFilterPendingReturnsModal(
  onClose: () => void,
): UseFilterPendingReturnsModalReturn {
  const storeFilters = usePendingReturnStore((s) => s.filters);

  const [constructionSiteInput, setConstructionSiteInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [accountInput, setAccountInput] = useState("");

  // Initialize from existing filters
  useEffect(() => {
    if (storeFilters) {
      if (storeFilters.constructionSiteId)
        setConstructionSiteInput(String(storeFilters.constructionSiteId));
      if (storeFilters.dateFrom) setDateFromInput(storeFilters.dateFrom);
      if (storeFilters.dateTo) setDateToInput(storeFilters.dateTo);
      if (storeFilters.productId)
        setProductInput(String(storeFilters.productId));
      if (storeFilters.accountId)
        setAccountInput(String(storeFilters.accountId));
    }
  }, [storeFilters]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construction sites
  const [constructionSiteOptions, setConstructionSiteOptions] = useState<
    IconSelectOption[]
  >([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [sitesError, setSitesError] = useState<string | null>(null);

  // Products
  const [productOptions, setProductOptions] = useState<IconSelectOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Accounts
  const [accountOptions, setAccountOptions] = useState<IconSelectOption[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadSites();
    loadProducts();
    loadAccounts();
  }, []);

  const loadSites = async () => {
    setLoadingSites(true);
    try {
      const res = await getAllConstructionSites();
      setConstructionSiteOptions(
        res.data.map((s) => ({ value: s.id, label: s.name })),
      );
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur chargement chantiers";
      setSitesError(msg);
    } finally {
      setLoadingSites(false);
    }
  };

  const loadProducts = async (query?: string) => {
    setLoadingProducts(true);
    try {
      const res = await productClient.getFiltered({
        page: 1,
        pageSize: 50,
        filters: query ? { name: query } : undefined,
      });
      const items = res.data.data.items.map(productToArticleModel);
      setProductOptions(items.map((p) => ({ value: p.id, label: p.name })));
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur chargement produits";
      setProductsError(msg);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSearch = async (query: string) => {
    await loadProducts(query);
  };

  const loadAccounts = async (search?: string) => {
    setLoadingAccounts(true);
    try {
      const res = await listAccounts({
        page: 1,
        pageSize: 50,
        filters: {
          role: AccountRole.PRODUCT_KEEPER,
          ...(search?.trim() ? { username: search.trim() } : {}),
        },
      });
      setAccountOptions(
        res.data.items.map((a) => ({
          value: a.id,
          label: `${a.firstname} ${a.lastname} (${a.username})`,
        })),
      );
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur chargement comptes";
      setAccountsError(msg);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleAccountSearch = async (query: string) => {
    await loadAccounts(query);
  };

  const buildFilterFromInputs = useCallback((): ReturnFilters => {
    const filters: ReturnFilters = {};
    if (constructionSiteInput)
      filters.constructionSiteId = Number(constructionSiteInput);
    if (dateFromInput) filters.dateFrom = dateFromInput;
    if (dateToInput) filters.dateTo = dateToInput;
    if (productInput) filters.productId = Number(productInput);
    if (accountInput) filters.accountId = Number(accountInput);
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
      await usePendingReturnStore.getState().applyFilters(filters);
      toast.success("Filtres appliqués avec succès");
      onClose();
    } catch (err: unknown) {
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
    setConstructionSiteInput("");
    setDateFromInput("");
    setDateToInput("");
    setProductInput("");
    setAccountInput("");
    try {
      await usePendingReturnStore.getState().clearFilters();
      toast.success("Filtres réinitialisés avec succès");
      onClose();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Erreur lors de la réinitialisation";
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
    loadingConstructionSites: loadingSites,
    constructionSitesError: sitesError,
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
