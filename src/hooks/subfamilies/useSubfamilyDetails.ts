import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { updateSubfamily } from "@/services/subfamily.service";
import { useFamilyStore } from "@/store/familyStore";
import { useSubfamilyStore } from "@/store/subfamilyStore";
import { toast } from "sonner";
import {
  SubfamilyModel,
  UpdateSubfamilyDto,
  mapToSubfamilyModel,
} from "@/models/Subfamily.model";
import { IconSelectOption } from "@/components/reusables/CustomSelect";
import {
  updateSubfamilySchema,
  type UpdateSubfamilyFormData,
} from "@/models/form-validations/subfamily.schema";
import axios from "axios";

interface UseSubfamilyDetailsReturn {
  form: ReturnType<typeof useForm<UpdateSubfamilyFormData>>;
  isLoading: boolean;
  error: string | null;
  familyOptions: IconSelectOption[];
  loadingFamilies: boolean;
  familyError: string | null;
  onSubmit: (data: UpdateSubfamilyFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useSubfamilyDetails(
  subfamily: SubfamilyModel,
  onSuccess: () => void,
): UseSubfamilyDetailsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyOptions, setFamilyOptions] = useState<IconSelectOption[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  const [familyError, setFamilyError] = useState<string | null>(null);

  const form = useForm<UpdateSubfamilyFormData>({
    resolver: zodResolver(updateSubfamilySchema),
    defaultValues: {
      name: subfamily?.name ?? "",
      familyId: subfamily?.familyId?.toString() ?? "",
    },
  });

  // Load family options: store first, then API if store is empty
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

  const onSubmit = async (data: UpdateSubfamilyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: UpdateSubfamilyDto = {
        name: data.name,
        familyId: Number(data.familyId),
      };

      const response = await updateSubfamily(subfamily.id, payload);

      useSubfamilyStore
        .getState()
        .updateSubfamily(subfamily.id, mapToSubfamilyModel(response.data));

      toast("Sous-famille modifiée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(
            apiMessage || "Erreur lors de la modification de la sous-famille",
          );
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification de la sous-famille");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: subfamily?.name ?? "",
      familyId: subfamily?.familyId?.toString() ?? "",
    });
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
    reset,
    setError,
  };
}
