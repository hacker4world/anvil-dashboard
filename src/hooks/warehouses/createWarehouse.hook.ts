import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createWarehouse } from "@/services/warehouse.service";
import { useWarehouseStore } from "@/store/warehouseStore";
import { toast } from "sonner";
import { CreateWarehouseRequest } from "@/models/Warehouse.model";
import {
  createWarehouseSchema,
  CreateWarehouseFormData,
} from "@/models/form-validations/warehouse.schema";
import axios from "axios";

interface UseCreateWarehouseReturn {
  form: ReturnType<typeof useForm<CreateWarehouseFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateWarehouseFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateWarehouse(
  onSuccess: () => void,
): UseCreateWarehouseReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateWarehouseFormData>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateWarehouseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createWarehouse(data as CreateWarehouseRequest);
      useWarehouseStore.getState().addWarehouse(response.data);
      toast("Dépôt ajouté avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création du dépôt");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création du dépôt");
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
