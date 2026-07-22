import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateAccount } from "@/services/account.service";
import { useVerifiedAccountStore } from "@/store/verifiedAccountStore";
import { toast } from "sonner";
import type { Account, UpdateAccountDto } from "@/models/Account.model";
import {
  updateVerifiedAccountSchema,
  type UpdateVerifiedAccountFormData,
} from "@/models/form-validations/account.schema";
import axios from "axios";

interface UseUpdateVerifiedAccountReturn {
  form: ReturnType<typeof useForm<UpdateVerifiedAccountFormData>>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: UpdateVerifiedAccountFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useUpdateVerifiedAccount(
  account: Account,
  onSuccess: () => void,
): UseUpdateVerifiedAccountReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateVerifiedAccountFormData>({
    resolver: zodResolver(updateVerifiedAccountSchema),
    defaultValues: {
      firstname: account?.firstname ?? "",
      lastname: account?.lastname ?? "",
      username: account?.username ?? "",
      role: account?.role ?? undefined,
    },
  });

  const onSubmit = async (data: UpdateVerifiedAccountFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateAccount(
        account.id,
        data as UpdateAccountDto,
      );
      useVerifiedAccountStore
        .getState()
        .updateAccount(account.id, response.data);
      toast("Compte modifié avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la modification du compte");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification du compte");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    form.reset({
      firstname: account?.firstname ?? "",
      lastname: account?.lastname ?? "",
      username: account?.username ?? "",
      role: account?.role ?? undefined,
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
