// src/components/modals/returns/ConfirmedReturnDetailsModal.tsx
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
import { ReturnEntity } from "@/models/return.model";
import {
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
import { useState } from "react";
import { base_url } from "@/services/axios.client";

interface ConfirmedReturnDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnData: ReturnEntity;
}

export function ConfirmedReturnDetailsModal({
  open,
  onOpenChange,
  returnData,
}: ConfirmedReturnDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("basic");

  // Build document URL
  const bonRetour = returnData.bonRetour;
  const docUrl = bonRetour
    ? `${base_url}/uploads/retours/${returnData.id}/${bonRetour}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Détails du retour — #{returnData.id}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">
              <Info className="h-4 w-4 mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Produits retournés
            </TabsTrigger>
            <TabsTrigger value="documents">
              <ScrollText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
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

            {/* Transporter Information */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Informations du transporteur
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    Nom du transporteur
                  </label>
                  <Input
                    value={returnData.transporterName || "—"}
                    readOnly
                    disabled
                    className="bg-muted/30 cursor-default"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    Matricule
                  </label>
                  <Input
                    value={returnData.transporterMatricule || "—"}
                    readOnly
                    disabled
                    className="bg-muted/30 cursor-default"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
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

          {/* Documents Tab */}
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
                      <p className="text-sm font-medium">Bon de retour</p>
                      <p className="text-xs text-muted-foreground">
                        {bonRetour}
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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
