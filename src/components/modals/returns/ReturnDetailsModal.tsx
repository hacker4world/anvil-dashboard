// src/components/modals/returns/ReturnDetailsModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBanner } from "@/components/reusables/status-banner";
import { ReturnEntity } from "@/models/return.model";
import {
  Loader2,
  Trash2,
  CheckCircle,
  Package,
  FileText,
  Info,
  Calendar,
  User,
  MessageSquare,
  HardHat,
} from "lucide-react";
import { ConfirmDeleteModal } from "@/components/reusables/DeleteConfirmation";
import { ConfirmReturnModal } from "./ConfirmReturnModal";
import { TransporterInfoModal } from "./TransporterInfoModal";
import { useState } from "react";
import { toast } from "sonner";
import { removeReturn, confirmReturn } from "@/services/return.service";
import { usePendingReturnStore } from "@/store/pendingReturnsStore";

interface ReturnDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnData: ReturnEntity;
}

export function ReturnDetailsModal({
  open,
  onOpenChange,
  returnData,
}: ReturnDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("basic");

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Confirm state
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [restockItems, setRestockItems] = useState<
    { productId: number; restock: boolean }[] | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await removeReturn(returnData.id);
      usePendingReturnStore.getState().removeReturn(returnData.id);
      toast.success("Retour supprimé avec succès");
      setShowDeleteModal(false);
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de suppression";
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // First step: receive restock decisions from ConfirmReturnModal
  const handleProceedRestock = (
    items: { productId: number; restock: boolean }[],
  ) => {
    setRestockItems(items);
    setShowConfirmModal(false);
    setShowTransporterModal(true);
  };

  // Second step: submit final confirmation with transporter info
  const handleConfirmWithTransporter = async (transporterInfo: {
    transporterName: string;
    transporterMatricule: string;
  }) => {
    if (!restockItems) return;
    setIsConfirming(true);
    setError(null);
    try {
      await confirmReturn(returnData.id, {
        items: restockItems,
        ...transporterInfo,
      });
      usePendingReturnStore.getState().removeReturn(returnData.id);
      toast.success("Retour confirmé avec succès");
      setShowTransporterModal(false);
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de confirmation";
      setError(msg);
    } finally {
      setIsConfirming(false);
    }
  };

  const isOperating = isDeleting || isConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Détails du retour — #{returnData.id}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <StatusBanner variant="danger" title="Erreur" description={error} />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" disabled={isOperating}>
              <Info className="h-4 w-4 mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="products" disabled={isOperating}>
              <Package className="h-4 w-4 mr-2" />
              Produits retournés
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Date
              </label>
              <Input
                type="date"
                value={returnData.date}
                readOnly
                disabled
                className="bg-muted/30 cursor-default"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                Chantier
              </label>
              <Input
                value={returnData.constructionSite?.name ?? "—"}
                readOnly
                disabled
                className="bg-muted/30 cursor-default"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Demandeur
              </label>
              <Input
                value={
                  returnData.account
                    ? `${returnData.account.firstname} ${returnData.account.lastname}`
                    : "—"
                }
                readOnly
                disabled
                className="bg-muted/30 cursor-default"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                Observation
              </label>
              <Textarea
                value={returnData.observation || "—"}
                readOnly
                disabled
                rows={3}
                className="bg-muted/30 cursor-default resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4 mt-4">
            {!returnData.returnItems || returnData.returnItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun produit retourné
              </p>
            ) : (
              returnData.returnItems.map((item, index) => (
                <div key={item.id} className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Produit {index + 1}
                  </h4>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">
                      Produit
                    </label>
                    <Input
                      value={item.product?.name ?? "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">
                        Quantité retournée
                      </label>
                      <Input
                        value={item.returnedStock}
                        readOnly
                        disabled
                        className="bg-muted/30 cursor-default"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">
                        Raison
                      </label>
                      <Input
                        value={item.reason || "—"}
                        readOnly
                        disabled
                        className="bg-muted/30 cursor-default"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isOperating}
          >
            Fermer
          </Button>

          {!returnData.confirmed ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                disabled={isOperating}
                className="gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Supprimer le retour
              </Button>
              <Button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isOperating}
                className="gap-2"
              >
                {isConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Confirmer le retour
              </Button>
            </div>
          ) : null}
        </DialogFooter>

        <ConfirmDeleteModal
          title="Supprimer le retour"
          description={`Voulez-vous vraiment supprimer le retour #${returnData.id} ? Cette action est irréversible.`}
          onOpenChange={setShowDeleteModal}
          onConfirm={handleDelete}
          open={showDeleteModal}
        />

        <ConfirmReturnModal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          returnData={returnData}
          isSubmitting={false}
          error={null}
          onProceed={handleProceedRestock}
        />

        <TransporterInfoModal
          open={showTransporterModal}
          onOpenChange={setShowTransporterModal}
          isSubmitting={isConfirming}
          error={error}
          onSubmit={handleConfirmWithTransporter}
        />
      </DialogContent>
    </Dialog>
  );
}
