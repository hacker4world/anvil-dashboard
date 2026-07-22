import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { createCategory } from "@/services/category.service";
import { getFilteredSubfamilies } from "@/services/subfamily.service";
import { useCategoryStore } from "@/store/categoryStore";
import { useSubfamilyStore } from "@/store/subfamilyStore";
import { toast } from "sonner";
import { CreateCategoryDto, mapToCategoryModel } from "@/models/Category.model";
import { mapToSubfamilyModel } from "@/models/Subfamily.model";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { z } from "zod";
import axios from "axios";

const createCategorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  subfamilyId: z.number({ required_error: "La sous-famille est requise" }),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

interface UseCreateCategoryReturn {
  form: ReturnType<typeof useForm<CreateCategoryFormData>>;
  isLoading: boolean;
  error: string | null;
  subfamilyOptions: IconSelectOption[];
  loadingSubfamilies: boolean;
  subfamilyError: string | null;
  handleSubfamilySearch: (query: string) => Promise<void>;
  onSubmit: (data: CreateCategoryFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateCategory(
  onSuccess: () => void,
): UseCreateCategoryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subfamilyOptions, setSubfamilyOptions] = useState<IconSelectOption[]>(
    [],
  );
  const [loadingSubfamilies, setLoadingSubfamilies] = useState(false);
  const [subfamilyError, setSubfamilyError] = useState<string | null>(null);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      subfamilyId: undefined,
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

  const onSubmit = async (data: CreateCategoryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateCategoryDto = {
        name: data.name,
        subfamilyId: data.subfamilyId,
      };
      const response = await createCategory(payload);

      useCategoryStore
        .getState()
        .addCategory(mapToCategoryModel(response.data));

      toast("Catégorie ajoutée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création de la catégorie");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création de la catégorie");
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
    form,
    isLoading,
    error,
    subfamilyOptions,
    loadingSubfamilies,
    subfamilyError,
    handleSubfamilySearch,
    onSubmit,
    reset: resetForm,
  };
}
