// /src/components/modals/articles/ProductDetailsModal.tsx
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
import { CustomSelect } from "@/components/reusables/CustomSelect";
import { StatusBanner } from "@/components/reusables/status-banner";
import { ArticleModel } from "@/models/Product.model";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Building2,
  Coins,
  IdCard,
  List,
  Loader2,
  Package,
  Phone,
  Ruler,
  Tag,
  Truck,
  User,
  UserRoundPen,
} from "lucide-react";
import { useProductDetails } from "@/hooks/articles/useProductDetails";

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: ArticleModel | null;
}

export function ProductDetailsModal({
  open,
  onOpenChange,
  article,
}: ProductDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    form,
    isLoading,
    error,
    setError,
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
  } = useProductDetails(article, () => {
    onOpenChange(false);
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditMode(false);
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{article?.name}</DialogTitle>
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
              onCheckedChange={(checked) => {
                setIsEditMode(checked);
                setError?.(null);
              }}
              disabled={isLoading}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informations" className="gap-2">
              <IdCard className="h-4 w-4" />
              Informations du produit
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="gap-2">
              <Truck className="h-4 w-4" />
              Fournisseurs
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <List className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-4 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Global error banner */}
                {error && (
                  <StatusBanner
                    variant="danger"
                    title="Erreur de modification du produit"
                    description={error}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      Nom :
                    </Label>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="name"
                                placeholder="Entrez le nom du produit"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <Input
                        id="name"
                        value={article?.name || ""}
                        disabled
                        className="bg-muted/50"
                      />
                    )}
                  </div>

                  {/* Stock minimum */}
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      Stock minimum :
                    </Label>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="currentStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="stock"
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
                    ) : (
                      <Input
                        id="stock"
                        value={article?.currentStock ?? ""}
                        disabled
                        className="bg-muted/50"
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                          Catégorie :
                        </FormLabel>
                        {isEditMode ? (
                          <>
                            <FormControl>
                              <CustomSelect
                                options={categoryOptions}
                                value={field.value ? Number(field.value) : ""}
                                onValueChange={(val) =>
                                  field.onChange(String(val))
                                }
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
                          </>
                        ) : (
                          <Input
                            value={article?.categoryName || ""}
                            disabled
                            className="bg-muted/50"
                          />
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Unité */}
                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                          Unité :
                        </FormLabel>
                        {isEditMode ? (
                          <>
                            <FormControl>
                              <CustomSelect
                                options={unitOptions}
                                value={field.value ? Number(field.value) : ""}
                                onValueChange={(val) =>
                                  field.onChange(String(val))
                                }
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
                              <p className="text-sm text-destructive">
                                {unitsError}
                              </p>
                            )}
                            <FormMessage />
                          </>
                        ) : (
                          <Input
                            value={article?.unitName || ""}
                            disabled
                            className="bg-muted/50"
                          />
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Average Price (read-only) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                      Prix moyen :
                    </Label>
                    <Input
                      value={
                        article?.averagePrice != null
                          ? `${Number(article.averagePrice).toFixed(2)} DT`
                          : ""
                      }
                      disabled
                      className="bg-muted/50"
                    />
                  </div>

                  {/* Total Stock (read-only) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      Stock total :
                    </Label>
                    <Input
                      value={article?.currentStock ?? ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="warehouseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          Dépôt :
                        </FormLabel>
                        {isEditMode ? (
                          <>
                            <FormControl>
                              <CustomSelect
                                options={warehouseOptions}
                                value={field.value ? Number(field.value) : ""}
                                onValueChange={(val) =>
                                  field.onChange(String(val))
                                }
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
                          </>
                        ) : (
                          <Input
                            value={article?.warehouseName || ""}
                            disabled
                            className="bg-muted/50"
                          />
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Fournisseurs du produit
              </h3>

              {article?.suppliers && article.suppliers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {article.suppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-start gap-3 rounded-lg border p-4 bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <p className="text-sm font-medium leading-none">
                          {supplier.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {supplier.contact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                  <Truck className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Aucun fournisseur associé à ce produit.
                  </p>
                </div>
              )}
            </div>
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
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Fermer
          </Button>
          {isEditMode && (
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundPen className="h-4 w-4" />
              )}
              Modifier le produit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
