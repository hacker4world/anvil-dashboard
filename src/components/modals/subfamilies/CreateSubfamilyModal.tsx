import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/reusables/CustomSelect";
import { StatusBanner } from "@/components/reusables/status-banner";
import { useCreateSubfamily } from "@/hooks/subfamilies/useCreateSubfamily";
import { FolderTree, Layers, Loader2, Plus } from "lucide-react";

interface CreateSubfamilyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubfamilyModal({
  open,
  onOpenChange,
}: CreateSubfamilyModalProps) {
  const {
    form,
    isLoading,
    error,
    familyOptions,
    loadingFamilies,
    familyError,
    onSubmit,
    reset,
  } = useCreateSubfamily(() => onOpenChange(false));

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) reset();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5" />
            Ajouter une sous-famille
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <StatusBanner
                variant="danger"
                title="Erreur"
                description={error}
              />
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FolderTree className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom de la sous-famille
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom de la sous-famille"
                        disabled={isLoading}
                        {...field}
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
                  <FormItem>
                    <FormLabel>
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      Famille
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

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Ajouter la sous-famille
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
