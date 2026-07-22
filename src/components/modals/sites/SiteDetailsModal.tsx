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
import { CustomSelect } from "@/components/reusables/CustomSelect";
import { SiteModel } from "@/models/Site.model";
import { useSiteDetails } from "@/hooks/sites/useSiteDetails";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  HardHat,
  IdCard,
  List,
  MapPin,
  User,
  UserRoundPen,
  Loader2,
} from "lucide-react";

interface SiteDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: SiteModel | null;
}

export function SiteDetailsModal({
  open,
  onOpenChange,
  site,
}: SiteDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  // Fallback default so the hook is always called (rules of hooks)
  const safeSite: SiteModel = site ?? {
    id: 0,
    name: "",
    address: "",
    managerName: "",
    managerId: undefined,
    createdAt: "",
    updatedAt: "",
  };

  const {
    form,
    isLoading,
    error,
    managerOptions,
    loadingManagers,
    managerError,
    handleManagerSearch,
    onSubmit,
    reset: resetForm,
    setError,
  } = useSiteDetails(safeSite, () => {
    resetForm();
    setIsEditMode(false);
    onOpenChange(false);
  });

  // Reset form and state when modal opens with a site or site changes
  useEffect(() => {
    if (open && site) {
      form.reset({
        name: site.name,
        address: site.address,
        managerId: site.managerId ?? undefined,
      });
      setError(null);
      setIsEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, site]);

  // Intercept close to also reset form state
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      setIsEditMode(false);
    }
    onOpenChange(newOpen);
  };

  // Toggle edit mode: reset form to site's current data when entering edit
  const handleEditModeChange = (editMode: boolean) => {
    setIsEditMode(editMode);
    if (editMode && site) {
      form.reset({
        name: site.name,
        address: site.address,
        managerId: site.managerId ?? undefined,
      });
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{site?.name}</DialogTitle>
        </DialogHeader>

        {/* Edit Mode Toggle */}
        <div
          className={cn(
            "rounded-lg px-4 py-3 flex items-center justify-between border transition-colors",
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

        <Tabs defaultValue="informations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informations" className="gap-2">
              <IdCard className="h-4 w-4" />
              Informations du chantier
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
                  id="update-site-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {error && (
                    <StatusBanner
                      variant="danger"
                      title="Erreur"
                      description={error}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                            Nom :
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom du chantier"
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
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Adresse :
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Adresse du chantier"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Responsable :
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
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                    Nom :
                  </Label>
                  <Input value={site?.name} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Adresse :
                  </Label>
                  <Input
                    value={site?.address}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Responsable :
                  </Label>
                  <Input
                    value={site?.managerName}
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
              form="update-site-form"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundPen className="h-4 w-4" />
              )}
              Modifier le chantier
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
