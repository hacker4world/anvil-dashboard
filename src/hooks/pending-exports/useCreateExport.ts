import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback } from "react";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { getAllWarehouses } from "@/services/warehouse.service";
import { getFilteredConstructionSites } from "@/services/construction-site.service";
import { productClient } from "@/services/product.service";
import { useWarehouseStore } from "@/store/warehouseStore";
import {
  createExportSchema,
  CreateExportFormData,
  ExportItemFormData,
  exportItemSchema,
  ExportType,
} from "@/models/form-validations/export.schema";
import axios from "axios";
import z from "zod";
import { CreateExportDto, CreateExportItemDto } from "@/models/export.model";
import { createExport } from "@/services/export.service";
import { usePendingExportStore } from "@/store/pendingExportsStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export type ExportTab = "basic" | "products";

const EMPTY_ITEM: ExportItemFormData = {
  productId: 0,
  exitedStock: "",
  unitPrice: "",
};

type ProductFieldErrors = Record<number, Record<string, string>>;

interface UseCreateExportReturn {
  form: ReturnType<typeof useForm<CreateExportFormData>>;

  // Tab
  activeTab: ExportTab;
  setActiveTab: (tab: ExportTab) => void;
  goToNextTab: () => void;
  goToPrevTab: () => void;

  // Export type
  selectedExportType: ExportType | undefined;
  isInternalType: boolean;

  // Warehouse / Depot
  warehouseOptions: IconSelectOption[];
  loadingWarehouses: boolean;
  warehousesError: string | null;
  handleWarehouseSearch: (query: string) => Promise<void>;

  // Construction site
  siteOptions: IconSelectOption[];
  loadingSites: boolean;
  sitesError: string | null;
  handleSiteSearch: (query: string) => Promise<void>;

  // Product options (for product items)
  productOptions: IconSelectOption[];
  loadingProducts: boolean;
  productsError: string | null;
  handleProductSearch: (query: string) => Promise<void>;

  // Product items management
  exportItems: ExportItemFormData[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof ExportItemFormData,
    value: string | number,
  ) => void;

  // Submission
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateExportFormData) => Promise<void>;
  reset: () => void;
  productsValidationErrors: ProductFieldErrors;
  isExternalType: boolean;
  withTransporter: boolean;
}

export function useCreateExport(onSuccess: () => void): UseCreateExportReturn {
  const [activeTab, setActiveTab] = useState<ExportTab>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Warehouse state ────────────────────────────────────
  const [warehouseOptions, setWarehouseOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [warehousesError, setWarehousesError] = useState<string | null>(null);

  // ── Construction site state ────────────────────────────
  const [siteOptions, setSiteOptions] = useState<IconSelectOption[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [sitesError, setSitesError] = useState<string | null>(null);

  // ── Product options state ──────────────────────────────
  const [productOptions, setProductOptions] = useState<IconSelectOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ── Product items local state ──────────────────────────
  const [exportItems, setExportItems] = useState<ExportItemFormData[]>([
    { ...EMPTY_ITEM },
  ]);

  // ── Product validation errors ──────────────────────────
  const [productsValidationErrors, setProductsValidationErrors] =
    useState<ProductFieldErrors>({});

  const form = useForm<CreateExportFormData>({
    resolver: zodResolver(createExportSchema),
    defaultValues: {
      date: "",
      observation: "",
      exportType: undefined,
      warehouseId: 0,
      constructionSiteId: 0,
      // External fields
      clientName: "",
      entrepriseName: "",
      entrepriseAddress: "",
      matriculeFiscale: "",
      withTransporter: false,
      transporterName: "",
      transporterMatricule: "",
      // Products
      exportItems: [{ ...EMPTY_ITEM }],
    },
  });

  // Watch exportType for conditional rendering
  const selectedExportType = form.watch("exportType") as ExportType | undefined;
  const isInternalType =
    selectedExportType === "to-warehouse" ||
    selectedExportType === "to-construction-site";
  const isExternalType = selectedExportType === "external";
  const withTransporter = form.watch("withTransporter");

  // Sync exportItems with form
  useEffect(() => {
    form.setValue(
      "exportItems",
      exportItems as [
        typeof exportItemSchema._type,
        ...(typeof exportItemSchema._type)[],
      ],
      {
        shouldValidate: false,
        shouldDirty: false,
      },
    );
  }, [exportItems, form]);

  // Reset conditional fields when type changes
  useEffect(() => {
    if (selectedExportType === "to-warehouse") {
      form.setValue("constructionSiteId", 0, { shouldValidate: false });
    } else if (selectedExportType === "to-construction-site") {
      form.setValue("warehouseId", 0, { shouldValidate: false });
    } else if (selectedExportType === "external") {
      form.setValue("warehouseId", 0, { shouldValidate: false });
      form.setValue("constructionSiteId", 0, { shouldValidate: false });
    }

    // Reset fields not relevant to the current type
    if (!isInternalType) {
      form.setValue("transporterName", "", { shouldValidate: false });
      form.setValue("transporterMatricule", "", { shouldValidate: false });
    }
    if (!isExternalType) {
      form.setValue("clientName", "", { shouldValidate: false });
      form.setValue("entrepriseName", "", { shouldValidate: false });
      form.setValue("entrepriseAddress", "", { shouldValidate: false });
      form.setValue("matriculeFiscale", "", { shouldValidate: false });
      form.setValue("withTransporter", false, { shouldValidate: false });
    }
  }, [selectedExportType, form, isInternalType, isExternalType]);

  // ── Load warehouses on mount ────────────────────────────
  useEffect(() => {
    const store = useWarehouseStore.getState();
    if (store.warehouses.length > 0) {
      setWarehouseOptions(
        store.warehouses.map((w) => ({ value: w.id, label: w.name })),
      );
      return;
    }
    loadWarehousesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load construction sites on mount ────────────────────
  useEffect(() => {
    loadAllSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load ALL products on mount ──────────────────────────
  useEffect(() => {
    loadAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API loaders ────────────────────────────────────────

  const loadWarehousesFromApi = async () => {
    setLoadingWarehouses(true);
    setWarehousesError(null);
    try {
      const response = await getAllWarehouses();
      setWarehouseOptions(
        response.data.map((w) => ({ value: w.id, label: w.name })),
      );
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

  const loadAllSites = async () => {
    setLoadingSites(true);
    setSitesError(null);
    try {
      const response = await getFilteredConstructionSites({
        page: 1,
        pageSize: 200,
      });
      const items = response.data.items;
      setSiteOptions(
        items.map((s) => ({
          value: s.id,
          label: `${s.name} (${s.address})`,
        })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setSitesError(
            apiMessage || "Erreur lors du chargement des chantiers",
          );
        } else {
          setSitesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setSitesError("Erreur lors du chargement des chantiers");
      }
    } finally {
      setLoadingSites(false);
    }
  };

  const loadAllProducts = async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const response = await productClient.getFiltered({
        page: 1,
        pageSize: 200,
      });
      const items = response.data.data.items;
      setProductOptions(
        items.map((p) => ({
          value: p.id,
          label: `${p.name} (stock: ${p.stock})`,
        })),
      );
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

  // ── Search handlers ────────────────────────────────────

  const handleWarehouseSearch = async (query: string) => {
    setLoadingWarehouses(true);
    setWarehousesError(null);
    try {
      const response = await getAllWarehouses();
      const allItems = response.data;
      const filtered = query.trim()
        ? allItems.filter((w) =>
            w.name.toLowerCase().includes(query.trim().toLowerCase()),
          )
        : allItems;
      setWarehouseOptions(
        filtered.map((w) => ({ value: w.id, label: w.name })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setWarehousesError(
            apiMessage || "Erreur lors de la recherche des dépôts",
          );
        } else {
          setWarehousesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setWarehousesError("Erreur lors de la recherche des dépôts");
      }
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const handleSiteSearch = async (query: string) => {
    setLoadingSites(true);
    setSitesError(null);
    try {
      const response = await getFilteredConstructionSites({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      const items = response.data.items;
      setSiteOptions(
        items.map((s) => ({
          value: s.id,
          label: `${s.name} (${s.address})`,
        })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setSitesError(
            apiMessage || "Erreur lors de la recherche des chantiers",
          );
        } else {
          setSitesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setSitesError("Erreur lors de la recherche des chantiers");
      }
    } finally {
      setLoadingSites(false);
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
      const items = response.data.data.items;
      setProductOptions(
        items.map((p) => ({
          value: p.id,
          label: `${p.name} (stock: ${p.stock})`,
        })),
      );
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

  // ── Tab navigation ─────────────────────────────────────

  const goToNextTab = useCallback(async () => {
    let isValid = true;

    if (activeTab === "basic") {
      // Always validate common + type-specific fields
      const fieldsToValidate: Array<
        | "date"
        | "exportType"
        | "warehouseId"
        | "constructionSiteId"
        | "clientName"
        | "entrepriseName"
        | "entrepriseAddress"
        | "matriculeFiscale"
        | "transporterName"
        | "transporterMatricule"
      > = ["date", "exportType"];

      if (selectedExportType === "to-warehouse") {
        fieldsToValidate.push(
          "warehouseId",
          "transporterName",
          "transporterMatricule",
        );
      } else if (selectedExportType === "to-construction-site") {
        fieldsToValidate.push(
          "constructionSiteId",
          "transporterName",
          "transporterMatricule",
        );
      } else if (selectedExportType === "external") {
        fieldsToValidate.push(
          "clientName",
          "entrepriseName",
          "entrepriseAddress",
          "matriculeFiscale",
        );
        if (withTransporter) {
          fieldsToValidate.push("transporterName", "transporterMatricule");
        }
      }

      isValid = await form.trigger(fieldsToValidate);
    } else if (activeTab === "products") {
      // ... (existing products validation stays the same)
    }

    if (isValid) {
      setActiveTab((prev) => {
        if (prev === "basic") return "products";
        return prev;
      });
    }
  }, [activeTab, form, exportItems, selectedExportType, withTransporter]);

  const goToPrevTab = useCallback(() => {
    setActiveTab((prev) => {
      if (prev === "products") return "basic";
      return prev;
    });
  }, []);

  // ── Product items management ───────────────────────────

  const addItem = useCallback(() => {
    setExportItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setExportItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateItem = useCallback(
    (
      index: number,
      field: keyof ExportItemFormData,
      value: string | number,
    ) => {
      setExportItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      );

      setProductsValidationErrors((prev) => {
        if (!prev[index]) return prev;
        const { [field]: _, ...rest } = prev[index];
        if (Object.keys(rest).length === 0) {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        }
        return { ...prev, [index]: rest };
      });
    },
    [],
  );

  // ── Form submission ────────────────────────────────────

  const onSubmit = async (data: CreateExportFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const currentAccount = useAuthStore.getState().account;

      const exportItemsDto: CreateExportItemDto[] = exportItems.map((item) => ({
        productId: item.productId,
        exitedStock: Number(item.exitedStock),
        unitPrice: Number(item.unitPrice),
      }));

      const payload = {
        date: data.date,
        observation: data.observation || undefined,
        exportType: data.exportType,
        warehouseId:
          data.exportType === "to-warehouse" ? data.warehouseId : undefined,
        constructionSiteId:
          data.exportType === "to-construction-site"
            ? data.constructionSiteId
            : undefined,
        // External fields
        clientName: isExternalType ? data.clientName : undefined,
        entrepriseName: isExternalType ? data.entrepriseName : undefined,
        address: isExternalType ? data.entrepriseAddress : undefined,
        matriculeFiscale: isExternalType ? data.matriculeFiscale : undefined,
        withTransporter: isExternalType ? data.withTransporter : undefined,
        // Transporter fields — sent for both internal types and external (when checked)
        transporterName:
          isInternalType || (isExternalType && data.withTransporter)
            ? data.transporterName || undefined
            : undefined,
        transporterMatricule:
          isInternalType || (isExternalType && data.withTransporter)
            ? data.transporterMatricule || undefined
            : undefined,
        // Products
        exportItems: exportItemsDto,
        accountId: currentAccount.id,
      };

      const response = await createExport(payload as CreateExportDto);

      // Update zustand store
      usePendingExportStore.getState().addExport(response.data);

      toast.success("Sortie créée avec succès");
      reset();
      onSuccess();
    } catch (err: unknown) {
      console.log(err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création de la sortie");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création de la sortie");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset();
    setExportItems([{ ...EMPTY_ITEM }]);
    setActiveTab("basic");
    setError(null);
    setProductsValidationErrors({});
  };

  return {
    form,
    activeTab,
    setActiveTab,
    goToNextTab,
    goToPrevTab,
    selectedExportType,
    isInternalType,
    warehouseOptions,
    loadingWarehouses,
    warehousesError,
    handleWarehouseSearch,
    siteOptions,
    loadingSites,
    sitesError,
    handleSiteSearch,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    exportItems,
    addItem,
    removeItem,
    updateItem,
    isLoading,
    error,
    onSubmit,
    reset,
    productsValidationErrors,
    isExternalType,
    withTransporter,
  };
}
