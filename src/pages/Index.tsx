import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWebSocketNotification } from "@/hooks/useWebSocketNotification";
import React, { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Package,
  Truck,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  User,
  LogIn,
  UserPlus,
  Settings,
  Clock,
} from "lucide-react";

export const Index = () => {
  // ── Mock Data ────────────────────────────────────
  const upcomingEvents = [
    {
      id: 1,
      title: "Livraison chantier #42",
      date: "2026-07-02",
      type: "delivery",
      description: "Réception de 120 sacs de ciment",
    },
    {
      id: 2,
      title: "Inventaire mensuel",
      date: "2026-07-05",
      type: "inventory",
      description: "Comptage physique Entrepôt A",
    },
    {
      id: 3,
      title: "Expédition externe #88",
      date: "2026-07-08",
      type: "export",
      description: "Livraison client Jean Dupont",
    },
  ];

  const recentImports = [
    {
      id: 1432,
      date: "2026-06-24",
      supplier: "Ciments du Sud",
      items: 45,
      status: "completed",
      confirmed: true,
    },
    {
      id: 1431,
      date: "2026-06-23",
      supplier: "Aciérie Moderne",
      items: 12,
      status: "pending",
      confirmed: false,
    },
    {
      id: 1430,
      date: "2026-06-22",
      supplier: "Quincaillerie Express",
      items: 230,
      status: "completed",
      confirmed: true,
    },
    {
      id: 1429,
      date: "2026-06-21",
      supplier: "Peintures Pro",
      items: 50,
      status: "pending",
      confirmed: false,
    },
  ];

  const recentExports = [
    {
      id: 5621,
      date: "2026-06-25",
      destination: "Chantier A",
      items: 8,
      type: "to-construction-site",
      confirmed: true,
    },
    {
      id: 5620,
      date: "2026-06-24",
      destination: "Client externe B",
      items: 3,
      type: "external",
      confirmed: false,
    },
    {
      id: 5619,
      date: "2026-06-23",
      destination: "Dépôt central",
      items: 15,
      type: "to-warehouse",
      confirmed: true,
    },
    {
      id: 5618,
      date: "2026-06-22",
      destination: "Chantier C",
      items: 20,
      type: "to-construction-site",
      confirmed: false,
    },
  ];

  const recentStockChanges = [
    {
      product: "Ciment Portland",
      previousQty: 45,
      newQty: 120,
      change: 75,
      reason: "Réception import #1432",
    },
    {
      product: "Barres d'acier Ø12",
      previousQty: 8,
      newQty: 3,
      change: -5,
      reason: "Sortie chantier #5621",
    },
    {
      product: "Boulons M10",
      previousQty: 300,
      newQty: 150,
      change: -150,
      reason: "Transfert dépôt",
    },
    {
      product: "Sable fin",
      previousQty: 10,
      newQty: 20,
      change: 10,
      reason: "Réception import #1430",
    },
  ];

  const recentAccountActivities = [
    {
      id: 1,
      action: "Connexion",
      user: "admin@example.com",
      timestamp: "2026-06-25 14:32",
      icon: LogIn,
      color: "text-blue-500",
    },
    {
      id: 2,
      action: "Création d'un compte",
      user: "jean.dupont@chantier.fr",
      timestamp: "2026-06-25 11:15",
      icon: UserPlus,
      color: "text-emerald-500",
    },
    {
      id: 3,
      action: "Modification du profil",
      user: "marie.martin@depot.com",
      timestamp: "2026-06-24 16:45",
      icon: Settings,
      color: "text-amber-500",
    },
    {
      id: 4,
      action: "Connexion",
      user: "logistique@entreprise.dz",
      timestamp: "2026-06-24 09:20",
      icon: LogIn,
      color: "text-blue-500",
    },
  ];

  // ── Helpers ──────────────────────────────────────
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "inventory":
        return <Package className="h-4 w-4 text-amber-500" />;
      case "export":
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue globale d'activités récentes
          </p>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Importations récentes"
          value={String(recentImports.length)}
          change="+3 cette semaine"
          changeType="positive"
          icon={Package}
          delay={100}
        />
        <StatCard
          title="Exportations récentes"
          value={String(recentExports.length)}
          change="-2 cette semaine"
          changeType="negative"
          icon={Truck}
          delay={200}
        />
        <StatCard
          title="Événements à venir"
          value={String(upcomingEvents.length)}
          change="Prochains 14 jours"
          changeType="neutral"
          icon={Calendar}
          delay={300}
        />
        <StatCard
          title="Mouvements de stock"
          value={String(recentStockChanges.length)}
          change="24h dernières"
          changeType="neutral"
          icon={ArrowUpDown}
          delay={400}
        />
      </div>

      {/* Main Highlights Grid – larger cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Upcoming Events (wider) */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Événements à venir
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {upcomingEvents.length}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{event.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Imports with tabs */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Importations récentes
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {recentImports.length}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <Tabs defaultValue="confirmed" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="confirmed" className="text-xs">
                  Confirmées
                </TabsTrigger>
                <TabsTrigger value="unconfirmed" className="text-xs">
                  Non confirmées
                </TabsTrigger>
              </TabsList>
              <TabsContent value="confirmed" className="mt-0">
                <ScrollArea className="h-[360px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">N°</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Fournisseur</TableHead>
                        <TableHead className="text-xs text-right">
                          Art.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentImports
                        .filter((imp) => imp.confirmed)
                        .map((imp) => (
                          <TableRow key={imp.id}>
                            <TableCell className="text-xs font-medium">
                              #{imp.id}
                            </TableCell>
                            <TableCell className="text-xs">
                              {formatDate(imp.date)}
                            </TableCell>
                            <TableCell className="text-xs">
                              {imp.supplier}
                            </TableCell>
                            <TableCell className="text-xs text-right">
                              {imp.items}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="unconfirmed" className="mt-0">
                <ScrollArea className="h-[360px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">N°</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Fournisseur</TableHead>
                        <TableHead className="text-xs text-right">
                          Art.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentImports
                        .filter((imp) => !imp.confirmed)
                        .map((imp) => (
                          <TableRow key={imp.id}>
                            <TableCell className="text-xs font-medium">
                              #{imp.id}
                            </TableCell>
                            <TableCell className="text-xs">
                              {formatDate(imp.date)}
                            </TableCell>
                            <TableCell className="text-xs">
                              {imp.supplier}
                            </TableCell>
                            <TableCell className="text-xs text-right">
                              {imp.items}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Exports with tabs */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Exportations récentes
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {recentExports.length}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <Tabs defaultValue="confirmed" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="confirmed" className="text-xs">
                  Confirmées
                </TabsTrigger>
                <TabsTrigger value="unconfirmed" className="text-xs">
                  Non confirmées
                </TabsTrigger>
              </TabsList>
              <TabsContent value="confirmed" className="mt-0">
                <ScrollArea className="h-[360px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">N°</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Destination</TableHead>
                        <TableHead className="text-xs text-right">
                          Art.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentExports
                        .filter((exp) => exp.confirmed)
                        .map((exp) => (
                          <TableRow key={exp.id}>
                            <TableCell className="text-xs font-medium">
                              #{exp.id}
                            </TableCell>
                            <TableCell className="text-xs">
                              {formatDate(exp.date)}
                            </TableCell>
                            <TableCell className="text-xs">
                              {exp.destination}
                            </TableCell>
                            <TableCell className="text-xs text-right">
                              {exp.items}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="unconfirmed" className="mt-0">
                <ScrollArea className="h-[360px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">N°</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Destination</TableHead>
                        <TableHead className="text-xs text-right">
                          Art.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentExports
                        .filter((exp) => !exp.confirmed)
                        .map((exp) => (
                          <TableRow key={exp.id}>
                            <TableCell className="text-xs font-medium">
                              #{exp.id}
                            </TableCell>
                            <TableCell className="text-xs">
                              {formatDate(exp.date)}
                            </TableCell>
                            <TableCell className="text-xs">
                              {exp.destination}
                            </TableCell>
                            <TableCell className="text-xs text-right">
                              {exp.items}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stock Changes (now wider) */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              Changements de stock récents
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {recentStockChanges.length}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-3">
                {recentStockChanges.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        change.change > 0
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {change.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {change.product}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {change.previousQty} → {change.newQty}{" "}
                        <span
                          className={
                            change.change > 0
                              ? "text-emerald-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          ({change.change > 0 ? "+" : ""}
                          {change.change})
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground/70 truncate">
                        {change.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* New: Recent Account Activities */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Activités des comptes récentes
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {recentAccountActivities.length}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-3">
                {recentAccountActivities.map((activity) => {
                  const IconComp = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <IconComp className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activity.user}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
