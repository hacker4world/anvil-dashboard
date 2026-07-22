import { useState, useEffect, useCallback } from "react";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { useConfirmedExportStore } from "@/store/confirmedExportsStore";
import { ExportFilters, ExportType } from "@/models/export.model";
import { getAllWarehouses } from "@/services/warehouse.service";
import { getAllConstructionSites } from "@/services/construction-site.service";
import { productClient } from "@/services/product.service";
import { productToArticleModel } from "@/models/Product.model";
import { listAccounts } from "@/services/account.service";
import { AccountRole } from "@/models/Account.model";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterConfirmedExportsModalReturn {
  // Local form state
  exportTypeInput: string;
  setExportTypeInput: (value: string) => void;
  warehouseInput: string;
  setWarehouseInput: (value: string) => void;
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

  // Warehouse options
  warehouseOptions: IconSelectOption[];
  loadingWarehouses: boolean;
  warehousesError: string | null;

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

  // Actions
  isLoading: boolean;
  error: string | null;
  handleApply: () => Promise<void>;
  handleReset: () => Promise<void>;
  clearError: () => void;
}

export function useFilterConfirmedExportsModal(
  onClose: () => void,
): UseFilterConfirmedExportsModalReturn {
  const storeFilters = useConfirmedExportStore((s) => s.filters);

  // ── Local form state ────────────────────────────
  const [exportTypeInput, setExportTypeInput] = useState("");
  const [warehouseInput, setWarehouseInput] = useState("");
  const [constructionSiteInput, setConstructionSiteInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [accountInput, setAccountInput] = useState("");

  // ── Initialise local state from existing store filters ──
  useEffect(() => {
    if (storeFilters) {
      if (storeFilters.exportType !== undefined)
        setExportTypeInput(storeFilters.exportType);
      if (storeFilters.warehouseId !== undefined)
        setWarehouseInput(String(storeFilters.warehouseId));
      if (storeFilters.constructionSiteId !== undefined)
        setConstructionSiteInput(String(storeFilters.constructionSiteId));
      if (storeFilters.dateFrom !== undefined)
        setDateFromInput(storeFilters.dateFrom);
      if (storeFilters.dateTo !== undefined)
        setDateToInput(storeFilters.dateTo);
      if (storeFilters.productId !== undefined)
        setProductInput(String(storeFilters.productId));
      if (storeFilters.accountId !== undefined)
        setAccountInput(String(storeFilters.accountId));
    }
  }, [storeFilters]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Warehouse state ─────────────────────────────
  const [warehouseOptions, setWarehouseOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [warehousesError, setWarehousesError] = useState<string | null>(null);

  // ── Construction site state ─────────────────────
  const [constructionSiteOptions, setConstructionSiteOptions] = useState<
    IconSelectOption[]
  >([]);
  const [loadingConstructionSites, setLoadingConstructionSites] =
    useState(false);
  const [constructionSitesError, setConstructionSitesError] = useState<
    string | null
  >(null);

  // ── Product state ───────────────────────────────
  const [productOptions, setProductOptions] = useState<IconSelectOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ── Account state ───────────────────────────────
  const [accountOptions, setAccountOptions] = useState<IconSelectOption[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // ── Load warehouses on mount ────────────────────
  useEffect(() => {
    loadWarehousesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load construction sites on mount ────────────
  useEffect(() => {
    loadConstructionSitesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load products on mount ──────────────────────
  useEffect(() => {
    loadProductsFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load accounts on mount ──────────────────────
  useEffect(() => {
    loadAccountsFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API loaders ─────────────────────────────────

  const loadWarehousesFromApi = async () => {
    setLoadingWarehouses(true);
    setWarehousesError(null);

    try {
      const response = await getAllWarehouses();
      const items = response.data;
      setWarehouseOptions(items.map((w) => ({ value: w.id, label: w.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setWarehousesError(
            apiMessage || "Erreur lors du chargement des dépôts",
          );
        } else {
          setWarehousesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setWarehousesError("Erreur lors du chargement des dépôts");
      }
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const loadConstructionSitesFromApi = async () => {
    setLoadingConstructionSites(true);
    setConstructionSitesError(null);

    try {
      const response = await getAllConstructionSites();
      const items = response.data;
      setConstructionSiteOptions(
        items.map((s) => ({ value: s.id, label: s.name })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setConstructionSitesError(
            apiMessage || "Erreur lors du chargement des chantiers",
          );
        } else {
          setConstructionSitesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setConstructionSitesError("Erreur lors du chargement des chantiers");
      }
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setProductsError(
            apiMessage || "Erreur lors du chargement des produits",
          );
        } else {
          setProductsError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setProductsError("Erreur lors du chargement des produits");
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  // ── Product search (triggered on Enter key) ────
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setProductsError(
            apiMessage || "Erreur lors de la recherche des produits",
          );
        } else {
          setProductsError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setProductsError("Erreur lors de la recherche des produits");
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  // ── Account loader (only product_keepers) ───────
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
      const items = response.data.items;
      setAccountOptions(
        items.map((a) => ({
          value: a.id,
          label: `${a.firstname} ${a.lastname} (${a.username})`,
        })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setAccountsError(
            apiMessage || "Erreur lors du chargement des comptes",
          );
        } else {
          setAccountsError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setAccountsError("Erreur lors du chargement des comptes");
      }
    } finally {
      setLoadingAccounts(false);
    }
  };

  // ── Account search (triggered on Enter key) ─────
  const handleAccountSearch = async (query: string) => {
    await loadAccountsFromApi(query);
  };

  // ── Build filters from local inputs ─────────────
  const buildFilterFromInputs = useCallback((): ExportFilters => {
    const filters: ExportFilters = {};

    if (exportTypeInput.trim()) {
      filters.exportType = exportTypeInput.trim() as ExportType;
    }
    if (warehouseInput.trim()) {
      filters.warehouseId = Number(warehouseInput);
    }
    if (constructionSiteInput.trim()) {
      filters.constructionSiteId = Number(constructionSiteInput);
    }
    if (dateFromInput.trim()) {
      filters.dateFrom = dateFromInput.trim();
    }
    if (dateToInput.trim()) {
      filters.dateTo = dateToInput.trim();
    }
    if (productInput.trim()) {
      filters.productId = Number(productInput);
    }
    if (accountInput.trim()) {
      filters.accountId = Number(accountInput);
    }

    return filters;
  }, [
    exportTypeInput,
    warehouseInput,
    constructionSiteInput,
    dateFromInput,
    dateToInput,
    productInput,
    accountInput,
  ]);

  // ── Apply filters ───────────────────────────────
  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = buildFilterFromInputs();
      await useConfirmedExportStore.getState().applyFilters(filters);
      toast.success("Filtres appliqués avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (!err.response) {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          setError("Erreur lors de l'application des filtres");
        }
      } else {
        setError("Erreur lors de l'application des filtres");
      }
    } finally {
      setIsLoading(false);
    }
  }, [buildFilterFromInputs, onClose]);

  // ── Reset filters ───────────────────────────────
  const handleReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Clear local inputs
    setExportTypeInput("");
    setWarehouseInput("");
    setConstructionSiteInput("");
    setDateFromInput("");
    setDateToInput("");
    setProductInput("");
    setAccountInput("");

    try {
      await useConfirmedExportStore.getState().clearFilters();
      toast.success("Filtres réinitialisés avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (!err.response) {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        } else {
          setError("Erreur lors de la réinitialisation des filtres");
        }
      } else {
        setError("Erreur lors de la réinitialisation des filtres");
      }
    } finally {
      setIsLoading(false);
    }
  }, [onClose]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Local form state
    exportTypeInput,
    setExportTypeInput,
    warehouseInput,
    setWarehouseInput,
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

    // Warehouse
    warehouseOptions,
    loadingWarehouses,
    warehousesError,

    // Construction site
    constructionSiteOptions,
    loadingConstructionSites,
    constructionSitesError,

    // Product
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,

    // Account
    accountOptions,
    loadingAccounts,
    accountsError,
    handleAccountSearch,

    // Actions
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  };
}
