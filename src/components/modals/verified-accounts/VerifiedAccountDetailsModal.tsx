import {
  Calendar,
  Clock,
  IdCard,
  User,
  List,
  Loader2,
  ShieldPlus,
  Warehouse,
  HardHat,
  UserRoundPen,
  ClipboardCheck,
  NotepadText,
  Truck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StatusBanner } from "@/components/reusables/status-banner";
import {
  CustomSelect,
  IconSelectOption,
} from "@/components/reusables/CustomSelect";
import { Account, AccountRole, roleLabels } from "@/models/Account.model";
import { useUpdateVerifiedAccount } from "@/hooks/verified-accounts/updateVerifiedAccount.hook";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface VerifiedAccountDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

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

export function VerifiedAccountDetailsModal({
  open,
  onOpenChange,
  account,
}: VerifiedAccountDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  // Fallback for rules of hooks
  const safeAccount: Account = account ?? {
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    role: AccountRole.ADMIN,
    confirmed: true,
    createdAt: "",
    updatedAt: "",
  };

  const {
    form,
    isLoading,
    error,
    onSubmit,
    reset: resetForm,
    setError,
  } = useUpdateVerifiedAccount(safeAccount, () => {
    resetForm();
    setIsEditMode(false);
    onOpenChange(false);
  });

  // Reset form and edit mode when modal opens with a new account
  useEffect(() => {
    if (open && account) {
      form.reset({
        firstname: account.firstname,
        lastname: account.lastname,
        username: account.username,
        role: account.role,
      });
      setError(null);
      setIsEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, account]);

  // Intercept close to reset form and edit mode
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      setIsEditMode(false);
    }
    onOpenChange(newOpen);
  };

  // Toggle edit mode: reset form to current data when entering edit mode
  const handleEditModeChange = (editMode: boolean) => {
    setIsEditMode(editMode);
    if (editMode && account) {
      form.reset({
        firstname: account.firstname,
        lastname: account.lastname,
        username: account.username,
        role: account.role,
      });
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {account?.firstname} {account?.lastname}
          </DialogTitle>
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

        {/* Error Banner */}
        {error && (
          <StatusBanner variant="danger" title="Erreur" description={error} />
        )}

        <Tabs defaultValue="informations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informations" className="gap-2">
              <IdCard className="h-4 w-4" />
              Informations du compte
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <List className="h-4 w-4" />
              Historique du compte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-4 mt-4">
            {isEditMode ? (
              <Form {...form}>
                <form
                  id="update-verified-account-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Prénom :
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Nom :
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <UserRoundPen className="h-3.5 w-3.5 text-muted-foreground" />
                            Nom d'Utilisateur :
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2">
                            <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                            Rôle
                          </FormLabel>
                          <FormControl>
                            <CustomSelect
                              options={roleOptions}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Sélectionner un rôle"
                              disabled={isLoading}
                            />
                          </FormControl>
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
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Prénom :
                  </Label>
                  <Input
                    value={account?.firstname}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Nom :
                  </Label>
                  <Input
                    value={account?.lastname}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <UserRoundPen className="h-3.5 w-3.5 text-muted-foreground" />
                    Nom d'Utilisateur :
                  </Label>
                  <Input
                    value={account?.username}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    Rôle
                  </Label>
                  <Input
                    value={account ? roleLabels[account.role] : ""}
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
                Historique du compte :
              </h3>
              <Tabs defaultValue="rentals" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="rentals" className="gap-2">
                    <Warehouse className="h-4 w-4" />
                    <span>Entrées</span>
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="gap-2">
                    <Truck className="h-4 w-4" />
                    <span>Sorties</span>
                  </TabsTrigger>
                  <TabsTrigger value="accidents" className="gap-2">
                    <NotepadText className="h-4 w-4" />
                    <span>Demandes articles</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="rentals" className="mt-4">
                  <div className="space-y-3"></div>
                </TabsContent>
                <TabsContent value="reservations" className="mt-4">
                  <div className="space-y-3"></div>
                </TabsContent>
                <TabsContent value="accidents" className="mt-4">
                  <div className="space-y-3"></div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            type="button"
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
              form="update-verified-account-form"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundPen className="h-4 w-4" />
              )}
              Modifier compte
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
