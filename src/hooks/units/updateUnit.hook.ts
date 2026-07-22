import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateUnit } from "@/services/unit.service";
import { useUnitStore } from "@/store/unitStore";
import { toast } from "sonner";
import type { UnitModel, UpdateUnitRequest } from "@/models/Unit.model";
import {
  updateUnitSchema,
  type UpdateUnitFormData,
} from "@/models/form-validations/unit.schema";
import axios from "axios";

interface UseUpdateUnitReturn {
  form: ReturnType<typeof useForm<UpdateUnitFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateUnitFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useUpdateUnit(
  unit: UnitModel,
  onSuccess: () => void,
): UseUpdateUnitReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateUnitFormData>({
    resolver: zodResolver(updateUnitSchema),
    defaultValues: {
      name: unit?.name ?? "",
    },
  });

  const onSubmit = async (data: UpdateUnitFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateUnit(unit.id, data as UpdateUnitRequest);
      useUnitStore.getState().updateUnit(unit.id, response.data);
      toast("Unité modifiée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la modification de l'unité");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification de l'unité");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: unit?.name ?? "",
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
