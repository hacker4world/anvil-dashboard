import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createSupplier } from "@/services/supplier.service";
import { useSupplierStore } from "@/store/supplierStore";
import { toast } from "sonner";
import { CreateSupplierRequest } from "@/models/Supplier.model";
import {
  createSupplierSchema,
  CreateSupplierFormData,
} from "@/models/form-validations/supplier.schema";
import axios from "axios";

interface UseCreateSupplierReturn {
  form: ReturnType<typeof useForm<CreateSupplierFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateSupplierFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateSupplier(
  onSuccess: () => void,
): UseCreateSupplierReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateSupplierFormData>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: "",
      contact: "",
    },
  });

  const onSubmit = async (data: CreateSupplierFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createSupplier(data as CreateSupplierRequest);
      useSupplierStore.getState().addSupplier(response.data);
      toast("Fournisseur ajouté avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // API returned an error (4xx, 5xx) — display the server's message
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création du fournisseur");
        } else {
          // Network error (no response received) — professional French message
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création du fournisseur");
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
