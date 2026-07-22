// src/hooks/pending-requests/useRequestDetails.ts
import { useState, useCallback } from "react";
import { ProductRequestEntity } from "@/models/request.model";
import { confirmRequest, removeRequest } from "@/services/request.service";
import { usePendingRequestStore } from "@/store/pendingRequestsStore";
import { toast } from "sonner";
import axios from "axios";
import { useProductStore } from "@/store/productStore";

export type RequestDetailsTab = "basic" | "products";

interface UseRequestDetailsReturn {
  activeTab: RequestDetailsTab;
  setActiveTab: (tab: RequestDetailsTab) => void;
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

export function useRequestDetails(
  requestData: ProductRequestEntity,
  onClose: () => void,
): UseRequestDetailsReturn {
  const [activeTab, setActiveTab] = useState<RequestDetailsTab>("basic");
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
      await confirmRequest(requestData.id);

      // Remove the request from the pending list
      usePendingRequestStore.getState().removeRequest(requestData.id);

      // Subtract requested stock from each product in the product store
      const productStore = useProductStore.getState();
      for (const item of requestData.requestItems) {
        const existingArticle = productStore.articles.find(
          (a) => a.id === item.product.id,
        );
        if (existingArticle) {
          productStore.updateArticle(item.product.id, {
            currentStock: existingArticle.currentStock - item.requestedStock,
          });
        }
      }

      toast.success("Demande confirmée avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(
            apiMessage || "Erreur lors de la confirmation de la demande",
          );
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la confirmation de la demande");
      }
    } finally {
      setIsConfirming(false);
    }
  }, [requestData.id, requestData.requestItems, onClose]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await removeRequest(requestData.id);
      usePendingRequestStore.getState().removeRequest(requestData.id);
      toast.success("Demande supprimée avec succès");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const apiMessage = (err.response.data as { message?: string })
            ?.message;
          setError(apiMessage || "Erreur lors de la suppression de la demande");
        } else {
          setError(
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
          );
        }
      } else {
        setError("Erreur lors de la suppression de la demande");
      }
    } finally {
      setIsDeleting(false);
    }
  }, [requestData.id, onClose]);

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
