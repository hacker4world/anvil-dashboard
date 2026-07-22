// /src/hooks/confirmed-exports/useConfirmedExportDetails.ts

import { useState, useCallback } from "react";
import { ExportEntity } from "@/models/export.model";
import { removeExport } from "@/services/export.service";
import { useConfirmedExportStore } from "@/store/confirmedExportsStore";
import { toast } from "sonner";
import axios from "axios";

export type ConfirmedExportDetailsTab =
  | "basic"
  | "products"
  | "type-details"
  | "documents";

interface UseConfirmedExportDetailsReturn {
  activeTab: ConfirmedExportDetailsTab;
  setActiveTab: (tab: ConfirmedExportDetailsTab) => void;
  isDeleting: boolean;
  error: string | null;
  showDeleteModal: boolean;
  setShowDeleteModal: (open: boolean) => void;
  handleOpenDeleteModal: () => void;
  handleConfirmDelete: () => Promise<void>;
  reset: () => void;
}

export function useConfirmedExportDetails(
  exportData: ExportEntity,
  onClose: () => void,
): UseConfirmedExportDetailsReturn {
  const [activeTab, setActiveTab] =
    useState<ConfirmedExportDetailsTab>("basic");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOpenDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const reset = useCallback(() => {
    setActiveTab("basic");
    setError(null);
    setIsDeleting(false);
    setShowDeleteModal(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await removeExport(exportData.id);
      useConfirmedExportStore.getState().removeExport(exportData.id);
      toast.success("Sortie supprimée avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la suppression de la sortie");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la suppression de la sortie");
      }
    } finally {
      setIsDeleting(false);
    }
  }, [exportData.id, onClose]);

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete();
    setShowDeleteModal(false);
  }, [handleDelete]);

  return {
    activeTab,
    setActiveTab,
    isDeleting,
    error,
    showDeleteModal,
    setShowDeleteModal,
    handleOpenDeleteModal,
    handleConfirmDelete,
    reset,
  };
}
