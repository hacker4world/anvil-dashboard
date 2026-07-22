import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBanner } from "@/components/reusables/status-banner";
import {
  Filter,
  Loader2,
  RotateCcw,
  User,
  MapPin,
  ListFilter,
  Phone,
} from "lucide-react";
import { useFilterManufacturersModal } from "@/hooks/manufacturers/useFilterManufacturersModal";

interface FilterManufacturersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterManufacturersModal({
  open,
  onOpenChange,
}: FilterManufacturersModalProps) {
  const {
    contactInput,
    setContactInput,
    addressInput,
    setAddressInput,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  } = useFilterManufacturersModal(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les fabricants
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            fabricants.
          </DialogDescription>
        </DialogHeader>

        {/* Error banner */}
        {error && (
          <div className="mb-2">
            <StatusBanner variant="danger" title="Erreur" description={error} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Adresse :
            </Label>
            <Input
              id="address"
              placeholder="Rechercher par adresse"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                if (error) clearError();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact" className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Contact :
            </Label>
            <Input
              id="contact"
              placeholder="Rechercher par contact"
              value={contactInput}
              onChange={(e) => {
                setContactInput(e.target.value);
                if (error) clearError();
              }}
            />
          </div>
        </div>

        <Separator className="my-4" />

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Réinitialiser
          </Button>
          <Button className="gap-2" onClick={handleApply} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
