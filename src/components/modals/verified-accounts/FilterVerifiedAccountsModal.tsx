import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBanner } from "@/components/reusables/status-banner";
import {
  CustomSelect,
  IconSelectOption,
} from "@/components/reusables/CustomSelect";
import {
  Filter,
  Loader2,
  RotateCcw,
  User,
  UserRoundPen,
  ClipboardCheck,
  ShieldPlus,
  Warehouse,
  HardHat,
  ListFilter,
} from "lucide-react";
import { useFilterVerifiedAccountsModal } from "@/hooks/verified-accounts/useFilterVerifiedAccountsModal";
import { AccountRole } from "@/models/Account.model";

const roleOptions: IconSelectOption[] = [
  {
    label: "Administrateur",
    value: AccountRole.ADMIN,
    icon: ShieldPlus,
  },
  {
    label: "Administrateur 1",
    value: AccountRole.ADMIN1,
    icon: ShieldPlus,
  },
  {
    label: "Administrateur 2",
    value: AccountRole.ADMIN2,
    icon: ShieldPlus,
  },
  {
    label: "Magasinier",
    value: AccountRole.PRODUCT_KEEPER,
    icon: Warehouse,
  },
  {
    label: "Responsable Chantier",
    value: AccountRole.CONSTRUCTION_SITE_MANAGER,
    icon: HardHat,
  },
];

interface CustomerFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterVerifiedAccountsModal({
  open,
  onOpenChange,
}: CustomerFilterModalProps) {
  const {
    firstnameInput,
    setFirstnameInput,
    lastnameInput,
    setLastnameInput,
    usernameInput,
    setUsernameInput,
    roleInput,
    setRoleInput,
    isLoading,
    error,
    handleApply,
    handleReset,
    clearError,
  } = useFilterVerifiedAccountsModal(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les comptes confirmés
          </DialogTitle>
          <DialogDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            comptes.
          </DialogDescription>
        </DialogHeader>

        {/* Error banner */}
        {error && (
          <div className="mb-2">
            <StatusBanner variant="danger" title="Erreur" description={error} />
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Nom :
              </Label>
              <Input
                id="nom"
                placeholder="Rechercher par nom"
                value={lastnameInput}
                onChange={(e) => {
                  setLastnameInput(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Prénom :
              </Label>
              <Input
                id="prenom"
                placeholder="Rechercher par prénom"
                value={firstnameInput}
                onChange={(e) => {
                  setFirstnameInput(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="nom_utilisateur"
                className="flex items-center gap-2"
              >
                <UserRoundPen className="h-3.5 w-3.5 text-muted-foreground" />
                Nom d'utilisateur :
              </Label>
              <Input
                id="nom_utilisateur"
                placeholder="Rechercher par nom d'utilisateur"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                Rôle :
              </Label>
              <CustomSelect
                options={roleOptions}
                value={roleInput}
                onValueChange={(value) => {
                  setRoleInput(value as AccountRole | "");
                  if (error) clearError();
                }}
                placeholder="Sélectionner un rôle"
              />
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
