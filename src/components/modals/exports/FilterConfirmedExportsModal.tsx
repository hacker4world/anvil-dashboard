import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CustomSelect } from "@/components/reusables/CustomSelect";
import { StatusBanner } from "@/components/reusables/status-banner";
import { useFilterConfirmedExportsModal } from "@/hooks/confirmed-exports/useFilterConfirmedExportsModal";
import { ExportType, EXPORT_TYPE_LABELS } from "@/models/export.model";
import {
  Warehouse,
  HardHat,
  Filter,
  Calendar,
  Package,
  Loader2,
  RotateCcw,
  UserCircle,
  ArrowUpRight,
} from "lucide-react";

interface FilterConfirmedExportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXPORT_TYPE_OPTIONS = [
  {
    value: ExportType.TO_WAREHOUSE,
    label: EXPORT_TYPE_LABELS[ExportType.TO_WAREHOUSE],
  },
  {
    value: ExportType.TO_CONSTRUCTION_SITE,
    label: EXPORT_TYPE_LABELS[ExportType.TO_CONSTRUCTION_SITE],
  },
  {
    value: ExportType.EXTERNAL,
    label: EXPORT_TYPE_LABELS[ExportType.EXTERNAL],
  },
];

export function FilterConfirmedExportsModal({
  open,
  onOpenChange,
}: FilterConfirmedExportsModalProps) {
  const {
    exportTypeInput,
    setExportTypeInput,
    warehouseInput,
    setWarehouseInput,
    constructionSiteInput,
    setConstructionSiteInput,
    dateFromInput,
    setDateFromInput,
    dateToInput,
    setDateToInput,
    productInput,
    setProductInput,
    accountInput,
    setAccountInput,
    warehouseOptions,
    loadingWarehouses,
    warehousesError,
    constructionSiteOptions,
    loadingConstructionSites,
    constructionSitesError,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    accountOptions,
    loadingAccounts,
    accountsError,
    handleAccountSearch,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  } = useFilterConfirmedExportsModal(() => onOpenChange(false));

  const showWarehouse = exportTypeInput === ExportType.TO_WAREHOUSE;
  const showConstructionSite =
    exportTypeInput === ExportType.TO_CONSTRUCTION_SITE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les sorties confirmées
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            sorties confirmées.
          </DialogDescription>
        </DialogHeader>

        {/* Error banner */}
        {error && (
          <StatusBanner
            variant="danger"
            title="Erreur d'application des filtres"
            description={error}
          />
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Type */}
            <div className="space-y-2">
              <Label htmlFor="export-type" className="flex items-center gap-2">
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                Type de sortie :
              </Label>
              <CustomSelect
                options={EXPORT_TYPE_OPTIONS}
                value={exportTypeInput}
                onValueChange={(val) => {
                  setExportTypeInput(String(val));
                  // Clear warehouse/construction site when type changes
                  if (val !== ExportType.TO_WAREHOUSE) setWarehouseInput("");
                  if (val !== ExportType.TO_CONSTRUCTION_SITE)
                    setConstructionSiteInput("");
                  if (error) clearError();
                }}
                placeholder="Filtrer par type de sortie"
                disabled={isLoading}
              />
            </div>

            {/* Warehouse — only when type is TO_WAREHOUSE */}
            {showWarehouse && (
              <div className="space-y-2">
                <Label htmlFor="warehouse" className="flex items-center gap-2">
                  <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
                  Dépôt :
                </Label>
                <CustomSelect
                  options={warehouseOptions}
                  value={warehouseInput ? Number(warehouseInput) : ""}
                  onValueChange={(val) => setWarehouseInput(String(val))}
                  placeholder={
                    loadingWarehouses
                      ? "Chargement des dépôts..."
                      : "Filtrer par dépôt"
                  }
                  searchable
                  disabled={isLoading || loadingWarehouses}
                />
                {warehousesError && (
                  <p className="text-sm text-destructive">{warehousesError}</p>
                )}
              </div>
            )}

            {/* Construction Site — only when type is TO_CONSTRUCTION_SITE */}
            {showConstructionSite && (
              <div className="space-y-2">
                <Label
                  htmlFor="construction-site"
                  className="flex items-center gap-2"
                >
                  <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                  Chantier :
                </Label>
                <CustomSelect
                  options={constructionSiteOptions}
                  value={
                    constructionSiteInput ? Number(constructionSiteInput) : ""
                  }
                  onValueChange={(val) => setConstructionSiteInput(String(val))}
                  placeholder={
                    loadingConstructionSites
                      ? "Chargement des chantiers..."
                      : "Filtrer par chantier"
                  }
                  searchable
                  disabled={isLoading || loadingConstructionSites}
                />
                {constructionSitesError && (
                  <p className="text-sm text-destructive">
                    {constructionSitesError}
                  </p>
                )}
              </div>
            )}

            {/* Date from */}
            <div className="space-y-2">
              <Label htmlFor="date-from" className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Date début :
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFromInput}
                onChange={(e) => {
                  setDateFromInput(e.target.value);
                  if (error) clearError();
                }}
                disabled={isLoading}
              />
            </div>

            {/* Date to */}
            <div className="space-y-2">
              <Label htmlFor="date-to" className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Date fin :
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateToInput}
                onChange={(e) => {
                  setDateToInput(e.target.value);
                  if (error) clearError();
                }}
                disabled={isLoading}
              />
            </div>

            {/* Product */}
            <div className="space-y-2">
              <Label htmlFor="product" className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                Produit :
              </Label>
              <CustomSelect
                options={productOptions}
                value={productInput ? Number(productInput) : ""}
                onValueChange={(val) => setProductInput(String(val))}
                onSearch={handleProductSearch}
                placeholder={
                  loadingProducts
                    ? "Chargement des produits..."
                    : "Filtrer par produit"
                }
                searchable
                disabled={isLoading || loadingProducts}
              />
              {productsError && (
                <p className="text-sm text-destructive">{productsError}</p>
              )}
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label htmlFor="account" className="flex items-center gap-2">
                <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                Compte (Magasinier) :
              </Label>
              <CustomSelect
                options={accountOptions}
                value={accountInput ? Number(accountInput) : ""}
                onValueChange={(val) => setAccountInput(String(val))}
                onSearch={handleAccountSearch}
                placeholder={
                  loadingAccounts
                    ? "Chargement des comptes..."
                    : "Filtrer par compte magasinier"
                }
                searchable
                disabled={isLoading || loadingAccounts}
              />
              {accountsError && (
                <p className="text-sm text-destructive">{accountsError}</p>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Réinitialiser
          </Button>
          <Button className="gap-2" onClick={handleApply} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
