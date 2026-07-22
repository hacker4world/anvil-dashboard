import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createManufacturer } from "@/services/manufacturer.service";
import { useManufacturerStore } from "@/store/manufacturerStore";
import { toast } from "sonner";
import { CreateManufacturerRequest } from "@/models/Manufacturer.model";
import {
  createManufacturerSchema,
  CreateManufacturerFormData,
} from "@/models/form-validations/manufacturer.schema";
import axios from "axios";

interface UseCreateManufacturerReturn {
  form: ReturnType<typeof useForm<CreateManufacturerFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateManufacturerFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateManufacturer(
  onSuccess: () => void,
): UseCreateManufacturerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateManufacturerFormData>({
    resolver: zodResolver(createManufacturerSchema),
    defaultValues: {
      name: "",
      address: "",
      contact: "",
    },
  });

  const onSubmit = async (data: CreateManufacturerFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createManufacturer(
        data as CreateManufacturerRequest,
      );
      useManufacturerStore.getState().addManufacturer(response.data);
      toast("Fabricant ajouté avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // API returned an error (4xx, 5xx) — display the server's message
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création du fabricant");
        } else {
          // Network error (no response received)
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création du fabricant");
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
