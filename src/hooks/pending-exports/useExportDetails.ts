import { useState, useCallback } from "react";
import { ExportEntity } from "@/models/export.model";
import { confirmExport, removeExport } from "@/services/export.service";
import { usePendingExportStore } from "@/store/pendingExportsStore";
import { toast } from "sonner";
import axios from "axios";
import { useProductStore } from "@/store/productStore";

export type ExportDetailsTab = "basic" | "products" | "type-details";

interface UseExportDetailsReturn {
  activeTab: ExportDetailsTab;
  setActiveTab: (tab: ExportDetailsTab) => void;
  isConfirming: boolean;
  isDeleting: boolean;
  error: string | null;
  showConfirmModal: boolean;
  setShowConfirmModal: (open: boolean) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (open: boolean) => void;
  handleConfirm: () => Promise<void>;
  handleOpenConfirmModal: () => void;
  handleDelete: () => Promise<void>;
  handleOpenDeleteModal: () => void;
  handleConfirmDelete: () => Promise<void>;
  reset: () => void;
}

export function useExportDetails(
  exportData: ExportEntity,
  onClose: () => void,
): UseExportDetailsReturn {
  const [activeTab, setActiveTab] = useState<ExportDetailsTab>("basic");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOpenDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleOpenConfirmModal = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const reset = useCallback(() => {
    setActiveTab("basic");
    setError(null);
    setIsConfirming(false);
    setIsDeleting(false);
    setShowConfirmModal(false);
    setShowDeleteModal(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    setIsConfirming(true);
    setError(null);

    try {
      await confirmExport(exportData.id);

      // Remove the export from the pending list
      usePendingExportStore.getState().removeExport(exportData.id);

      // ── NEW: Subtract exited stock from each product in the product store ──
      const productStore = useProductStore.getState();
      for (const item of exportData.exportItems) {
        const existingArticle = productStore.articles.find(
          (a) => a.id === item.product.id,
        );
        if (existingArticle) {
          productStore.updateArticle(item.product.id, {
            currentStock: existingArticle.currentStock - item.exitedStock,
          });
        }
      }

      toast.success("Sortie confirmée avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la confirmation de la sortie");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la confirmation de la sortie");
      }
    } finally {
      setIsConfirming(false);
    }
  }, [exportData.id, exportData.exportItems, onClose]); // ← ADD exportData.exportItems to deps

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await removeExport(exportData.id);
      usePendingExportStore.getState().removeExport(exportData.id);
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
    isConfirming,
    isDeleting,
    error,
    showConfirmModal,
    setShowConfirmModal,
    showDeleteModal,
    setShowDeleteModal,
    handleConfirm,
    handleOpenConfirmModal,
    handleDelete,
    handleOpenDeleteModal,
    handleConfirmDelete,
    reset,
  };
}
