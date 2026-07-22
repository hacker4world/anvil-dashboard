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
import {
  CustomSelect,
  IconSelectOption,
} from "@/components/reusables/CustomSelect";
import { StatusBanner } from "@/components/reusables/status-banner";
import { SubfamilyModel } from "@/models/Subfamily.model";
import { useSubfamilyDetails } from "@/hooks/subfamilies/useSubfamilyDetails";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  FolderTree,
  IdCard,
  Layers,
  List,
  UserRoundPen,
  Loader2,
} from "lucide-react";

interface SubfamilyDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subfamily: SubfamilyModel | null;
}

export function SubfamilyDetailsModal({
  open,
  onOpenChange,
  subfamily,
}: SubfamilyDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  // Fallback default so the hook is always called (rules of hooks)
  const safeSubfamily: SubfamilyModel = subfamily ?? {
    id: 0,
    name: "",
    createdAt: "",
    updatedAt: "",
  };

  const {
    form,
    isLoading,
    error,
    familyOptions,
    loadingFamilies,
    familyError,
    onSubmit,
    reset: resetForm,
    setError,
  } = useSubfamilyDetails(safeSubfamily, () => {
    resetForm();
    setIsEditMode(false);
    onOpenChange(false);
  });

  // Reset the form and edit mode when the modal opens with a new subfamily
  useEffect(() => {
    if (open && subfamily) {
      form.reset({
        name: subfamily.name,
        familyId: subfamily.familyId?.toString() ?? "",
      });
      setError(null);
      setIsEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, subfamily]);

  // Intercept close to also reset form and edit mode
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      setIsEditMode(false);
    }
    onOpenChange(newOpen);
  };

  // Toggle edit mode: reset form to subfamily's current data when entering edit
  const handleEditModeChange = (editMode: boolean) => {
    setIsEditMode(editMode);
    if (editMode && subfamily) {
      form.reset({
        name: subfamily.name,
        familyId: subfamily.familyId?.toString() ?? "",
      });
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{subfamily?.name}</DialogTitle>
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
              Informations de la sous-famille
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
                  id="update-subfamily-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <FolderTree className="h-3.5 w-3.5 text-muted-foreground" />
                            Nom :
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isLoading}
                              placeholder="Entrez le nom de la sous-famille"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="familyId"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                            Famille :
                          </FormLabel>
                          <FormControl>
                            <CustomSelect
                              options={familyOptions}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={
                                loadingFamilies
                                  ? "Chargement des familles..."
                                  : "Sélectionner une famille"
                              }
                              disabled={isLoading || loadingFamilies}
                            />
                          </FormControl>
                          {familyError && (
                            <p className="text-sm font-medium text-destructive mt-1">
                              {familyError}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FolderTree className="h-3.5 w-3.5 text-muted-foreground" />
                    Nom :
                  </Label>
                  <Input
                    value={subfamily?.name}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    Famille :
                  </Label>
                  <Input
                    value={subfamily?.familyName || ""}
                    disabled
                    className="bg-muted/50"
                  />
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
              form="update-subfamily-form"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundPen className="h-4 w-4" />
              )}
              Modifier la sous-famille
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
