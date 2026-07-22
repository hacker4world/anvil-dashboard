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
import { StatusBanner } from "@/components/reusables/status-banner";
import { useCreateManufacturer } from "@/hooks/manufacturers/createManufacturer.hook";
import { Loader2, Plus, User, MapPin, Phone } from "lucide-react";

interface CreateManufacturerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateManufacturerModal({
  open,
  onOpenChange,
}: CreateManufacturerModalProps) {
  const { form, isLoading, error, onSubmit, reset } = useCreateManufacturer(
    () => onOpenChange(false),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) reset();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5" />
            Ajouter un fabricant
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
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom du fabricant
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom du fabricant"
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
                        placeholder="Entrez l'adresse du fabricant"
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
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Contact
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le contact du fabricant"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
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
                Ajouter le fabricant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
