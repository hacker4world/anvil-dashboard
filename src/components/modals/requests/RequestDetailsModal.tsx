// src/components/modals/requests/RequestDetailsModal.tsx
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
import {
  useRequestDetails,
  RequestDetailsTab,
} from "@/hooks/pending-requests/useRequestDetails";
import { ProductRequestEntity } from "@/models/request.model";
import {
  Loader2,
  CheckCircle,
  Trash2,
  Package,
  FileText,
  Info,
  Calendar,
  User,
  MessageSquare,
  HardHat,
  Truck,
  ScrollText,
  ExternalLink,
} from "lucide-react";
import { ConfirmActionModal } from "@/components/reusables/ConfirmActionModal";
import { ConfirmDeleteModal } from "@/components/reusables/DeleteConfirmation";
import { base_url } from "@/services/axios.client";

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestData: ProductRequestEntity;
  onConvert?: (request: ProductRequestEntity) => void;
}

export function RequestDetailsModal({
  open,
  onOpenChange,
  requestData,
  onConvert,
}: RequestDetailsModalProps) {
  const {
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
    handleOpenDeleteModal,
    handleConfirmDelete,
    reset,
  } = useRequestDetails(requestData, () => onOpenChange(false));

  const handleTabChange = (value: string) => {
    setActiveTab(value as RequestDetailsTab);
  };

  const isOperating = isConfirming || isDeleting;

  // Build document URL for confirmed requests
  const ficheExpedition = requestData.ficheExpedition;
  const docUrl =
    requestData.confirmed && ficheExpedition
      ? `${base_url}/uploads/demandes/${requestData.id}/${ficheExpedition}`
      : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          reset();
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Détails de la demande — #{requestData.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <StatusBanner variant="danger" title="Erreur" description={error} />
          )}

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList
              className={`grid w-full ${
                requestData.confirmed ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              <TabsTrigger value="basic" disabled={isOperating}>
                <Info className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="products" disabled={isOperating}>
                <Package className="h-4 w-4 mr-2" />
                Produits
              </TabsTrigger>
              {requestData.confirmed && (
                <TabsTrigger value="documents" disabled={isOperating}>
                  <ScrollText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              )}
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date
                </label>
                <Input
                  type="date"
                  value={requestData.date}
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
                  value={requestData.constructionSite?.name ?? "—"}
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
                    requestData.account
                      ? `${requestData.account.firstname} ${requestData.account.lastname}`
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
                  value={requestData.observation || "—"}
                  readOnly
                  disabled
                  rows={3}
                  className="bg-muted/30 cursor-default resize-none"
                />
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4 mt-4">
              {!requestData.requestItems ||
              requestData.requestItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Aucun produit dans cette demande
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requestData.requestItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border p-4 space-y-3"
                    >
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

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Quantité demandée
                        </label>
                        <Input
                          value={item.requestedStock}
                          readOnly
                          disabled
                          className="bg-muted/30 cursor-default"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Documents Tab (only if confirmed) */}
            {requestData.confirmed && (
              <TabsContent value="documents" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Documents générés
                  </h3>
                  {docUrl ? (
                    <div className="rounded-lg border p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">
                            Fiche d&apos;expédition
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ficheExpedition}
                          </p>
                        </div>
                      </div>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ouvrir le PDF
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun document disponible pour le moment.
                    </p>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Footer */}
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isOperating}
            >
              Fermer
            </Button>

            {!requestData.confirmed ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleOpenDeleteModal}
                  disabled={isOperating}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Supprimer la demande
                </Button>

                <Button
                  type="button"
                  onClick={handleOpenConfirmModal}
                  disabled={isOperating}
                  className="gap-2"
                >
                  {isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Confirmer la demande
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                  onConvert?.(requestData);
                }}
                className="gap-2"
              >
                <Truck className="h-4 w-4" />
                Convertir en exportation
              </Button>
            )}
          </DialogFooter>
        </div>

        <ConfirmDeleteModal
          title="Supprimer la demande"
          description={`Voulez-vous vraiment supprimer la demande #${requestData.id} ? Cette action est irréversible.`}
          onOpenChange={setShowDeleteModal}
          onConfirm={handleConfirmDelete}
          open={showDeleteModal}
        />
        <ConfirmActionModal
          title="Confirmer la demande"
          description={`Voulez-vous vraiment confirmer la demande #${requestData.id} ? Cette action est irréversible.`}
          onOpenChange={setShowConfirmModal}
          onConfirm={handleConfirm}
          open={showConfirmModal}
        />
      </DialogContent>
    </Dialog>
  );
}
