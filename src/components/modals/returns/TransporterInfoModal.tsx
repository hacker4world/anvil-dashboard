// TransporterInfoModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBanner } from "@/components/reusables/status-banner";
import { Loader2, Truck } from "lucide-react";
import { useState } from "react";

interface TransporterInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (info: {
    transporterName: string;
    transporterMatricule: string;
  }) => void;
}

export function TransporterInfoModal({
  open,
  onOpenChange,
  isSubmitting,
  error,
  onSubmit,
}: TransporterInfoModalProps) {
  const [name, setName] = useState("");
  const [matricule, setMatricule] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !matricule.trim()) return;
    onSubmit({
      transporterName: name.trim(),
      transporterMatricule: matricule.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Informations du transporteur
          </DialogTitle>
        </DialogHeader>

        {error && (
          <StatusBanner variant="danger" title="Erreur" description={error} />
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="transporterName">Nom du transporteur *</Label>
            <Input
              id="transporterName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Société Transport"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transporterMatricule">Matricule *</Label>
            <Input
              id="transporterMatricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="Ex: 1234-AB-56"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || !matricule.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Confirmer le retour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
