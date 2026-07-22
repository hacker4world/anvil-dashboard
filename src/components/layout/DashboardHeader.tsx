import {
  Bell,
  Search,
  User,
  Car,
  Calendar,
  MapPin,
  X,
  Layers,
  TriangleAlert,
  PackageMinus,
  PackageX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("clients");

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState("reservations");

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    // Get date in French (e.g., "dimanche 26 janvier")
    const dateStr = now.toLocaleDateString("fr-FR", options);

    // Capitalize the first letter (French grammatical rule for dates)
    setCurrentDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim().length > 0) {
        setIsPopoverOpen(true);
        setActiveTab("clients"); // Reset to first tab on new search
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsPopoverOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      {/* Search Section with Popover */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-[530px] group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder="Recherchez comptes, fournisseurs, fabricants, chantiers, etc..."
              className="w-full bg-secondary/50 pl-10 pr-8 border-border focus:border-primary focus:ring-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full p-0.5 hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[600px] p-0" align="start">
          <Tabs
            defaultValue="clients"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-14 rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="clients"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-blue-50/50 dark:data-[state=active]:bg-blue-950/20 transition-all hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Clients
              </TabsTrigger>

              <TabsTrigger
                value="vehicules"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:bg-emerald-50/50 dark:data-[state=active]:bg-emerald-950/20 transition-all hover:text-foreground"
              >
                <Car className="h-4 w-4" />
                Véhicules
              </TabsTrigger>

              <TabsTrigger
                value="locations"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:bg-orange-50/50 dark:data-[state=active]:bg-orange-950/20 transition-all hover:text-foreground"
              >
                <MapPin className="h-4 w-4" />
                Locations
              </TabsTrigger>

              <TabsTrigger
                value="reservations"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:bg-purple-50/50 dark:data-[state=active]:bg-purple-950/20 transition-all hover:text-foreground"
              >
                <Calendar className="h-4 w-4" />
                Réservations
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              {/* Clients Tab */}
              <TabsContent
                value="clients"
                className="mt-0 space-y-2 focus:outline-none"
              >
                <div className="text-center py-2">
                  <span className="text-xs text-muted-foreground italic">
                    1 résultat trouvé pour "{searchQuery}"
                  </span>
                </div>
              </TabsContent>

              {/* Vehicles Tab */}
              <TabsContent
                value="vehicules"
                className="mt-0 space-y-2 focus:outline-none"
              >
                <div className="text-center py-2">
                  <span className="text-xs text-muted-foreground italic">
                    1 résultat trouvé pour "{searchQuery}"
                  </span>
                </div>
              </TabsContent>

              {/* Locations Tab */}
              <TabsContent
                value="locations"
                className="mt-0 space-y-2 focus:outline-none"
              >
                <div className="text-center py-2">
                  <span className="text-xs text-muted-foreground italic">
                    1 résultat trouvé pour "{searchQuery}"
                  </span>
                </div>
              </TabsContent>

              {/* Reservations Tab */}
              <TabsContent
                value="reservations"
                className="mt-0 space-y-2 focus:outline-none"
              >
                <div className="text-center py-2">
                  <span className="text-xs text-muted-foreground italic">
                    1 résultat trouvé pour "{searchQuery}"
                  </span>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </PopoverContent>
      </Popover>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative text-muted-foreground hover:text-foreground transition-colors",
                notifOpen && "bg-accent text-accent-foreground",
              )}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
                3
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[540px] p-0" align="end">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-primary"
              >
                Tout marquer comme lu
              </Button>
            </div>

            <Tabs
              defaultValue="reservations"
              value={notifTab}
              onValueChange={setNotifTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 h-14 rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="demandes"
                  className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-blue-50/50 dark:data-[state=active]:bg-blue-950/20 transition-all hover:text-foreground border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  <Layers className="h-4.5 w-4.5" />
                  <span>Demandes articles</span>
                </TabsTrigger>

                <TabsTrigger
                  value="retours"
                  className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-blue-50/50 dark:data-[state=active]:bg-blue-950/20 transition-all hover:text-foreground border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  <TriangleAlert className="h-4.5 w-4.5" />
                  <span>Retours articles</span>
                </TabsTrigger>

                <TabsTrigger
                  value="maintenance"
                  className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:bg-orange-50/50 dark:data-[state=active]:bg-orange-950/20 transition-all hover:text-foreground border-b-2 border-transparent data-[state=active]:border-orange-600"
                >
                  <PackageMinus className="h-4.5 w-4.5" />
                  <span>Produits presque épuisées</span>
                </TabsTrigger>

                <TabsTrigger
                  value="visite"
                  className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:bg-purple-50/50 dark:data-[state=active]:bg-purple-950/20 transition-all hover:text-foreground border-b-2 border-transparent data-[state=active]:border-purple-600"
                >
                  <PackageX className="h-4.5 w-4.5" />
                  <span>Produits épuisées</span>
                </TabsTrigger>
              </TabsList>

              <div className="max-h-[500px] overflow-y-auto">
                {/* Réservations Tab Content */}
                <TabsContent
                  value="reservations"
                  className="mt-0 focus:outline-none"
                ></TabsContent>

                {/* Maintenance Tab Content */}
                <TabsContent
                  value="maintenance"
                  className="mt-0 focus:outline-none"
                ></TabsContent>

                {/* Visite Tab Content */}
                <TabsContent
                  value="visite"
                  className="mt-0 focus:outline-none"
                ></TabsContent>
              </div>
            </Tabs>
          </PopoverContent>
        </Popover>
        <div className="h-8 w-px bg-border mx-2" />
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground">Welcome back</p>
          <p className="text-xs text-muted-foreground">{currentDate}</p>
        </div>
      </div>
    </header>
  );
}
