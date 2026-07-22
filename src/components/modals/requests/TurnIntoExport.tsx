// src/components/modals/requests/TurnIntoExportModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBanner } from "@/components/reusables/status-banner";
import { ProductRequestEntity } from "@/models/request.model";
import { Loader2, Truck, Info, Coins } from "lucide-react";
import { toast } from "sonner";

interface TurnIntoExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ProductRequestEntity;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: {
    transporterName: string;
    transporterMatricule: string;
    observation?: string;
    unitPrices: { productId: number; unitPrice: number }[];
  }) => Promise<void>;
}

export function TurnIntoExportModal({
  open,
  onOpenChange,
  request,
  isSubmitting,
  error,
  onSubmit,
}: TurnIntoExportModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Basic info form state
  const [transporterName, setTransporterName] = useState("");
  const [transporterMatricule, setTransporterMatricule] = useState("");
  const [observation, setObservation] = useState(request.observation || "");

  // Unit prices per product
  const [unitPrices, setUnitPrices] = useState<Record<number, number>>({});

  // Initialize unit prices with 0 for each product
  useEffect(() => {
    if (open) {
      const initial: Record<number, number> = {};
      request.requestItems?.forEach((item) => {
        initial[item.product.id] = 0;
      });
      setUnitPrices(initial);
      setTransporterName("");
      setTransporterMatricule("");
      setObservation(request.observation || "");
      setActiveTab("info");
    }
  }, [open, request]);

  const handleUnitPriceChange = (productId: number, value: string) => {
    const num = parseFloat(value) || 0;
    setUnitPrices((prev) => ({ ...prev, [productId]: num }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!transporterName.trim()) {
      toast.error("Le nom du transporteur est requis");
      return;
    }
    if (!transporterMatricule.trim()) {
      toast.error("La matricule du transporteur est requise");
      return;
    }

    const unitPriceArray = Object.entries(unitPrices).map(
      ([productId, price]) => ({
        productId: Number(productId),
        unitPrice: price,
      }),
    );

    await onSubmit({
      transporterName: transporterName.trim(),
      transporterMatricule: transporterMatricule.trim(),
      observation: observation.trim() || undefined,
      unitPrices: unitPriceArray,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Convertir la demande #{request.id} en exportation
          </DialogTitle>
          <DialogDescription>
            Renseignez les informations du transporteur et les prix unitaires
            pour chaque produit.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <StatusBanner variant="danger" title="Erreur" description={error} />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" disabled={isSubmitting}>
              <Info className="h-4 w-4 mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="prices" disabled={isSubmitting}>
              <Coins className="h-4 w-4 mr-2" />
              Prix unitaires
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Basic info ─────────────────── */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transporter-name">Nom du transporteur *</Label>
                <Input
                  id="transporter-name"
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transporter-matricule">
                  Matricule du transporteur *
                </Label>
                <Input
                  id="transporter-matricule"
                  value={transporterMatricule}
                  onChange={(e) => setTransporterMatricule(e.target.value)}
                  placeholder="Ex: TR-12345"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observation</Label>
              <Textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Observation pour l'exportation (optionnelle)"
                disabled={isSubmitting}
                rows={3}
              />
            </div>
          </TabsContent>

          {/* ── Tab 2: Product unit prices ─────────── */}
          <TabsContent value="prices" className="space-y-4 mt-4">
            {request.requestItems?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun produit dans cette demande.
              </div>
            ) : (
              <div className="space-y-4">
                {request.requestItems?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        {item.product.name}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        Demande: {item.requestedStock}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Quantité à exporter
                        </Label>
                        <Input
                          value={item.requestedStock}
                          disabled
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Prix unitaire (DA) *
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={unitPrices[item.product.id] ?? 0}
                          onChange={(e) =>
                            handleUnitPriceChange(
                              item.product.id,
                              e.target.value,
                            )
                          }
                          placeholder="0.00"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Truck className="h-4 w-4" />
            )}
            Convertir en exportation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
