import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { updateConstructionSite } from "@/services/construction-site.service";
import { listAccounts } from "@/services/account.service";
import { useConstructionSiteStore } from "@/store/constructionSiteStore";
import { useVerifiedAccountStore } from "@/store/verifiedAccountStore";
import { toast } from "sonner";
import type { SiteModel } from "@/models/Site.model";
import { mapToSiteModel } from "@/models/Site.model";
import type { AccountFilters } from "@/models/Account.model";
import { AccountRole } from "@/models/Account.model";
import type { UpdateConstructionSiteRequest } from "@/models/ConstructionSite.model";
import {
  updateSiteSchema,
  type UpdateSiteFormData,
} from "@/models/form-validations/construction-site.schema";
import type { IconSelectOption } from "@/components/reusables/CustomSelect";
import axios from "axios";

interface UseSiteDetailsReturn {
  form: ReturnType<typeof useForm<UpdateSiteFormData>>;
  isLoading: boolean;
  error: string | null;
  managerOptions: IconSelectOption[];
  loadingManagers: boolean;
  managerError: string | null;
  handleManagerSearch: (query: string) => Promise<void>;
  onSubmit: (data: UpdateSiteFormData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useSiteDetails(
  site: SiteModel,
  onSuccess: () => void,
): UseSiteDetailsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managerOptions, setManagerOptions] = useState<IconSelectOption[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);

  const form = useForm<UpdateSiteFormData>({
    resolver: zodResolver(updateSiteSchema),
    defaultValues: {
      name: site.name ?? "",
      address: site.address ?? "",
      managerId: site.managerId ?? undefined,
    },
  });

  // Load manager options on mount: check verifiedAccountStore first, then API
  useEffect(() => {
    const store = useVerifiedAccountStore.getState();
    const managers = store.accounts.filter(
      (a) => a.role === AccountRole.CONSTRUCTION_SITE_MANAGER,
    );

    if (managers.length > 0) {
      setManagerOptions(
        managers.map((m) => ({
          value: m.id,
          label: `${m.firstname} ${m.lastname}`,
        })),
      );
      return;
    }

    loadManagersFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadManagersFromApi = async (searchQuery?: string) => {
    setLoadingManagers(true);
    setManagerError(null);

    try {
      const filters: AccountFilters = {
        role: AccountRole.CONSTRUCTION_SITE_MANAGER,
        confirmed: true,
      };
      if (searchQuery?.trim()) {
        filters.lastname = searchQuery.trim();
      }

      const response = await listAccounts({
        page: 1,
        pageSize: 50,
        filters,
      });

      setManagerOptions(
        response.data.items.map((m) => ({
          value: m.id,
          label: `${m.firstname} ${m.lastname}`,
        })),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setManagerError(
            apiMessage || "Erreur lors du chargement des responsables",
          );
        } else {
          setManagerError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setManagerError("Erreur lors du chargement des responsables");
      }
    } finally {
      setLoadingManagers(false);
    }
  };

  // Called when user presses Enter in the manager search field
  const handleManagerSearch = async (query: string) => {
    await loadManagersFromApi(query);
  };

  const onSubmit = async (data: UpdateSiteFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: UpdateConstructionSiteRequest = {
        name: data.name,
        address: data.address,
        managerId: data.managerId,
      };
      const response = await updateConstructionSite(site.id, payload);
      const siteModel = mapToSiteModel(response.data);

      useConstructionSiteStore.getState().updateSite(site.id, siteModel);

      toast("Chantier modifié avec succès");
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la modification du chantier");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la modification du chantier");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      name: site.name ?? "",
      address: site.address ?? "",
      managerId: site.managerId ?? undefined,
    });
    setError(null);
  };

  return {
    form,
    isLoading,
    error,
    managerOptions,
    loadingManagers,
    managerError,
    handleManagerSearch,
    onSubmit,
    reset: resetForm,
    setError,
  };
}
