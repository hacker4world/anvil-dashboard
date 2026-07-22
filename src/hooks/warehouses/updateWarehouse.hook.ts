import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateWarehouse } from "@/services/warehouse.service";
import { useWarehouseStore } from "@/store/warehouseStore";
import { toast } from "sonner";
import type {
  WarehouseModel,
  UpdateWarehouseRequest,
} from "@/models/Warehouse.model";
import {
  updateWarehouseSchema,
  type UpdateWarehouseFormData,
} from "@/models/form-validations/warehouse.schema";
import axios from "axios";

interface UseUpdateWarehouseReturn {
  form: ReturnType<typeof useForm<UpdateWarehouseFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateWarehouseFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useUpdateWarehouse(
  warehouse: WarehouseModel,
  onSuccess: () => void,
): UseUpdateWarehouseReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateWarehouseFormData>({
    resolver: zodResolver(updateWarehouseSchema),
    defaultValues: {
      name: warehouse.name ?? "",
    },
  });

  const onSubmit = async (data: UpdateWarehouseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateWarehouse(
        warehouse.id,
        data as UpdateWarehouseRequest,
      );
      useWarehouseStore.getState().updateWarehouse(warehouse.id, response.data);
      toast("Dépôt modifié avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la modification du dépôt");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification du dépôt");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: warehouse.name ?? "",
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
