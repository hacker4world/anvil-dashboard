import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomSelect } from "@/components/reusables/CustomSelect";
import { StatusBanner } from "@/components/reusables/status-banner";
import {
  Filter,
  Layers,
  ListFilter,
  Loader2,
  RotateCcw,
  FolderTree,
} from "lucide-react";
import { useFilterSubfamiliesModal } from "@/hooks/subfamilies/useFilterSubfamiliesModal";

interface FilterSubfamiliesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterSubfamiliesModal({
  open,
  onOpenChange,
}: FilterSubfamiliesModalProps) {
  const {
    selectedFamilyId,
    setSelectedFamilyId,
    isLoading,
    error,
    familyOptions,
    loadingFamilies,
    familyError,
    handleApply,
    handleReset,
    clearError,
  } = useFilterSubfamiliesModal(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les sous-familles
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            sous-familles.
          </DialogDescription>
        </DialogHeader>

        {/* Error banner */}
        {error && (
          <div className="mb-2">
            <StatusBanner variant="danger" title="Erreur" description={error} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="family" className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            Famille :
          </Label>
          <CustomSelect
            options={familyOptions}
            value={selectedFamilyId}
            onValueChange={(value) => {
              setSelectedFamilyId(String(value));
              if (error) clearError();
            }}
            placeholder={
              loadingFamilies
                ? "Chargement des familles..."
                : "Filtrer par famille"
            }
            searchable
            disabled={isLoading || loadingFamilies}
          />
          {familyError && (
            <p className="text-sm font-medium text-destructive mt-1">
              {familyError}
            </p>
          )}
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
