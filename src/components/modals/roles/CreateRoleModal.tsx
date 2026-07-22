import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBanner } from "@/components/reusables/status-banner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Plus,
  Shield,
  ListChecks,
  ChevronDown,
  Package,
  Building2,
  Factory,
  HardHat,
  FolderTree,
  Grid3X3,
  Tags,
  Calendar,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  RotateCcw,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Local form schema
const roleNameSchema = z.object({
  name: z.string().min(1, "Le nom du rôle est requis"),
});

type RoleNameForm = z.infer<typeof roleNameSchema>;

// Permission groups for display (no logic yet)
const permissionGroups = [
  {
    entity: "Produits",
    icon: Package,
    permissions: [
      "ACCESS_PRODUCTS_PAGE",
      "VIEW_PRODUCT",
      "CREATE_PRODUCT",
      "UPDATE_PRODUCT",
      "DELETE_PRODUCT",
    ],
  },
  {
    entity: "Fournisseurs",
    icon: Building2,
    permissions: [
      "ACCESS_SUPPLIERS_PAGE",
      "VIEW_SUPPLIER",
      "CREATE_SUPPLIER",
      "UPDATE_SUPPLIER",
      "DELETE_SUPPLIER",
    ],
  },
  {
    entity: "Fabricants",
    icon: Factory,
    permissions: [
      "ACCESS_MANUFACTURERS_PAGE",
      "VIEW_MANUFACTURER",
      "CREATE_MANUFACTURER",
      "UPDATE_MANUFACTURER",
      "DELETE_MANUFACTURER",
    ],
  },
  {
    entity: "Chantiers",
    icon: HardHat,
    permissions: [
      "ACCESS_CONSTRUCTION_SITES_PAGE",
      "VIEW_CONSTRUCTION_SITE",
      "CREATE_CONSTRUCTION_SITE",
      "UPDATE_CONSTRUCTION_SITE",
      "DELETE_CONSTRUCTION_SITE",
    ],
  },
  // ── NEW GROUPS ──
  {
    entity: "Entrepôts",
    icon: Package, // or use a warehouse icon like Warehouse if available, else reuse Package
    permissions: [
      "ACCESS_WAREHOUSES_PAGE",
      "VIEW_WAREHOUSE",
      "CREATE_WAREHOUSE",
      "UPDATE_WAREHOUSE",
      "DELETE_WAREHOUSE",
    ],
  },
  {
    entity: "Dépôts",
    icon: Building2, // or a custom depot icon
    permissions: [
      "ACCESS_DEPOTS_PAGE",
      "VIEW_DEPOT",
      "CREATE_DEPOT",
      "UPDATE_DEPOT",
      "DELETE_DEPOT",
    ],
  },
  {
    entity: "Calendrier",
    icon: Calendar, // import Calendar from lucide-react (add to imports)
    permissions: [
      "ACCESS_CALENDAR_PAGE",
      "VIEW_CALENDAR",
      "CREATE_CALENDAR_EVENT",
    ],
  },
  {
    entity: "Familles",
    icon: FolderTree,
    permissions: [
      "ACCESS_FAMILIES_PAGE",
      "VIEW_FAMILY",
      "CREATE_FAMILY",
      "UPDATE_FAMILY",
      "DELETE_FAMILY",
    ],
  },
  {
    entity: "Sous‑familles",
    icon: Grid3X3,
    permissions: [
      "ACCESS_SUBFAMILIES_PAGE",
      "VIEW_SUBFAMILY",
      "CREATE_SUBFAMILY",
      "UPDATE_SUBFAMILY",
      "DELETE_SUBFAMILY",
    ],
  },
  {
    entity: "Catégories",
    icon: Tags,
    permissions: [
      "ACCESS_CATEGORIES_PAGE",
      "VIEW_CATEGORY",
      "CREATE_CATEGORY",
      "UPDATE_CATEGORY",
      "DELETE_CATEGORY",
    ],
  },

  {
    entity: "Entrées",
    icon: ArrowDownToLine,
    permissions: [
      "ACCESS_IMPORTS_PAGE",
      "VIEW_IMPORT",
      "CREATE_IMPORT",
      "CONFIRM_IMPORT",
      "DENY_IMPORT",
    ],
  },
  {
    entity: "Sorties",
    icon: ArrowUpFromLine,
    permissions: [
      "ACCESS_EXPORTS_PAGE",
      "VIEW_EXPORT",
      "CREATE_EXPORT",
      "CONFIRM_EXPORT",
      "DENY_EXPORT",
    ],
  },
  {
    entity: "Demandes d'articles",
    icon: ClipboardList,
    permissions: [
      "ACCESS_REQUESTS_PAGE",
      "VIEW_REQUEST",
      "CONFIRM_REQUEST",
      "DENY_REQUEST",
    ],
  },
  {
    entity: "Retours d'articles",
    icon: RotateCcw,
    permissions: [
      "ACCESS_RETURNS_PAGE",
      "VIEW_RETURN",
      "CONFIRM_RETURN",
      "DENY_RETURN",
    ],
  },
  {
    entity: "Comptes en attente",
    icon: Clock,
    permissions: [
      "ACCESS_PENDING_ACCOUNTS_PAGE",
      "VIEW_PENDING_ACCOUNT",
      "CONFIRM_PENDING_ACCOUNT",
      "DELETE_PENDING_ACCOUNT",
    ],
  },
  {
    entity: "Comptes confirmés",
    icon: CheckCircle2,
    permissions: [
      "ACCESS_CONFIRMED_ACCOUNTS_PAGE",
      "VIEW_CONFIRMED_ACCOUNT",
      "UPDATE_CONFIRMED_ACCOUNT",
      "DELETE_CONFIRMED_ACCOUNT",
    ],
  },
];

// Human-readable permission labels
const permissionLabels: Record<string, string> = {
  ACCESS_PRODUCTS_PAGE: "Accès à la page",
  VIEW_PRODUCT: "Voir",
  CREATE_PRODUCT: "Créer",
  UPDATE_PRODUCT: "Modifier",
  DELETE_PRODUCT: "Supprimer",
  ACCESS_SUPPLIERS_PAGE: "Accès à la page",
  VIEW_SUPPLIER: "Voir",
  CREATE_SUPPLIER: "Créer",
  UPDATE_SUPPLIER: "Modifier",
  DELETE_SUPPLIER: "Supprimer",
  ACCESS_MANUFACTURERS_PAGE: "Accès à la page",
  VIEW_MANUFACTURER: "Voir",
  CREATE_MANUFACTURER: "Créer",
  UPDATE_MANUFACTURER: "Modifier",
  DELETE_MANUFACTURER: "Supprimer",
  ACCESS_CONSTRUCTION_SITES_PAGE: "Accès à la page",
  VIEW_CONSTRUCTION_SITE: "Voir",
  CREATE_CONSTRUCTION_SITE: "Créer",
  UPDATE_CONSTRUCTION_SITE: "Modifier",
  DELETE_CONSTRUCTION_SITE: "Supprimer",
  ACCESS_FAMILIES_PAGE: "Accès à la page",
  VIEW_FAMILY: "Voir",
  CREATE_FAMILY: "Créer",
  UPDATE_FAMILY: "Modifier",
  DELETE_FAMILY: "Supprimer",
  ACCESS_SUBFAMILIES_PAGE: "Accès à la page",
  VIEW_SUBFAMILY: "Voir",
  CREATE_SUBFAMILY: "Créer",
  UPDATE_SUBFAMILY: "Modifier",
  DELETE_SUBFAMILY: "Supprimer",
  ACCESS_CATEGORIES_PAGE: "Accès à la page",
  VIEW_CATEGORY: "Voir",
  CREATE_CATEGORY: "Créer",
  UPDATE_CATEGORY: "Modifier",
  DELETE_CATEGORY: "Supprimer",

  ACCESS_WAREHOUSES_PAGE: "Accès à la page",
  VIEW_WAREHOUSE: "Voir",
  CREATE_WAREHOUSE: "Créer",
  UPDATE_WAREHOUSE: "Modifier",
  DELETE_WAREHOUSE: "Supprimer",
  // Depots
  ACCESS_DEPOTS_PAGE: "Accès à la page",
  VIEW_DEPOT: "Voir",
  CREATE_DEPOT: "Créer",
  UPDATE_DEPOT: "Modifier",
  DELETE_DEPOT: "Supprimer",
  // Calendar
  ACCESS_CALENDAR_PAGE: "Accès à la page",
  VIEW_CALENDAR: "Voir le calendrier",
  CREATE_CALENDAR_EVENT: "Créer un événement",

  ACCESS_IMPORTS_PAGE: "Accès à la page",
  VIEW_IMPORT: "Voir",
  CREATE_IMPORT: "Créer",
  CONFIRM_IMPORT: "Confirmer",
  DENY_IMPORT: "Refuser",

  // Exports
  ACCESS_EXPORTS_PAGE: "Accès à la page",
  VIEW_EXPORT: "Voir",
  CREATE_EXPORT: "Créer",
  CONFIRM_EXPORT: "Confirmer",
  DENY_EXPORT: "Refuser",

  // Requests
  ACCESS_REQUESTS_PAGE: "Accès à la page",
  VIEW_REQUEST: "Voir",
  CONFIRM_REQUEST: "Confirmer",
  DENY_REQUEST: "Refuser",

  // Returns
  ACCESS_RETURNS_PAGE: "Accès à la page",
  VIEW_RETURN: "Voir",
  CONFIRM_RETURN: "Confirmer",
  DENY_RETURN: "Refuser",

  ACCESS_PENDING_ACCOUNTS_PAGE: "Accès à la page",
  VIEW_PENDING_ACCOUNT: "Voir",
  CONFIRM_PENDING_ACCOUNT: "Confirmer",
  DELETE_PENDING_ACCOUNT: "Supprimer",

  // Confirmed Accounts
  ACCESS_CONFIRMED_ACCOUNTS_PAGE: "Accès à la page",
  VIEW_CONFIRMED_ACCOUNT: "Voir",
  UPDATE_CONFIRMED_ACCOUNT: "Modifier",
  DELETE_CONFIRMED_ACCOUNT: "Supprimer",
};

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("name");
  // Local state for collapsible sections (design only)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(permissionGroups.map((g) => [g.entity, true])),
  );
  // Placeholder state for switches (no logic, just visual)
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});

  const form = useForm<RoleNameForm>({
    resolver: zodResolver(roleNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: RoleNameForm) => {
    // Will be implemented later
    console.log("Form data:", data);
  };

  const resetAndClose = () => {
    form.reset();
    setActiveTab("name");
    setError(null);
    setSelectedPermissions({});
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetAndClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5" />
            Créer un nouveau rôle
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="name" className="gap-2">
              <Shield className="h-4 w-4" />
              Nom du rôle
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="name" className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <StatusBanner
                    variant="danger"
                    title="Erreur"
                    description={error}
                  />
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du rôle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Administrateur, Gestionnaire..."
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAndClose}
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
                    Créer le rôle
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            {error && (
              <StatusBanner
                variant="danger"
                title="Erreur"
                description={error}
              />
            )}

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {permissionGroups.map((group) => {
                  const Icon = group.icon;
                  const isOpen = openGroups[group.entity] ?? true;

                  return (
                    <Collapsible
                      key={group.entity}
                      open={isOpen}
                      onOpenChange={(open) =>
                        setOpenGroups((prev) => ({
                          ...prev,
                          [group.entity]: open,
                        }))
                      }
                      className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-border/80"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">
                            {group.entity}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 space-y-2">
                        {group.permissions.map((permKey) => (
                          <div
                            key={permKey}
                            className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                          >
                            <Label
                              htmlFor={`perm-${permKey}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {permissionLabels[permKey] ?? permKey}
                            </Label>
                            <Switch
                              id={`perm-${permKey}`}
                              checked={!!selectedPermissions[permKey]}
                              onCheckedChange={(checked) =>
                                setSelectedPermissions((prev) => ({
                                  ...prev,
                                  [permKey]: checked,
                                }))
                              }
                            />
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("name")}
                disabled={isLoading}
              >
                Retour
              </Button>
              <Button type="button" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Créer le rôle
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
