import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBanner } from "@/components/reusables/status-banner";
import { UnitModel } from "@/models/Unit.model";
import { useUpdateUnit } from "@/hooks/units/updateUnit.hook";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IdCard, List, Ruler, UserRoundPen, Loader2 } from "lucide-react";

interface UnitDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: UnitModel | null;
}

export function UnitDetailsModal({
  open,
  onOpenChange,
  unit,
}: UnitDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  // Fallback default so the hook is always called (rules of hooks)
  const safeUnit: UnitModel = unit ?? {
    id: 0,
    name: "",
  };

  const {
    form,
    isLoading,
    error,
    onSubmit,
    reset: resetForm,
    setError,
  } = useUpdateUnit(safeUnit, () => {
    resetForm();
    setIsEditMode(false);
    onOpenChange(false);
  });

  // Reset the form and edit mode when the modal opens with a new unit
  useEffect(() => {
    if (open && unit) {
      form.reset({
        name: unit.name,
      });
      setError(null);
      setIsEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, unit]);

  // Intercept close to also reset form and edit mode
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      setIsEditMode(false);
    }
    onOpenChange(newOpen);
  };

  // Toggle edit mode: reset form to unit's current data when entering edit
  const handleEditModeChange = (editMode: boolean) => {
    setIsEditMode(editMode);
    if (editMode && unit) {
      form.reset({
        name: unit.name,
      });
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{unit?.name}</DialogTitle>
        </DialogHeader>

        {/* Edit Mode Toggle */}
        <div
          className={cn(
            "rounded-lg px-4 py-3 flex items-center justify-between border transition-colors mb-6",
            isEditMode
              ? "bg-primary/5 border-primary/20"
              : "bg-muted/50 border-border",
          )}
        >
          <div className="flex items-center gap-3">
            <Switch
              id="edit-mode"
              checked={isEditMode}
              onCheckedChange={handleEditModeChange}
              className="data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="edit-mode"
              className="text-sm font-medium cursor-pointer"
            >
              Mode édition
            </Label>
          </div>
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-md transition-colors",
              isEditMode
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {isEditMode ? "Modification activée" : "Lecture seule"}
          </span>
        </div>

        {/* Error Banner */}
        {error && (
          <StatusBanner variant="danger" title="Erreur" description={error} />
        )}

        <Tabs defaultValue="informations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informations" className="gap-2">
              <IdCard className="h-4 w-4" />
              Informations de l'unité
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <List className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-4 mt-4">
            {isEditMode ? (
              <Form {...form}>
                <form
                  id="update-unit-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                            Nom :
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    Nom :
                  </Label>
                  <Input value={unit?.name} disabled className="bg-muted/50" />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                Historique des transactions
              </h3>
              <p className="text-sm text-muted-foreground">
                Aucun historique disponible pour le moment.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setIsEditMode(false);
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            Fermer
          </Button>
          {isEditMode && (
            <Button
              type="submit"
              form="update-unit-form"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundPen className="h-4 w-4" />
              )}
              Modifier l'unité
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
