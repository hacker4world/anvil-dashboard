// /src/components/modals/exports/ConfirmedExportDetailsModal.tsx

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
import { Badge } from "@/components/ui/badge";
import { StatusBanner } from "@/components/reusables/status-banner";
import {
  useConfirmedExportDetails,
  ConfirmedExportDetailsTab,
} from "@/hooks/confirmed-exports/useConfirmedExportsModal";
import {
  ExportEntity,
  ExportType,
  EXPORT_TYPE_BADGE_CLASSES,
  EXPORT_TYPE_ICONS,
  EXPORT_TYPE_LABELS,
} from "@/models/export.model";
import {
  Loader2,
  Trash2,
  Package,
  FileText,
  Info,
  Calendar,
  User,
  MessageSquare,
  Boxes,
  ArrowUpDown,
  Warehouse,
  HardHat,
  ArrowUpRight,
  Building2,
  MapPin,
  FileBadge,
  UserCircle,
  Truck,
  IdCard,
  ScrollText,
  ExternalLink,
} from "lucide-react";
import { ConfirmDeleteModal } from "@/components/reusables/DeleteConfirmation";
import { base_url } from "@/services/axios.client";

interface ConfirmedExportDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportData: ExportEntity;
}

export function ConfirmedExportDetailsModal({
  open,
  onOpenChange,
  exportData,
}: ConfirmedExportDetailsModalProps) {
  const {
    activeTab,
    setActiveTab,
    isDeleting,
    error,
    showDeleteModal,
    setShowDeleteModal,
    handleOpenDeleteModal,
    handleConfirmDelete,
    reset,
  } = useConfirmedExportDetails(exportData, () => onOpenChange(false));

  const handleTabChange = (value: string) => {
    setActiveTab(value as ConfirmedExportDetailsTab);
  };

  const ExportTypeIcon = exportData.exportType
    ? EXPORT_TYPE_ICONS[exportData.exportType]
    : null;

  // Build the document URL
  const ficheExpedition = exportData.ficheExpedition;
  const docUrl = ficheExpedition
    ? `${base_url}/uploads/sorties/${exportData.id}/${ficheExpedition}`
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Détails de la sortie confirmée — #{exportData.id}
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" disabled={isDeleting}>
                <Info className="h-4 w-4 mr-2" />
                Infos de base
              </TabsTrigger>
              <TabsTrigger value="products" disabled={isDeleting}>
                <Boxes className="h-4 w-4 mr-2" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="type-details" disabled={isDeleting}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Détails type
              </TabsTrigger>
              <TabsTrigger value="documents" disabled={isDeleting}>
                <ScrollText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Basic Information ─────────────────── */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date
                </label>
                <Input
                  type="date"
                  value={exportData.date}
                  readOnly
                  disabled
                  className="bg-muted/30 cursor-default"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Magasinier
                </label>
                <Input
                  value={
                    exportData.account
                      ? `${exportData.account.firstname} ${exportData.account.lastname}`
                      : "—"
                  }
                  readOnly
                  disabled
                  className="bg-muted/30 cursor-default"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  Type de sortie
                </label>
                <div className="pt-1">
                  {exportData.exportType && ExportTypeIcon ? (
                    <Badge
                      variant="outline"
                      className={`inline-flex items-center font-medium ${EXPORT_TYPE_BADGE_CLASSES[exportData.exportType]}`}
                    >
                      <ExportTypeIcon className="h-4 w-4" />
                      {EXPORT_TYPE_LABELS[exportData.exportType]}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  Observation
                </label>
                <Textarea
                  value={exportData.observation || "—"}
                  readOnly
                  disabled
                  rows={3}
                  className="bg-muted/30 cursor-default resize-none"
                />
              </div>
            </TabsContent>

            {/* ── Tab 2: Products ──────────────────────────── */}
            <TabsContent value="products" className="space-y-4 mt-4">
              {exportData.exportItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Aucun produit associé à cette sortie
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exportData.exportItems.map((item, index) => (
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
                            Stock sorti
                          </label>
                          <Input
                            value={item.exitedStock}
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

            {/* ── Tab 3: Type-specific Details ────────────── */}
            <TabsContent value="type-details" className="space-y-4 mt-4">
              {/* TO_WAREHOUSE */}
              {exportData.exportType === ExportType.TO_WAREHOUSE && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base font-semibold text-foreground">
                      Destination : Dépôt
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
                      Dépôt
                    </label>
                    <Input
                      value={exportData.warehouse?.name ?? "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>
                </div>
              )}

              {/* TO_CONSTRUCTION_SITE */}
              {exportData.exportType === ExportType.TO_CONSTRUCTION_SITE && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HardHat className="h-5 w-5 text-amber-600" />
                    <h3 className="text-base font-semibold text-foreground">
                      Destination : Chantier
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                      Chantier
                    </label>
                    <Input
                      value={exportData.constructionSite?.name ?? "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>
                </div>
              )}

              {/* EXTERNAL */}
              {exportData.exportType === ExportType.EXTERNAL && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base font-semibold text-foreground">
                      Destination : Externe
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom de l&apos;entreprise
                    </label>
                    <Input
                      value={exportData.entrepriseName || "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Adresse
                    </label>
                    <Input
                      value={exportData.address || "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <FileBadge className="h-3.5 w-3.5 text-muted-foreground" />
                      Matricule fiscale
                    </label>
                    <Input
                      value={exportData.matriculeFiscale || "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom du client
                    </label>
                    <Input
                      value={exportData.clientName || "—"}
                      readOnly
                      disabled
                      className="bg-muted/30 cursor-default"
                    />
                  </div>

                  {/* Transporter section */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Transporteur
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          exportData.withTransporter
                            ? "bg-green-50 text-green-700 border-green-200 text-xs"
                            : "bg-gray-50 text-gray-500 border-gray-200 text-xs"
                        }
                      >
                        {exportData.withTransporter ? "Avec" : "Sans"}
                      </Badge>
                    </div>

                    {exportData.withTransporter && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Nom du transporteur
                          </label>
                          <Input
                            value={exportData.transporterName || "—"}
                            readOnly
                            disabled
                            className="bg-muted/30 cursor-default"
                          />
                        </div>

                        <div className="space-y-2 mt-3">
                          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                            Matricule du transporteur
                          </label>
                          <Input
                            value={exportData.transporterMatricule || "—"}
                            readOnly
                            disabled
                            className="bg-muted/30 cursor-default"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── Tab 4: Documents ────────────────────────── */}
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
          </Tabs>

          {/* ── Footer ──────────────────────────────────── */}
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isDeleting}
            >
              Fermer
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleOpenDeleteModal}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Supprimer la sortie
            </Button>
          </DialogFooter>
        </div>

        <ConfirmDeleteModal
          title="Supprimer la sortie"
          description={`Voulez-vous vraiment supprimer la sortie confirmée #${exportData.id} ? Cette action est irréversible.`}
          onOpenChange={setShowDeleteModal}
          onConfirm={handleConfirmDelete}
          open={showDeleteModal}
        />
      </DialogContent>
    </Dialog>
  );
}
