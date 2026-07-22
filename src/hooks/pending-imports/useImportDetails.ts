import { useState, useCallback } from "react";
import { ImportResponse } from "@/models/import-export.dtos";
import { confirmImport, deleteImport } from "@/services/import-export.service";
import { usePendingImportStore } from "@/store/pendingImportStore";
import { useProductStore } from "@/store/productStore";
import { SupplierModel } from "@/models/Supplier.model";
import { toast } from "sonner";
import axios from "axios";
import { useConfirmedImportStore } from "@/store/confirmedImportsStore";

export type ImportDetailsTab = "basic" | "products" | "documents";

interface UseImportDetailsReturn {
  activeTab: ImportDetailsTab;
  setActiveTab: (tab: ImportDetailsTab) => void;
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

export function useImportDetails(
  importData: ImportResponse,
  onClose: () => void,
): UseImportDetailsReturn {
  const [activeTab, setActiveTab] = useState<ImportDetailsTab>("basic");
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
      const response = await confirmImport(importData.id);
      const confirmedImport = response.data;

      // ── Update the product store with confirmed import data ──────────
      const { articles, updateArticle } = useProductStore.getState();

      // Build the supplier model from the import's supplier
      const supplierModel: SupplierModel = {
        id: confirmedImport.supplier.id,
        name: confirmedImport.supplier.name,
        contact: confirmedImport.supplier.contact,
        createdAt:
          (confirmedImport.supplier as SupplierModel).createdAt ??
          new Date().toISOString(),
        updatedAt:
          (confirmedImport.supplier as SupplierModel).updatedAt ??
          new Date().toISOString(),
      };

      for (const item of confirmedImport.importItems) {
        const existingArticle = articles.find((a) => a.id === item.product.id);
        if (existingArticle) {
          // Check if the supplier is already linked to this product
          const supplierExists = existingArticle.suppliers?.some(
            (s) => s.id === supplierModel.id,
          );

          updateArticle(item.product.id, {
            currentStock: item.product.stock,
            averagePrice: item.product.averagePrice,
            suppliers: supplierExists
              ? existingArticle.suppliers
              : [...(existingArticle.suppliers || []), supplierModel],
          });
        }
      }

      // Remove the import from the pending list
      usePendingImportStore.getState().removeImport(importData.id);
      useConfirmedImportStore.getState().addImport(confirmedImport);

      toast.success("Entrée confirmée avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la confirmation de l'entrée");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la confirmation de l'entrée");
      }
    } finally {
      setIsConfirming(false);
    }
  }, [importData.id, onClose]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteImport(importData.id);
      usePendingImportStore.getState().removeImport(importData.id);
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
