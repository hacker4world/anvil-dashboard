import { useState, useEffect, useCallback } from "react";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { useConfirmedImportStore } from "@/store/confirmedImportsStore";
import { ImportFilters } from "@/models/import-export.dtos";
import { getAllSuppliers } from "@/services/supplier.service";
import { getAllManufacturers } from "@/services/manufacturer.service";
import { productClient } from "@/services/product.service";
import { productToArticleModel } from "@/models/Product.model";
import { listAccounts } from "@/services/account.service";
import { AccountRole } from "@/models/Account.model";
import axios from "axios";
import { toast } from "sonner";

interface UseFilterConfirmedImportsModalReturn {
  // Local form state
  supplierInput: string;
  setSupplierInput: (value: string) => void;
  manufacturerInput: string;
  setManufacturerInput: (value: string) => void;
  dateFromInput: string;
  setDateFromInput: (value: string) => void;
  dateToInput: string;
  setDateToInput: (value: string) => void;
  productInput: string;
  setProductInput: (value: string) => void;
  unitPriceFromInput: string;
  setUnitPriceFromInput: (value: string) => void;
  unitPriceToInput: string;
  setUnitPriceToInput: (value: string) => void;
  enteredStockFromInput: string;
  setEnteredStockFromInput: (value: string) => void;
  enteredStockToInput: string;
  setEnteredStockToInput: (value: string) => void;
  accountInput: string;
  setAccountInput: (value: string) => void;

  // Supplier options
  supplierOptions: IconSelectOption[];
  loadingSuppliers: boolean;
  suppliersError: string | null;

  // Manufacturer options
  manufacturerOptions: IconSelectOption[];
  loadingManufacturers: boolean;
  manufacturersError: string | null;

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

export function useFilterConfirmedImportsModal(
  onClose: () => void,
): UseFilterConfirmedImportsModalReturn {
  const storeFilters = useConfirmedImportStore((s) => s.filters);

  // ── Local form state ────────────────────────────
  const [supplierInput, setSupplierInput] = useState("");
  const [manufacturerInput, setManufacturerInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [unitPriceFromInput, setUnitPriceFromInput] = useState("");
  const [unitPriceToInput, setUnitPriceToInput] = useState("");
  const [enteredStockFromInput, setEnteredStockFromInput] = useState("");
  const [enteredStockToInput, setEnteredStockToInput] = useState("");
  const [accountInput, setAccountInput] = useState("");

  // ── Initialise local state from existing store filters ──
  useEffect(() => {
    if (storeFilters) {
      if (storeFilters.supplierId !== undefined)
        setSupplierInput(String(storeFilters.supplierId));
      if (storeFilters.manufacturerId !== undefined)
        setManufacturerInput(String(storeFilters.manufacturerId));
      if (storeFilters.dateFrom !== undefined)
        setDateFromInput(storeFilters.dateFrom);
      if (storeFilters.dateTo !== undefined)
        setDateToInput(storeFilters.dateTo);
      if (storeFilters.productId !== undefined)
        setProductInput(String(storeFilters.productId));
      if (storeFilters.unitPriceFrom !== undefined)
        setUnitPriceFromInput(String(storeFilters.unitPriceFrom));
      if (storeFilters.unitPriceTo !== undefined)
        setUnitPriceToInput(String(storeFilters.unitPriceTo));
      if (storeFilters.enteredStockFrom !== undefined)
        setEnteredStockFromInput(String(storeFilters.enteredStockFrom));
      if (storeFilters.enteredStockTo !== undefined)
        setEnteredStockToInput(String(storeFilters.enteredStockTo));
      if (storeFilters.accountId !== undefined)
        setAccountInput(String(storeFilters.accountId));
    }
  }, [storeFilters]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Supplier state ──────────────────────────────
  const [supplierOptions, setSupplierOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);

  // ── Manufacturer state ──────────────────────────
  const [manufacturerOptions, setManufacturerOptions] = useState<
    IconSelectOption[]
  >([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(false);
  const [manufacturersError, setManufacturersError] = useState<string | null>(
    null,
  );

  // ── Product state ───────────────────────────────
  const [productOptions, setProductOptions] = useState<IconSelectOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ── Account state ───────────────────────────────
  const [accountOptions, setAccountOptions] = useState<IconSelectOption[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // ── Load suppliers on mount ─────────────────────
  useEffect(() => {
    loadSuppliersFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load manufacturers on mount ─────────────────
  useEffect(() => {
    loadManufacturersFromApi();
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

  const loadSuppliersFromApi = async () => {
    setLoadingSuppliers(true);
    setSuppliersError(null);

    try {
      const response = await getAllSuppliers();
      const items = response.data;
      setSupplierOptions(items.map((s) => ({ value: s.id, label: s.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setSuppliersError(
            apiMessage || "Erreur lors du chargement des fournisseurs",
          );
        } else {
          setSuppliersError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setSuppliersError("Erreur lors du chargement des fournisseurs");
      }
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const loadManufacturersFromApi = async () => {
    setLoadingManufacturers(true);
    setManufacturersError(null);

    try {
      const response = await getAllManufacturers();
      const items = response.data;
      setManufacturerOptions(
        items.map((m) => ({ value: m.id, label: m.name })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setManufacturersError(
            apiMessage || "Erreur lors du chargement des fabricants",
          );
        } else {
          setManufacturersError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setManufacturersError("Erreur lors du chargement des fabricants");
      }
    } finally {
      setLoadingManufacturers(false);
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
  const buildFilterFromInputs = useCallback((): ImportFilters => {
    const filters: ImportFilters = {};

    if (supplierInput.trim()) {
      filters.supplierId = Number(supplierInput);
    }
    if (manufacturerInput.trim()) {
      filters.manufacturerId = Number(manufacturerInput);
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
    if (unitPriceFromInput.trim()) {
      filters.unitPriceFrom = Number(unitPriceFromInput);
    }
    if (unitPriceToInput.trim()) {
      filters.unitPriceTo = Number(unitPriceToInput);
    }
    if (enteredStockFromInput.trim()) {
      filters.enteredStockFrom = Number(enteredStockFromInput);
    }
    if (enteredStockToInput.trim()) {
      filters.enteredStockTo = Number(enteredStockToInput);
    }
    if (accountInput.trim()) {
      filters.accountId = Number(accountInput);
    }

    return filters;
  }, [
    supplierInput,
    manufacturerInput,
    dateFromInput,
    dateToInput,
    productInput,
    unitPriceFromInput,
    unitPriceToInput,
    enteredStockFromInput,
    enteredStockToInput,
    accountInput,
  ]);

  // ── Apply filters ───────────────────────────────
  const handleApply = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = buildFilterFromInputs();
      await useConfirmedImportStore.getState().applyFilters(filters);
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
    setSupplierInput("");
    setManufacturerInput("");
    setDateFromInput("");
    setDateToInput("");
    setProductInput("");
    setUnitPriceFromInput("");
    setUnitPriceToInput("");
    setEnteredStockFromInput("");
    setEnteredStockToInput("");
    setAccountInput("");

    try {
      await useConfirmedImportStore.getState().clearFilters();
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
    supplierInput,
    setSupplierInput,
    manufacturerInput,
    setManufacturerInput,
    dateFromInput,
    setDateFromInput,
    dateToInput,
    setDateToInput,
    productInput,
    setProductInput,
    unitPriceFromInput,
    setUnitPriceFromInput,
    unitPriceToInput,
    setUnitPriceToInput,
    enteredStockFromInput,
    setEnteredStockFromInput,
    enteredStockToInput,
    setEnteredStockToInput,
    accountInput,
    setAccountInput,

    // Supplier
    supplierOptions,
    loadingSuppliers,
    suppliersError,

    // Manufacturer
    manufacturerOptions,
    loadingManufacturers,
    manufacturersError,

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
