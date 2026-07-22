import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateSupplier } from "@/services/supplier.service";
import { useSupplierStore } from "@/store/supplierStore";
import { toast } from "sonner";
import type {
  SupplierModel,
  UpdateSupplierRequest,
} from "@/models/Supplier.model";
import {
  updateSupplierSchema,
  type UpdateSupplierFormData,
} from "@/models/form-validations/supplier.schema";
import axios from "axios";

interface UseUpdateSupplierReturn {
  form: ReturnType<typeof useForm<UpdateSupplierFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateSupplierFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useUpdateSupplier(
  supplier: SupplierModel,
  onSuccess: () => void,
): UseUpdateSupplierReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(updateSupplierSchema),
    defaultValues: {
      name: supplier.name ?? "",
      contact: supplier.contact ?? "",
    },
  });

  const onSubmit = async (data: UpdateSupplierFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateSupplier(
        supplier.id,
        data as UpdateSupplierRequest,
      );
      useSupplierStore.getState().updateSupplier(supplier.id, response.data);
      toast("Fournisseur modifié avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(
            apiMessage || "Erreur lors de la modification du fournisseur",
          );
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification du fournisseur");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      name: supplier.name ?? "",
      contact: supplier.contact ?? "",
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
