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
import { useFilterConfirmedImportsModal } from "@/hooks/confirmed-imports/useFilterConfirmedImportsModal";
import {
  Building2,
  Factory,
  Filter,
  Calendar,
  Package,
  DollarSign,
  Box,
  Loader2,
  RotateCcw,
  UserCircle,
} from "lucide-react";

interface FilterConfirmedImportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterConfirmedImportsModal({
  open,
  onOpenChange,
}: FilterConfirmedImportsModalProps) {
  const {
    supplierInput,
    setSupplierInput,
    manufacturerInput,
    setManufacturerInput,
    dateFromInput,
    setDateFromInput,
    dateToInput,
    setDateToInput,
    productInput,
    setProductInput,
    unitPriceFromInput,
    setUnitPriceFromInput,
    unitPriceToInput,
    setUnitPriceToInput,
    enteredStockFromInput,
    setEnteredStockFromInput,
    enteredStockToInput,
    setEnteredStockToInput,
    supplierOptions,
    loadingSuppliers,
    suppliersError,
    manufacturerOptions,
    loadingManufacturers,
    manufacturersError,
    productOptions,
    loadingProducts,
    productsError,
    handleProductSearch,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
    accountInput,
    setAccountInput,
    accountOptions,
    loadingAccounts,
    accountsError,
    handleAccountSearch,
  } = useFilterConfirmedImportsModal(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les entrées confirmées
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche
            d'entrées confirmées.
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
            {/* Supplier */}
            <div className="space-y-2">
              <Label htmlFor="supplier" className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Fournisseur :
              </Label>
              <CustomSelect
                options={supplierOptions}
                value={supplierInput ? Number(supplierInput) : ""}
                onValueChange={(val) => setSupplierInput(String(val))}
                placeholder={
                  loadingSuppliers
                    ? "Chargement des fournisseurs..."
                    : "Filtrer par fournisseur"
                }
                searchable
                disabled={isLoading || loadingSuppliers}
              />
              {suppliersError && (
                <p className="text-sm text-destructive">{suppliersError}</p>
              )}
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="flex items-center gap-2">
                <Factory className="h-3.5 w-3.5 text-muted-foreground" />
                Fabricant :
              </Label>
              <CustomSelect
                options={manufacturerOptions}
                value={manufacturerInput ? Number(manufacturerInput) : ""}
                onValueChange={(val) => setManufacturerInput(String(val))}
                placeholder={
                  loadingManufacturers
                    ? "Chargement des fabricants..."
                    : "Filtrer par fabricant"
                }
                searchable
                disabled={isLoading || loadingManufacturers}
              />
              {manufacturersError && (
                <p className="text-sm text-destructive">{manufacturersError}</p>
              )}
            </div>

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
