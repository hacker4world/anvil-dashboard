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
  useCreateExport,
  ExportTab,
} from "@/hooks/pending-exports/useCreateExport";
import {
  Loader2,
  Plus,
  Trash2,
  Package,
  Info,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Warehouse,
  Building2,
  Truck,
  FileText,
  MessageSquare,
  Boxes,
  MapPin,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const EXPORT_TYPE_OPTIONS = [
  { value: "to-warehouse", label: "Interne vers dépôt" },
  { value: "to-construction-site", label: "Interne vers chantier" },
  { value: "external", label: "Externe" },
];

interface CreateExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExportModal({
  open,
  onOpenChange,
}: CreateExportModalProps) {
  const {
    form,
    activeTab,
    setActiveTab,
    goToNextTab,
    goToPrevTab,
    selectedExportType,
    isInternalType,
    warehouseOptions,
    loadingWarehouses,
    warehousesError,
    handleWarehouseSearch,
    siteOptions,
    loadingSites,
    sitesError,
    handleSiteSearch,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    exportItems,
    addItem,
    removeItem,
    updateItem,
    isLoading,
    error,
    onSubmit,
    reset,
    productsValidationErrors,
    isExternalType,
    withTransporter,
  } = useCreateExport(() => onOpenChange(false));

  const handleTabChange = (value: string) => {
    setActiveTab(value as ExportTab);
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
            Ajouter une nouvelle sortie
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic" disabled={isLoading}>
                  <Info className="h-4 w-4 mr-2" />
                  Informations de base
                </TabsTrigger>
                <TabsTrigger value="products" disabled={isLoading}>
                  <Boxes className="h-4 w-4 mr-2" />
                  Produits
                </TabsTrigger>
              </TabsList>

              {/* ── Tab 1: Basic Information ─────────────────── */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Date */}
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

                {/* Export Type */}
                <FormField
                  control={form.control}
                  name="exportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Info className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                        Type de sortie
                      </FormLabel>
                      <FormControl>
                        <CustomSelect
                          options={EXPORT_TYPE_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner un type de sortie"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Warehouse — visible when type is to-warehouse */}
                {selectedExportType === "to-warehouse" && (
                  <FormField
                    control={form.control}
                    name="warehouseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Warehouse className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                          Dépôt
                        </FormLabel>
                        <FormControl>
                          {loadingWarehouses ? (
                            <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Chargement des dépôts...
                              </span>
                            </div>
                          ) : warehousesError ? (
                            <StatusBanner
                              variant="danger"
                              title="Erreur"
                              description={warehousesError}
                            />
                          ) : (
                            <CustomSelect
                              options={warehouseOptions}
                              value={field.value}
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              onSearch={handleWarehouseSearch}
                              placeholder="Sélectionner un dépôt"
                              searchable
                              disabled={isLoading}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Construction Site — visible when type is to-construction-site */}
                {selectedExportType === "to-construction-site" && (
                  <FormField
                    control={form.control}
                    name="constructionSiteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Building2 className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                          Chantier
                        </FormLabel>
                        <FormControl>
                          {loadingSites ? (
                            <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Chargement des chantiers...
                              </span>
                            </div>
                          ) : sitesError ? (
                            <StatusBanner
                              variant="danger"
                              title="Erreur"
                              description={sitesError}
                            />
                          ) : (
                            <CustomSelect
                              options={siteOptions}
                              value={field.value}
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              onSearch={handleSiteSearch}
                              placeholder="Sélectionner un chantier"
                              searchable
                              disabled={isLoading}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Transporter fields — visible for internal types */}
                {isInternalType && (
                  <>
                    <FormField
                      control={form.control}
                      name="transporterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Truck className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                            Nom du transporteur
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez le nom du transporteur"
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
                      name="transporterMatricule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <FileText className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                            Matricule fiscale du transporteur
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez la matricule fiscale"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* External fields — visible when type is external */}
                {isExternalType && (
                  <>
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <User className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                            Nom du client
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez le nom du client"
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
                      name="entrepriseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Building2 className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                            Nom de l'entreprise
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez le nom de l'entreprise"
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
                      name="entrepriseAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <MapPin className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                            Adresse de l'entreprise
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez l'adresse de l'entreprise"
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
                      name="matriculeFiscale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <FileText className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                            Matricule fiscale
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez la matricule fiscale"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transporter toggle */}
                    <FormField
                      control={form.control}
                      name="withTransporter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              <Truck className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                              Avec transporteur
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Transporter fields — visible when checkbox is checked */}
                    {withTransporter && (
                      <>
                        <FormField
                          control={form.control}
                          name="transporterName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <Truck className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                                Nom du transporteur
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Entrez le nom du transporteur"
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
                          name="transporterMatricule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <FileText className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                                Matricule fiscale du transporteur
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Entrez la matricule fiscale"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </>
                )}

                {/* Observation */}
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
                  {exportItems.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border p-4 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          Produit {index + 1}
                        </h4>
                        {exportItems.length > 1 && (
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

                      {/* Product select */}
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
                        {/* Exited stock */}
                        <div>
                          <FormLabel className="text-xs">Stock sorti</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={item.exitedStock}
                            onChange={(e) =>
                              updateItem(index, "exitedStock", e.target.value)
                            }
                            disabled={isLoading}
                            className="mt-1"
                          />
                        </div>

                        {productsValidationErrors[index]?.exitedStock && (
                          <p className="text-xs font-medium text-destructive mt-1">
                            {productsValidationErrors[index].exitedStock}
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

                {activeTab !== "products" ? (
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
                    Créer la sortie
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
