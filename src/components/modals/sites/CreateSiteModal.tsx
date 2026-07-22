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
import { useCreateSite } from "@/hooks/sites/useCreateSite";
import { HardHat, Loader2, MapPin, Plus, User } from "lucide-react";

interface CreateSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSiteModal({ open, onOpenChange }: CreateSiteModalProps) {
  const {
    form,
    isLoading,
    error,
    managerOptions,
    loadingManagers,
    managerError,
    handleManagerSearch,
    onSubmit,
    reset,
  } = useCreateSite(() => onOpenChange(false));

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
            Ajouter un chantier
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
                      <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom du chantier
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom du chantier"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Adresse
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'adresse du chantier"
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
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Responsable
                    </FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={managerOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        onSearch={handleManagerSearch}
                        placeholder={
                          loadingManagers
                            ? "Chargement des responsables..."
                            : "Sélectionner un responsable"
                        }
                        searchable
                        disabled={isLoading || loadingManagers}
                      />
                    </FormControl>
                    {managerError && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {managerError}
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
                Ajouter le chantier
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
