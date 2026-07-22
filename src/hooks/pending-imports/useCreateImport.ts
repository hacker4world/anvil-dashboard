// /src/hooks/pending-imports/useCreateImport.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback } from "react";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import {
  getAllSuppliers,
  getFilteredSuppliers,
} from "@/services/supplier.service";
import {
  getAllManufacturers,
  getFilteredManufacturers,
} from "@/services/manufacturer.service";
import { productClient } from "@/services/product.service";
import { useSupplierStore } from "@/store/supplierStore";
import { useManufacturerStore } from "@/store/manufacturerStore";
import {
  createImportSchema,
  CreateImportFormData,
  ImportItemFormData,
  importItemSchema,
} from "@/models/form-validations/import.schema";
import axios from "axios";
import z from "zod";
import { CreateImportItemDto } from "@/models/import-export.dtos";
import { createImport } from "@/services/import-export.service";
import { usePendingImportStore } from "@/store/pendingImportStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export type ImportTab = "basic" | "products" | "documents";

const EMPTY_ITEM: ImportItemFormData = {
  productId: 0,
  enteredStock: "",
  unitPrice: "",
};

type ProductFieldErrors = Record<number, Record<string, string>>;

interface UseCreateImportReturn {
  form: ReturnType<typeof useForm<CreateImportFormData>>;

  // Tab
  activeTab: ImportTab;
  setActiveTab: (tab: ImportTab) => void;
  goToNextTab: () => void;
  goToPrevTab: () => void;

  // Supplier
  supplierOptions: IconSelectOption[];
  loadingSuppliers: boolean;
  suppliersError: string | null;
  handleSupplierSearch: (query: string) => Promise<void>;

  // Manufacturer
  manufacturerOptions: IconSelectOption[];
  loadingManufacturers: boolean;
  manufacturersError: string | null;
  handleManufacturerSearch: (query: string) => Promise<void>;

  // Product options (for product items)
  productOptions: IconSelectOption[];
  loadingProducts: boolean;
  productsError: string | null;
  handleProductSearch: (query: string) => Promise<void>;

  // Product items management
  importItems: ImportItemFormData[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof ImportItemFormData,
    value: string | number,
  ) => void;

  // Files
  bonDeCommandeFile: File | null;
  bonDeLivraisonFile: File | null;
  setBonDeCommandeFile: (file: File | null) => void;
  setBonDeLivraisonFile: (file: File | null) => void;

  // Submission
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateImportFormData) => Promise<void>;
  reset: () => void;
  productsValidationErrors: ProductFieldErrors;
  documentsError: string | null;
}

export function useCreateImport(onSuccess: () => void): UseCreateImportReturn {
  const [activeTab, setActiveTab] = useState<ImportTab>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Supplier state ──────────────────────────────────────
  const [supplierOptions, setSupplierOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);

  // ── Manufacturer state ──────────────────────────────────
  const [manufacturerOptions, setManufacturerOptions] = useState<
    IconSelectOption[]
  >([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(false);
  const [manufacturersError, setManufacturersError] = useState<string | null>(
    null,
  );

  // ── Product options state ───────────────────────────────
  const [productOptions, setProductOptions] = useState<IconSelectOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ── Product items local state ───────────────────────────
  const [importItems, setImportItems] = useState<ImportItemFormData[]>([
    { ...EMPTY_ITEM },
  ]);

  // ── Files state ─────────────────────────────────────────
  const [bonDeCommandeFile, setBonDeCommandeFile] = useState<File | null>(null);
  const [bonDeLivraisonFile, setBonDeLivraisonFile] = useState<File | null>(
    null,
  );

  // Add this after the other state declarations
  const [productsValidationError, setProductsValidationError] = useState<
    string | null
  >(null);

  const [productsValidationErrors, setProductsValidationErrors] =
    useState<ProductFieldErrors>({});

  const [documentsError, setDocumentsError] = useState<string | null>(null);

  const form = useForm<CreateImportFormData>({
    resolver: zodResolver(createImportSchema),
    defaultValues: {
      date: "",
      observation: "",
      supplierId: 0,
      manufacturerId: 0,
      importItems: [{ ...EMPTY_ITEM }],
    },
  });

  useEffect(() => {
    form.setValue(
      "importItems",
      importItems as [
        typeof importItemSchema._type,
        ...(typeof importItemSchema._type)[],
      ],
      {
        shouldValidate: false,
        shouldDirty: false,
      },
    );
  }, [importItems, form]);

  // ── Load suppliers on mount ─────────────────────────────
  useEffect(() => {
    const store = useSupplierStore.getState();
    if (store.suppliers.length > 0) {
      setSupplierOptions(
        store.suppliers.map((s) => ({ value: s.id, label: s.name })),
      );
      return;
    }
    loadSuppliersFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load manufacturers on mount ─────────────────────────
  useEffect(() => {
    const store = useManufacturerStore.getState();
    if (store.manufacturers.length > 0) {
      setManufacturerOptions(
        store.manufacturers.map((m) => ({ value: m.id, label: m.name })),
      );
      return;
    }
    loadManufacturersFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load ALL products on mount (initial list) ───────────
  useEffect(() => {
    loadAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API loaders ─────────────────────────────────────────

  const loadSuppliersFromApi = async () => {
    setLoadingSuppliers(true);
    setSuppliersError(null);
    try {
      const response = await getAllSuppliers();
      setSupplierOptions(
        response.data.map((s) => ({ value: s.id, label: s.name })),
      );
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
      setManufacturerOptions(
        response.data.map((m) => ({ value: m.id, label: m.name })),
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

  // Loads all products in one go — initial list before any search
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

  // ── Search handlers (triggered on Enter key via onSearch) ──

  const handleSupplierSearch = async (query: string) => {
    setLoadingSuppliers(true);
    setSuppliersError(null);
    try {
      const response = await getFilteredSuppliers({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      setSupplierOptions(
        response.data.items.map((s) => ({ value: s.id, label: s.name })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setSuppliersError(
            apiMessage || "Erreur lors de la recherche des fournisseurs",
          );
        } else {
          setSuppliersError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setSuppliersError("Erreur lors de la recherche des fournisseurs");
      }
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleManufacturerSearch = async (query: string) => {
    setLoadingManufacturers(true);
    setManufacturersError(null);
    try {
      const response = await getFilteredManufacturers({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      setManufacturerOptions(
        response.data.items.map((m) => ({ value: m.id, label: m.name })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setManufacturersError(
            apiMessage || "Erreur lors de la recherche des fabricants",
          );
        } else {
          setManufacturersError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setManufacturersError("Erreur lors de la recherche des fabricants");
      }
    } finally {
      setLoadingManufacturers(false);
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

  // ── Tab navigation ──────────────────────────────────────
  const goToNextTab = useCallback(async () => {
    let isValid = true;

    if (activeTab === "basic") {
      isValid = await form.trigger(["date", "supplierId", "manufacturerId"]);
    } else if (activeTab === "products") {
      const result = z.array(importItemSchema).safeParse(importItems);
      if (!result.success) {
        isValid = false;
        // Parse Zod issues into per-item, per-field errors
        const fieldErrors: ProductFieldErrors = {};
        for (const issue of result.error.issues) {
          const path = issue.path;
          if (path.length >= 2) {
            const itemIndex = path[0] as number;
            const fieldName = path[1] as string;
            if (!fieldErrors[itemIndex]) {
              fieldErrors[itemIndex] = {};
            }
            // Only set the first error per field (Zod may return multiple)
            if (!fieldErrors[itemIndex][fieldName]) {
              fieldErrors[itemIndex][fieldName] = issue.message;
            }
          }
        }
        setProductsValidationErrors(fieldErrors);
      } else {
        setProductsValidationErrors({});
      }
    }

    if (isValid) {
      setActiveTab((prev) => {
        if (prev === "basic") return "products";
        if (prev === "products") return "documents";
        return prev;
      });
    }
  }, [activeTab, form, importItems]);

  const goToPrevTab = useCallback(() => {
    setActiveTab((prev) => {
      if (prev === "documents") return "products";
      if (prev === "products") return "basic";
      return prev;
    });
  }, []);

  // ── Product items management ────────────────────────────
  const addItem = useCallback(() => {
    setImportItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setImportItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateItem = useCallback(
    (
      index: number,
      field: keyof ImportItemFormData,
      value: string | number,
    ) => {
      setImportItems((prev) =>
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

  // ── Form submission (placeholder) ───────────────────────
  const onSubmit = async (data: CreateImportFormData) => {
    setError(null);

    if (!bonDeCommandeFile && !bonDeLivraisonFile) {
      setDocumentsError(
        "Veuillez joindre au moins un document (bon de commande ou bon de livraison).",
      );
      return;
    }

    setIsLoading(true);

    try {
      const currentAccount = useAuthStore.getState().account;

      // Convert form items to DTO format (strings → numbers)
      const importItemsDto: CreateImportItemDto[] = importItems.map((item) => ({
        productId: item.productId,
        enteredStock: Number(item.enteredStock),
        unitPrice: Number(item.unitPrice),
      }));

      const payload = {
        date: data.date,
        observation: data.observation || undefined,
        supplierId: data.supplierId,
        manufacturerId: data.manufacturerId,
        importItems: importItemsDto,
        accountId: currentAccount.id,
      };

      const files = {
        ...(bonDeCommandeFile ? { bonDeCommande: bonDeCommandeFile } : {}),
        ...(bonDeLivraisonFile ? { bonDeLivraison: bonDeLivraisonFile } : {}),
      };

      const response = await createImport(
        payload,

        Object.keys(files).length > 0 ? files : undefined,
      );

      // Update zustand store with the newly created import
      usePendingImportStore.getState().addImport(response.data);

      toast.success("Entrée créée avec succès");
      reset();
      onSuccess();
    } catch (err: unknown) {
      console.log(err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création de l'entrée");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création de l'entrée");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset();
    setImportItems([{ ...EMPTY_ITEM }]);
    setBonDeCommandeFile(null);
    setBonDeLivraisonFile(null);
    setActiveTab("basic");
    setError(null);
    setProductsValidationError(null);

    setProductsValidationErrors({});
    setDocumentsError(null);
  };

  return {
    form,
    activeTab,
    setActiveTab,
    goToNextTab,
    goToPrevTab,
    supplierOptions,
    loadingSuppliers,
    suppliersError,
    handleSupplierSearch,
    manufacturerOptions,
    loadingManufacturers,
    manufacturersError,
    handleManufacturerSearch,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    importItems,
    addItem,
    removeItem,
    updateItem,
    bonDeCommandeFile,
    bonDeLivraisonFile,
    setBonDeCommandeFile,
    setBonDeLivraisonFile,
    isLoading,
    productsValidationErrors,
    error,
    onSubmit,
    reset,
    documentsError,
  };
}
