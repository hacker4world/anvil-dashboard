import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useUnitStore } from "@/store/unitStore";
import { useWarehouseStore } from "@/store/warehouseStore";
import { useCategoryStore } from "@/store/categoryStore";
import { getAllUnits } from "@/services/unit.service";
import { getAllWarehouses } from "@/services/warehouse.service";
import { getFilteredCategories } from "@/services/category.service";
import { mapToCategoryModel } from "@/models/Category.model";
import { productClient } from "@/services/product.service";
import {
  productToArticleModel,
  UpdateProductRequest,
  ArticleModel,
} from "@/models/Product.model";
import { useProductStore } from "@/store/productStore";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";

const updateProductSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  currentStock: z.string().min(1, "Le stock minimum est requis"),
  warehouseId: z.string().min(1, "Le dépôt est requis"),
  unitId: z.string().min(1, "L'unité est requise"),
  categoryId: z.string().min(1, "La catégorie est requise"),
});

type UpdateProductFormData = z.infer<typeof updateProductSchema>;

interface UseProductDetailsReturn {
  form: ReturnType<typeof useForm<UpdateProductFormData>>;
  isLoading: boolean;
  error: string | null;

  // Unit
  unitOptions: IconSelectOption[];
  loadingUnits: boolean;
  unitsError: string | null;

  // Warehouse
  warehouseOptions: IconSelectOption[];
  loadingWarehouses: boolean;
  warehousesError: string | null;

  // Category
  categoryOptions: IconSelectOption[];
  loadingCategories: boolean;
  categoriesError: string | null;
  handleCategorySearch: (query: string) => Promise<void>;
  setError: any;

  // Actions
  onSubmit: (data: UpdateProductFormData) => Promise<void>;
  reset: () => void;
}

export function useProductDetails(
  article: ArticleModel | null,
  onSuccess: () => void,
): UseProductDetailsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Unit state ──────────────────────────────────────────
  const [unitOptions, setUnitOptions] = useState<IconSelectOption[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [unitsError, setUnitsError] = useState<string | null>(null);

  // ── Warehouse state ─────────────────────────────────────
  const [warehouseOptions, setWarehouseOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [warehousesError, setWarehousesError] = useState<string | null>(null);

  // ── Category state ──────────────────────────────────────
  const [categoryOptions, setCategoryOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: "",
      currentStock: "",
      warehouseId: "",
      unitId: "",
      categoryId: "",
    },
  });

  // ── Populate form when article changes ─────────────────
  useEffect(() => {
    if (article) {
      form.reset({
        name: article.name,
        currentStock: String(article.currentStock),
        warehouseId: String(article.warehouseId),
        unitId: String(article.unitId),
        categoryId: String(article.categoryId),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  // ── Load units on mount ─────────────────────────────────
  useEffect(() => {
    const store = useUnitStore.getState();

    if (store.units.length > 0) {
      setUnitOptions(store.units.map((u) => ({ value: u.id, label: u.name })));
      return;
    }

    loadUnitsFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ── Load categories on mount ────────────────────────────
  useEffect(() => {
    const store = useCategoryStore.getState();

    if (store.categories.length > 0) {
      setCategoryOptions(
        store.categories.map((c) => ({ value: c.id, label: c.name })),
      );
      return;
    }

    loadCategoriesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API loaders ─────────────────────────────────────────

  const loadUnitsFromApi = async () => {
    setLoadingUnits(true);
    setUnitsError(null);

    try {
      const response = await getAllUnits();
      const items = response.data;
      setUnitOptions(items.map((u) => ({ value: u.id, label: u.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setUnitsError(apiMessage || "Erreur lors du chargement des unités");
        } else {
          setUnitsError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setUnitsError("Erreur lors du chargement des unités");
      }
    } finally {
      setLoadingUnits(false);
    }
  };

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

  const loadCategoriesFromApi = async () => {
    setLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await getFilteredCategories({
        page: 1,
        pageSize: 50,
      });
      const items = response.data.items.map(mapToCategoryModel);
      setCategoryOptions(items.map((c) => ({ value: c.id, label: c.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setCategoriesError(
            apiMessage || "Erreur lors du chargement des catégories",
          );
        } else {
          setCategoriesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setCategoriesError("Erreur lors du chargement des catégories");
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  // ── Category search (triggered on Enter key) ────────────
  const handleCategorySearch = async (query: string) => {
    setLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await getFilteredCategories({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      const items = response.data.items.map(mapToCategoryModel);
      setCategoryOptions(items.map((c) => ({ value: c.id, label: c.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setCategoriesError(
            apiMessage || "Erreur lors de la recherche des catégories",
          );
        } else {
          setCategoriesError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setCategoriesError("Erreur lors de la recherche des catégories");
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  // ── Form submission ─────────────────────────────────────
  const onSubmit = async (data: UpdateProductFormData) => {
    if (!article) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload: UpdateProductRequest = {
        name: data.name,
        minimumStock: Number(data.currentStock),
        unitId: Number(data.unitId),
        warehouseId: Number(data.warehouseId),
        categoryId: Number(data.categoryId),
      };

      const response = await productClient.update(article.id, payload);
      const updatedProduct = response.data.data;

      useProductStore
        .getState()
        .updateArticle(article.id, productToArticleModel(updatedProduct));

      toast("Produit modifié avec succès");
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la modification du produit");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification du produit");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setError(null);
  };

  return {
    setError,
    form,
    isLoading,
    error,

    // Unit
    unitOptions,
    loadingUnits,
    unitsError,

    // Warehouse
    warehouseOptions,
    loadingWarehouses,
    warehousesError,

    // Category
    categoryOptions,
    loadingCategories,
    categoriesError,
    handleCategorySearch,

    // Actions
    onSubmit,
    reset: resetForm,
  };
}
