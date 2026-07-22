import { useState, useCallback } from "react";
import { ImportResponse } from "@/models/import-export.dtos";
import { deleteImport } from "@/services/import-export.service";
import { useConfirmedImportStore } from "@/store/confirmedImportsStore";
import { toast } from "sonner";
import axios from "axios";

export type ConfirmedImportDetailsTab = "basic" | "products" | "documents";

interface UseConfirmedImportDetailsReturn {
  activeTab: ConfirmedImportDetailsTab;
  setActiveTab: (tab: ConfirmedImportDetailsTab) => void;
  isDeleting: boolean;
  error: string | null;
  handleDelete: () => Promise<void>;
  reset: () => void;
}

export function useConfirmedImportDetails(
  importData: ImportResponse,
  onClose: () => void,
): UseConfirmedImportDetailsReturn {
  const [activeTab, setActiveTab] =
    useState<ConfirmedImportDetailsTab>("basic");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteImport(importData.id);
      useConfirmedImportStore.getState().removeImport(importData.id);
      toast.success("Entrée supprimée avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la suppression de l'entrée");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la suppression de l'entrée");
      }
    } finally {
      setIsDeleting(false);
    }
  }, [importData.id, onClose]);

  const reset = useCallback(() => {
    setActiveTab("basic");
    setError(null);
    setIsDeleting(false);
  }, []);

  return {
    activeTab,
    setActiveTab,
    isDeleting,
    error,
    handleDelete,
    reset,
  };
}
