// src/components/modals/returns/FilterPendingReturnsModal.tsx
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
import { useFilterPendingReturnsModal } from "@/hooks/pending-returns/useFilterPendingReturnsModal";
import {
  Filter,
  Calendar,
  Package,
  Loader2,
  RotateCcw,
  HardHat,
  UserCircle,
} from "lucide-react";

interface FilterPendingReturnsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterPendingReturnsModal({
  open,
  onOpenChange,
}: FilterPendingReturnsModalProps) {
  const {
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
  } = useFilterPendingReturnsModal(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les retours en attente
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            retours en attente.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <StatusBanner
            variant="danger"
            title="Erreur d'application des filtres"
            description={error}
          />
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Construction Site */}
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
                onValueChange={(val) => {
                  setConstructionSiteInput(String(val));
                  if (error) clearError();
                }}
                placeholder={
                  loadingConstructionSites
                    ? "Chargement..."
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
                onValueChange={(val) => {
                  setProductInput(String(val));
                  if (error) clearError();
                }}
                onSearch={handleProductSearch}
                placeholder={
                  loadingProducts ? "Chargement..." : "Filtrer par produit"
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
                Demandeur :
              </Label>
              <CustomSelect
                options={accountOptions}
                value={accountInput ? Number(accountInput) : ""}
                onValueChange={(val) => {
                  setAccountInput(String(val));
                  if (error) clearError();
                }}
                onSearch={handleAccountSearch}
                placeholder={
                  loadingAccounts ? "Chargement..." : "Filtrer par demandeur"
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
