import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createUnit } from "@/services/unit.service";
import { useUnitStore } from "@/store/unitStore";
import { toast } from "sonner";
import { CreateUnitRequest } from "@/models/Unit.model";
import {
  createUnitSchema,
  CreateUnitFormData,
} from "@/models/form-validations/unit.schema";
import axios from "axios";

interface UseCreateUnitReturn {
  form: ReturnType<typeof useForm<CreateUnitFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateUnitFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateUnit(onSuccess: () => void): UseCreateUnitReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateUnitFormData>({
    resolver: zodResolver(createUnitSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateUnitFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createUnit(data as CreateUnitRequest);
      useUnitStore.getState().addUnit(response.data);
      toast("Unité ajoutée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création de l'unité");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création de l'unité");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset();
    setError(null);
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
    reset,
  };
}
