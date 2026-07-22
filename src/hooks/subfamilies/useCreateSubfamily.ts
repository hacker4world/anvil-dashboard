import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { createSubfamily } from "@/services/subfamily.service";
import { useFamilyStore } from "@/store/familyStore";
import { useSubfamilyStore } from "@/store/subfamilyStore";
import { toast } from "sonner";
import {
  CreateSubfamilyDto,
  mapToSubfamilyModel,
} from "@/models/Subfamily.model";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import { z } from "zod";
import axios from "axios";

const createSubfamilySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  familyId: z.union([z.string().min(1, "La famille est requise"), z.number()]),
});

type CreateSubfamilyFormData = z.infer<typeof createSubfamilySchema>;

interface UseCreateSubfamilyReturn {
  form: ReturnType<typeof useForm<CreateSubfamilyFormData>>;
  isLoading: boolean;
  error: string | null;
  familyOptions: IconSelectOption[];
  loadingFamilies: boolean;
  familyError: string | null;
  onSubmit: (data: CreateSubfamilyFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateSubfamily(
  onSuccess: () => void,
): UseCreateSubfamilyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyOptions, setFamilyOptions] = useState<IconSelectOption[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  const [familyError, setFamilyError] = useState<string | null>(null);

  const form = useForm<CreateSubfamilyFormData>({
    resolver: zodResolver(createSubfamilySchema),
    defaultValues: {
      name: "",
      familyId: "",
    },
  });

  // Load family options on mount: store first, then API if store is empty
  useEffect(() => {
    const store = useFamilyStore.getState();

    if (store.families.length > 0) {
      setFamilyOptions(
        store.families.map((f) => ({ value: f.id, label: f.name })),
      );
      return;
    }

    loadFamiliesFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFamiliesFromApi = async () => {
    setLoadingFamilies(true);
    setFamilyError(null);

    await useFamilyStore.getState().fetchFamilies();

    const store = useFamilyStore.getState();
    if (store.error) {
      setFamilyError(store.error);
      useFamilyStore.getState().clearError();
    } else {
      setFamilyOptions(
        store.families.map((f) => ({ value: f.id, label: f.name })),
      );
    }

    setLoadingFamilies(false);
  };

  const onSubmit = async (data: CreateSubfamilyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateSubfamilyDto = {
        name: data.name,
        familyId: Number(data.familyId),
      };
      const response = await createSubfamily(payload);

      useSubfamilyStore
        .getState()
        .addSubfamily(mapToSubfamilyModel(response.data));

      toast("Sous-famille ajoutée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(
            apiMessage || "Erreur lors de la création de la sous-famille",
          );
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création de la sous-famille");
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
    familyOptions,
    loadingFamilies,
    familyError,
    onSubmit,
    reset: resetForm,
  };
}
