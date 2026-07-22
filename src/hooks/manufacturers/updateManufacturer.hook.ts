import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateManufacturer } from "@/services/manufacturer.service";
import { useManufacturerStore } from "@/store/manufacturerStore";
import { toast } from "sonner";
import type {
  ManufacturerModel,
  UpdateManufacturerRequest,
} from "@/models/Manufacturer.model";
import {
  updateManufacturerSchema,
  type UpdateManufacturerFormData,
} from "@/models/form-validations/manufacturer.schema";
import axios from "axios";

interface UseUpdateManufacturerReturn {
  form: ReturnType<typeof useForm<UpdateManufacturerFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateManufacturerFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useUpdateManufacturer(
  manufacturer: ManufacturerModel,
  onSuccess: () => void,
): UseUpdateManufacturerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateManufacturerFormData>({
    resolver: zodResolver(updateManufacturerSchema),
    defaultValues: {
      name: manufacturer?.name ?? "",
      address: manufacturer?.address ?? "",
      contact: manufacturer?.contact ?? "",
    },
  });

  const onSubmit = async (data: UpdateManufacturerFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateManufacturer(
        manufacturer.id,
        data as UpdateManufacturerRequest,
      );
      useManufacturerStore
        .getState()
        .updateManufacturer(manufacturer.id, response.data);
      toast("Fabricant modifié avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la modification du fabricant");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification du fabricant");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: manufacturer.name ?? "",
      address: manufacturer.address ?? "",
      contact: manufacturer.contact ?? "",
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
