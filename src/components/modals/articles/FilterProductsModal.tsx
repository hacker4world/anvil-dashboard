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
import { useFilterProductsModal } from "@/hooks/articles/useFilterProductsModal";
import {
  Building2,
  Filter,
  Loader2,
  Package,
  PackageMinus,
  RotateCcw,
  Ruler,
  Tag,
  DollarSign,
} from "lucide-react";

interface FilterProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterProductsModal({
  open,
  onOpenChange,
}: FilterProductsModalProps) {
  const {
    currentStockInput,
    setCurrentStockInput,
    minimumStockInput,
    setMinimumStockInput,
    averagePriceInput,
    setAveragePriceInput,
    unitInput,
    setUnitInput,
    warehouseInput,
    setWarehouseInput,
    categoryInput,
    setCategoryInput,
    unitOptions,
    loadingUnits,
    unitsError,
    warehouseOptions,
    loadingWarehouses,
    warehousesError,
    categoryOptions,
    loadingCategories,
    categoriesError,
    handleCategorySearch,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  } = useFilterProductsModal(() => {
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les produits
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            produits.
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
            {/* Current Stock */}
            <div className="space-y-2">
              <Label
                htmlFor="current-stock"
                className="flex items-center gap-2"
              >
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                Stock actuel :
              </Label>
              <Input
                id="current-stock"
                type="number"
                step="1"
                placeholder="Filtrer par stock actuel"
                value={currentStockInput}
                onChange={(e) => setCurrentStockInput(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Minimum Stock */}
            <div className="space-y-2">
              <Label
                htmlFor="minimum-stock"
                className="flex items-center gap-2"
              >
                <PackageMinus className="h-3.5 w-3.5 text-muted-foreground" />
                Stock minimum :
              </Label>
              <Input
                id="minimum-stock"
                type="number"
                step="1"
                placeholder="Filtrer par stock minimum"
                value={minimumStockInput}
                onChange={(e) => setMinimumStockInput(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Average Price */}
            <div className="space-y-2">
              <Label
                htmlFor="average-price"
                className="flex items-center gap-2"
              >
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Prix moyen :
              </Label>
              <Input
                id="average-price"
                type="number"
                step="0.01"
                placeholder="Filtrer par prix moyen"
                value={averagePriceInput}
                onChange={(e) => setAveragePriceInput(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit" className="flex items-center gap-2">
                <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                Unité :
              </Label>
              <CustomSelect
                options={unitOptions}
                value={unitInput ? Number(unitInput) : ""}
                onValueChange={(val) => setUnitInput(String(val))}
                placeholder={
                  loadingUnits
                    ? "Chargement des unités..."
                    : "Filtrer par unité"
                }
                searchable={false}
                disabled={isLoading || loadingUnits}
              />
              {unitsError && (
                <p className="text-sm text-destructive">{unitsError}</p>
              )}
            </div>

            {/* Warehouse */}
            <div className="space-y-2">
              <Label htmlFor="warehouse" className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
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
                searchable={false}
                disabled={isLoading || loadingWarehouses}
              />
              {warehousesError && (
                <p className="text-sm text-destructive">{warehousesError}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Catégorie :
              </Label>
              <CustomSelect
                options={categoryOptions}
                value={categoryInput ? Number(categoryInput) : ""}
                onValueChange={(val) => setCategoryInput(String(val))}
                onSearch={handleCategorySearch}
                placeholder={
                  loadingCategories
                    ? "Chargement des catégories..."
                    : "Filtrer par catégorie"
                }
                searchable
                disabled={isLoading || loadingCategories}
              />
              {categoriesError && (
                <p className="text-sm text-destructive">{categoriesError}</p>
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
