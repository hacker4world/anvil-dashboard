import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createFamily } from "@/services/family.service";
import { useFamilyStore } from "@/store/familyStore";
import { toast } from "sonner";
import { CreateFamilyDto } from "@/models/categories.model";
import { z } from "zod";
import axios from "axios";

const createFamilySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

type CreateFamilyFormData = z.infer<typeof createFamilySchema>;

interface UseCreateFamilyReturn {
  form: ReturnType<typeof useForm<CreateFamilyFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateFamilyFormData) => Promise<void>;
  reset: () => void;
}

export function useCreateFamily(onSuccess: () => void): UseCreateFamilyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateFamilyFormData>({
    resolver: zodResolver(createFamilySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateFamilyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createFamily(data as CreateFamilyDto);
      useFamilyStore.getState().addFamily(response.data);
      toast("Famille ajoutée avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la création de la famille");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la création de la famille");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setError(null);
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
    reset: resetForm,
  };
}
