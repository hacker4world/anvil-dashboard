// ConfirmReturnModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ReturnEntity } from "@/models/return.model";
import { StatusBanner } from "@/components/reusables/status-banner";
import { Loader2, Package, ArrowRight } from "lucide-react";
import { useState } from "react";

interface ConfirmReturnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnData: ReturnEntity;
  isSubmitting: boolean;
  error: string | null;
  onProceed: (items: { productId: number; restock: boolean }[]) => void;
}

export function ConfirmReturnModal({
  open,
  onOpenChange,
  returnData,
  isSubmitting,
  error,
  onProceed,
}: ConfirmReturnModalProps) {
  const [restockSelections, setRestockSelections] = useState<
    Record<number, boolean>
  >({});

  const handleSubmit = () => {
    const items = returnData.returnItems.map((item) => ({
      productId: item.product.id,
      restock: restockSelections[item.product.id] ?? false,
    }));
    onProceed(items);
    onOpenChange(false); // close this modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Confirmation du retour – #{returnData.id}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <StatusBanner variant="danger" title="Erreur" description={error} />
        )}

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Sélectionnez les produits à remettre en stock :
          </p>
          {returnData.returnItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border rounded-md p-3"
            >
              <Checkbox
                id={`restock-${item.product.id}`}
                checked={restockSelections[item.product.id] ?? false}
                onCheckedChange={(checked) =>
                  setRestockSelections((prev) => ({
                    ...prev,
                    [item.product.id]: checked === true,
                  }))
                }
              />
              <label
                htmlFor={`restock-${item.product.id}`}
                className="text-sm font-medium flex-1"
              >
                {item.product.name} — {item.returnedStock} unité(s)
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-2" />
            )}
            Suivant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
