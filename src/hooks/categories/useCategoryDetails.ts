import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { updateCategory } from "@/services/category.service";
import { getFilteredSubfamilies } from "@/services/subfamily.service";
import { useCategoryStore } from "@/store/categoryStore";
import { useSubfamilyStore } from "@/store/subfamilyStore";
import { toast } from "sonner";
import {
  CategoryModel,
  UpdateCategoryDto,
  mapToCategoryModel,
} from "@/models/Category.model";
import { mapToSubfamilyModel } from "@/models/Subfamily.model";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import {
  updateCategorySchema,
  type UpdateCategoryFormData,
} from "@/models/form-validations/category.schema";
import axios from "axios";

interface UseCategoryDetailsReturn {
  form: ReturnType<typeof useForm<UpdateCategoryFormData>>;
  isLoading: boolean;
  error: string | null;
  subfamilyOptions: IconSelectOption[];
  loadingSubfamilies: boolean;
  subfamilyError: string | null;
  handleSubfamilySearch: (query: string) => Promise<void>;
  onSubmit: (data: UpdateCategoryFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useCategoryDetails(
  category: CategoryModel,
  onSuccess: () => void,
): UseCategoryDetailsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subfamilyOptions, setSubfamilyOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingSubfamilies, setLoadingSubfamilies] = useState(false);
  const [subfamilyError, setSubfamilyError] = useState<string | null>(null);

  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      subfamilyId: category?.subfamilyId?.toString() ?? "",
    },
  });

  // Load subfamily options on mount: store first, then API if store is empty
  useEffect(() => {
    const store = useSubfamilyStore.getState();

    if (store.subfamilies.length > 0) {
      setSubfamilyOptions(
        store.subfamilies.map((s) => ({ value: s.id, label: s.name })),
      );
      return;
    }

    loadSubfamiliesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubfamiliesFromApi = async () => {
    setLoadingSubfamilies(true);
    setSubfamilyError(null);

    try {
      const response = await getFilteredSubfamilies({
        page: 1,
        pageSize: 50,
      });
      const items = response.data.items.map(mapToSubfamilyModel);
      setSubfamilyOptions(items.map((s) => ({ value: s.id, label: s.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setSubfamilyError(
            apiMessage || "Erreur lors du chargement des sous-familles",
          );
        } else {
          setSubfamilyError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setSubfamilyError("Erreur lors du chargement des sous-familles");
      }
    } finally {
      setLoadingSubfamilies(false);
    }
  };

  // Called when user presses Enter in the subfamily search field
  const handleSubfamilySearch = async (query: string) => {
    setLoadingSubfamilies(true);
    setSubfamilyError(null);

    try {
      const response = await getFilteredSubfamilies({
        page: 1,
        pageSize: 50,
        filters: query.trim() ? { name: query.trim() } : undefined,
      });
      const items = response.data.items.map(mapToSubfamilyModel);
      setSubfamilyOptions(items.map((s) => ({ value: s.id, label: s.name })));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setSubfamilyError(
            apiMessage || "Erreur lors de la recherche des sous-familles",
          );
        } else {
          setSubfamilyError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setSubfamilyError("Erreur lors de la recherche des sous-familles");
      }
    } finally {
      setLoadingSubfamilies(false);
    }
  };

  const onSubmit = async (data: UpdateCategoryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: UpdateCategoryDto = {
        name: data.name,
        subfamilyId: Number(data.subfamilyId),
      };

      const response = await updateCategory(category.id, payload);

      useCategoryStore
        .getState()
        .updateCategory(category.id, mapToCategoryModel(response.data));

      toast("Catégorie modifiée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(
            apiMessage || "Erreur lors de la modification de la catégorie",
          );
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification de la catégorie");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: category?.name ?? "",
      subfamilyId: category?.subfamilyId?.toString() ?? "",
    });
    setError(null);
  };

  return {
    form,
    isLoading,
    error,
    subfamilyOptions,
    loadingSubfamilies,
    subfamilyError,
    handleSubfamilySearch,
    onSubmit,
    reset,
    setError,
  };
}
