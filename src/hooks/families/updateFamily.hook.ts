import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateFamily } from "@/services/family.service";
import { useFamilyStore } from "@/store/familyStore";
import { toast } from "sonner";
import type { FamilyModel } from "@/models/Family.model";
import { UpdateFamilyDto } from "@/models/categories.model";
import {
  updateFamilySchema,
  type UpdateFamilyFormData,
} from "@/models/form-validations/family.schema";
import axios from "axios";

interface UseUpdateFamilyReturn {
  form: ReturnType<typeof useForm<UpdateFamilyFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateFamilyFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useUpdateFamily(
  family: FamilyModel,
  onSuccess: () => void,
): UseUpdateFamilyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateFamilyFormData>({
    resolver: zodResolver(updateFamilySchema),
    defaultValues: {
      name: family?.name ?? "",
    },
  });

  const onSubmit = async (data: UpdateFamilyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateFamily(family.id, data as UpdateFamilyDto);
      useFamilyStore.getState().updateFamily(family.id, response.data);
      toast("Famille modifiée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(
            apiMessage || "Erreur lors de la modification de la famille",
          );
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification de la famille");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: family?.name ?? "",
    });
    setError(null);
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
    reset,
    setError,
  };
}
