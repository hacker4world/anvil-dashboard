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
import { useCreateProduct } from "@/hooks/articles/useCreateProduct";
import { Loader2, Plus, Package, Building2, Ruler, Tag } from "lucide-react";

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductModal({
  open,
  onOpenChange,
}: CreateProductModalProps) {
  const {
    form,
    isLoading,
    error,
    unitOptions,
    warehouseOptions,
    categoryOptions,
    loadingUnits,
    loadingWarehouses,
    loadingCategories,
    unitsError,
    warehousesError,
    categoriesError,
    handleCategorySearch,
    onSubmit,
    reset,
  } = useCreateProduct(() => {
    onOpenChange(false);
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5" />
            Ajouter un produit
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Global error banner */}
            {error && (
              <StatusBanner
                variant="danger"
                title={"Erreur de création du produit"}
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
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom du produit
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom du produit"
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
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      Stock minimum
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                        Unité
                      </FormLabel>
                      <FormControl>
                        <CustomSelect
                          options={unitOptions}
                          value={field.value ? Number(field.value) : ""}
                          onValueChange={(val) => field.onChange(String(val))}
                          placeholder={
                            loadingUnits
                              ? "Chargement des unités..."
                              : "Sélectionner une unité"
                          }
                          searchable={false}
                          disabled={isLoading || loadingUnits}
                        />
                      </FormControl>
                      {unitsError && (
                        <p className="text-sm text-destructive">{unitsError}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        Catégorie
                      </FormLabel>
                      <FormControl>
                        <CustomSelect
                          options={categoryOptions}
                          value={field.value ? Number(field.value) : ""}
                          onValueChange={(val) => field.onChange(String(val))}
                          onSearch={handleCategorySearch}
                          placeholder={
                            loadingCategories
                              ? "Chargement des catégories..."
                              : "Sélectionner une catégorie"
                          }
                          searchable
                          disabled={isLoading || loadingCategories}
                        />
                      </FormControl>
                      {categoriesError && (
                        <p className="text-sm text-destructive">
                          {categoriesError}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Dépôt
                    </FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={warehouseOptions}
                        value={field.value ? Number(field.value) : ""}
                        onValueChange={(val) => field.onChange(String(val))}
                        placeholder={
                          loadingWarehouses
                            ? "Chargement des dépôts..."
                            : "Sélectionner un dépôt"
                        }
                        searchable={false}
                        disabled={isLoading || loadingWarehouses}
                      />
                    </FormControl>
                    {warehousesError && (
                      <p className="text-sm text-destructive">
                        {warehousesError}
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
                onClick={() => onOpenChange(false)}
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
                Ajouter le produit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
