// /src/components/modals/imports/CreateImportModal.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBanner } from "@/components/reusables/status-banner";
import { CustomSelect } from "@/components/reusables/CustomSelect";
import {
  useCreateImport,
  ImportTab,
} from "@/hooks/pending-imports/useCreateImport";
import {
  Loader2,
  Plus,
  Trash2,
  Package,
  FileText,
  Upload,
  Info,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Factory,
  User,
  MessageSquare,
  Boxes,
} from "lucide-react";

interface CreateImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateImportModal({
  open,
  onOpenChange,
}: CreateImportModalProps) {
  const {
    form,
    activeTab,
    setActiveTab,
    goToNextTab,
    goToPrevTab,
    supplierOptions,
    loadingSuppliers,
    suppliersError,
    handleSupplierSearch,
    manufacturerOptions,
    loadingManufacturers,
    manufacturersError,
    handleManufacturerSearch,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    importItems,
    addItem,
    removeItem,
    updateItem,
    bonDeCommandeFile,
    bonDeLivraisonFile,
    setBonDeCommandeFile,
    setBonDeLivraisonFile,
    isLoading,
    onSubmit,
    reset,
    productsValidationErrors,
    error,
    documentsError,
  } = useCreateImport(() => onOpenChange(false));

  const handleTabChange = (value: string) => {
    setActiveTab(value as ImportTab);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) reset();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5" />
            Ajouter une nouvelle entrée
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {error && (
              <StatusBanner
                variant="danger"
                title="Erreur"
                description={error}
              />
            )}

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" disabled={isLoading}>
                  <Info className="h-4 w-4 mr-2" />
                  Informations de base
                </TabsTrigger>
                <TabsTrigger value="products" disabled={isLoading}>
                  <Boxes className="h-4 w-4 mr-2" />
                  Produits
                </TabsTrigger>
                <TabsTrigger value="documents" disabled={isLoading}>
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>

              {/* ── Tab 1: Basic Information ─────────────────── */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Calendar className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <User className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                        Fournisseur
                      </FormLabel>
                      <FormControl>
                        {loadingSuppliers ? (
                          <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Chargement des fournisseurs...
                            </span>
                          </div>
                        ) : suppliersError ? (
                          <StatusBanner
                            variant="danger"
                            title="Erreur"
                            description={suppliersError}
                          />
                        ) : (
                          <CustomSelect
                            options={supplierOptions}
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            onSearch={handleSupplierSearch}
                            placeholder="Sélectionner un fournisseur"
                            searchable
                            disabled={isLoading}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacturerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Factory className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                        Fabricant
                      </FormLabel>
                      <FormControl>
                        {loadingManufacturers ? (
                          <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Chargement des fabricants...
                            </span>
                          </div>
                        ) : manufacturersError ? (
                          <StatusBanner
                            variant="danger"
                            title="Erreur"
                            description={manufacturersError}
                          />
                        ) : (
                          <CustomSelect
                            options={manufacturerOptions}
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            onSearch={handleManufacturerSearch}
                            placeholder="Sélectionner un fabricant"
                            searchable
                            disabled={isLoading}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <MessageSquare className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                        Observation
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Entrez une observation (optionnel)"
                          disabled={isLoading}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* ── Tab 2: Products ──────────────────────────── */}
              <TabsContent value="products" className="space-y-4 mt-4">
                {productsError && (
                  <StatusBanner
                    variant="danger"
                    title="Erreur"
                    description={productsError}
                  />
                )}

                <div className="space-y-4">
                  {importItems.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border p-4 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          Produit {index + 1}
                        </h4>
                        {importItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={isLoading}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <span className="sr-only">
                              Supprimer le produit
                            </span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Product select — search triggered on Enter */}
                      <div>
                        <FormLabel className="text-xs">
                          <Package className="h-3 w-3 inline mr-1 text-muted-foreground" />
                          Produit
                        </FormLabel>
                        {loadingProducts ? (
                          <div className="flex items-center gap-2 h-10 px-3 border rounded-md mt-1">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Chargement des produits...
                            </span>
                          </div>
                        ) : (
                          <CustomSelect
                            options={productOptions}
                            value={item.productId}
                            onValueChange={(value) =>
                              updateItem(index, "productId", Number(value))
                            }
                            onSearch={handleProductSearch}
                            placeholder="Sélectionner un produit"
                            searchable
                            disabled={isLoading}
                          />
                        )}
                      </div>

                      {productsValidationErrors[index]?.productId && (
                        <p className="text-xs font-medium text-destructive mt-1">
                          {productsValidationErrors[index].productId}
                        </p>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        {/* Entered stock */}
                        <div>
                          <FormLabel className="text-xs">Stock entré</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={item.enteredStock}
                            onChange={(e) =>
                              updateItem(index, "enteredStock", e.target.value)
                            }
                            disabled={isLoading}
                            className="mt-1"
                          />
                        </div>

                        {productsValidationErrors[index]?.enteredStock && (
                          <p className="text-xs font-medium text-destructive mt-1">
                            {productsValidationErrors[index].enteredStock}
                          </p>
                        )}

                        {/* Unit price */}
                        <div>
                          <FormLabel className="text-xs">
                            Prix unitaire (DA)
                          </FormLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(index, "unitPrice", e.target.value)
                            }
                            disabled={isLoading}
                            className="mt-1"
                          />
                        </div>
                        {productsValidationErrors[index]?.unitPrice && (
                          <p className="text-xs font-medium text-destructive mt-1">
                            {productsValidationErrors[index].unitPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add product button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={isLoading}
                  className="w-full gap-2 border-dashed"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </Button>
              </TabsContent>

              {/* ── Tab 3: Documents ─────────────────────────── */}
              <TabsContent value="documents" className="space-y-4 mt-4">
                {documentsError && (
                  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 mb-4">
                    <p className="text-sm font-medium text-destructive">
                      {documentsError}
                    </p>
                  </div>
                )}
                {/* Bon de commande */}
                <div className="space-y-2">
                  <FormLabel>
                    <Upload className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                    Bon de commande
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setBonDeCommandeFile(e.target.files?.[0] ?? null)
                      }
                      disabled={isLoading}
                      className="flex-1"
                    />
                  </div>
                  {bonDeCommandeFile && (
                    <p className="text-xs text-muted-foreground">
                      Fichier sélectionné : {bonDeCommandeFile.name}
                    </p>
                  )}
                </div>

                {/* Bon de livraison */}
                <div className="space-y-2">
                  <FormLabel>
                    <Upload className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                    Bon de livraison
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setBonDeLivraisonFile(e.target.files?.[0] ?? null)
                      }
                      disabled={isLoading}
                      className="flex-1"
                    />
                  </div>
                  {bonDeLivraisonFile && (
                    <p className="text-xs text-muted-foreground">
                      Fichier sélectionné : {bonDeLivraisonFile.name}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* ── Footer with navigation ────────────────────── */}
            <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between">
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    disabled={isLoading}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
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

                {activeTab !== "documents" ? (
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    disabled={isLoading}
                    className="gap-1"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Créer l'entrée
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
