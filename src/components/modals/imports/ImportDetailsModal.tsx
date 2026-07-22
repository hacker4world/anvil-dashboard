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
  useImportDetails,
  ImportDetailsTab,
} from "@/hooks/pending-imports/useImportDetails";
import { ImportResponse } from "@/models/import-export.dtos";
import {
  Loader2,
  CheckCircle,
  Trash2,
  Package,
  FileText,
  Info,
  Calendar,
  Factory,
  User,
  MessageSquare,
  Boxes,
  FileDown,
  ExternalLink,
} from "lucide-react";
import { useEffect } from "react";
import { base_url } from "@/services/axios.client";
import { ConfirmActionModal } from "@/components/reusables/ConfirmActionModal";
import { ConfirmDeleteModal } from "@/components/reusables/DeleteConfirmation";

interface ImportDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: ImportResponse;
}

export function ImportDetailsModal({
  open,
  onOpenChange,
  importData,
}: ImportDetailsModalProps) {
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
    handleDelete,
    handleOpenDeleteModal,
    handleConfirmDelete,
    reset,
  } = useImportDetails(importData, () => onOpenChange(false));

  const handleTabChange = (value: string) => {
    setActiveTab(value as ImportDetailsTab);
  };

  const isOperating = isConfirming || isDeleting;

  // Helper to extract filename from a URL path
  const getFileName = (filePath: string | null): string | null => {
    if (!filePath) return null;
    const parts = filePath.split("/");
    return parts[parts.length - 1] || null;
  };

  useEffect(() => {
    console.log(importData);
  }, []);

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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Détails de l'entrée — #{importData.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Banner */}
          {error && (
            <StatusBanner variant="danger" title="Erreur" description={error} />
          )}

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" disabled={isOperating}>
                <Info className="h-4 w-4 mr-2" />
                Informations de base
              </TabsTrigger>
              <TabsTrigger value="products" disabled={isOperating}>
                <Boxes className="h-4 w-4 mr-2" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="documents" disabled={isOperating}>
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Basic Information (readonly) ──────── */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date
                </label>
                <Input
                  type="date"
                  value={importData.date}
                  readOnly
                  disabled
                  className="bg-muted/30 cursor-default"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Fournisseur
                </label>
                <Input
                  value={importData.supplier?.name ?? "—"}
                  readOnly
                  disabled
                  className="bg-muted/30 cursor-default"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Factory className="h-3.5 w-3.5 text-muted-foreground" />
                  Fabricant
                </label>
                <Input
                  value={importData.manufacturer?.name ?? "—"}
                  readOnly
                  disabled
                  className="bg-muted/30 cursor-default"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  Observation
                </label>
                <Textarea
                  value={importData.observation || "—"}
                  readOnly
                  disabled
                  rows={3}
                  className="bg-muted/30 cursor-default resize-none"
                />
              </div>
            </TabsContent>

            {/* ── Tab 2: Products (readonly) ──────────────── */}
            <TabsContent value="products" className="space-y-4 mt-4">
              {importData.importItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Aucun produit associé à cette entrée
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {importData.importItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border p-4 space-y-3"
                    >
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
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
                            Stock entré
                          </label>
                          <Input
                            value={item.enteredStock}
                            readOnly
                            disabled
                            className="bg-muted/30 cursor-default"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">
                            Prix unitaire (DA)
                          </label>
                          <Input
                            value={item.unitPrice ? item.unitPrice : "—"}
                            readOnly
                            disabled
                            className="bg-muted/30 cursor-default"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── Tab 3: Documents (readonly) ─────────────── */}
            <TabsContent value="documents" className="space-y-4 mt-4">
              {/* Bon de commande */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Bon de commande
                </label>
                {importData.bonDeCommande ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
                    <FileDown className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {getFileName(importData.bonDeCommande)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fichier attaché
                      </p>
                    </div>
                    <a
                      href={`${base_url}/uploads/${importData.bonDeCommande}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Voir
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                    <p className="text-sm text-muted-foreground">
                      Aucun bon de commande joint
                    </p>
                  </div>
                )}
              </div>

              {/* Bon de livraison */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Bon de livraison
                </label>
                {importData.bonDeLivraison ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
                    <FileDown className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {getFileName(importData.bonDeLivraison)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fichier attaché
                      </p>
                    </div>
                    <a
                      href={importData.bonDeLivraison}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Voir
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                    <p className="text-sm text-muted-foreground">
                      Aucun bon de livraison joint
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* ── Footer with action buttons ──────────────── */}
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
                Supprimer l'entrée
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
                Confirmer l'entrée
              </Button>
            </div>
          </DialogFooter>
        </div>
        <ConfirmDeleteModal
          title="Supprimer l'entrée"
          description={`Voulez-vous vraiment supprimer l'entrée #${importData.id} ? Cette action est irréversible.`}
          onOpenChange={setShowDeleteModal}
          onConfirm={handleConfirmDelete}
          open={showDeleteModal}
        />
        <ConfirmActionModal
          title="Confirmer l'entrée"
          description={`Voulez-vous vraiment confirmer l'entrée #${importData.id} ? Cette action est irréversible.`}
          onOpenChange={setShowConfirmModal}
          onConfirm={handleConfirm}
          open={showConfirmModal}
        />
      </DialogContent>
    </Dialog>
  );
}
