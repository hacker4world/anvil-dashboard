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
import { useCreateCategory } from "@/hooks/categories/useCreateCategory";
import { Layers, Loader2, Plus, Tag } from "lucide-react";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryModal({
  open,
  onOpenChange,
}: CreateCategoryModalProps) {
  const {
    form,
    isLoading,
    error,
    subfamilyOptions,
    loadingSubfamilies,
    subfamilyError,
    handleSubfamilySearch,
    onSubmit,
    reset,
  } = useCreateCategory(() => onOpenChange(false));

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
            Ajouter une catégorie
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
                      <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom de la catégorie
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom de la catégorie"
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
                name="subfamilyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      Sous-famille
                    </FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={subfamilyOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        onSearch={handleSubfamilySearch}
                        placeholder={
                          loadingSubfamilies
                            ? "Chargement des sous-familles..."
                            : "Sélectionner une sous-famille"
                        }
                        searchable
                        disabled={isLoading || loadingSubfamilies}
                      />
                    </FormControl>
                    {subfamilyError && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {subfamilyError}
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
                Ajouter la catégorie
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
