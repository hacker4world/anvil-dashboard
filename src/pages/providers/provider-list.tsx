import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cloud, Globe, KeyRound, LayoutGrid, List, Plus } from "lucide-react";

// Dummy data for demonstration
const providers = [
  {
    id: "1",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-proj-12345...67890",
  },
  {
    id: "2",
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKey: "sk-ant-98765...43210",
  },
  {
    id: "3",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKey: "gsk_abcdef123...45678",
  },
  {
    id: "4",
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    apiKey: "tgr_12345678...90123",
  },
];

export function ProviderList() {
  const [view, setView] = useState<"table" | "card">("table");

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Providers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all LLM providers and their API credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-md border p-1">
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setView("table")}
            >
              <List className="mr-2 h-4 w-4" />
              Table
            </Button>
            <Button
              variant={view === "card" ? "secondary" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setView("card")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Cards
            </Button>
          </div>

          {/* Add New Provider Button (Does nothing for now) */}
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Provider
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider Name</TableHead>
                <TableHead>Base URL</TableHead>
                <TableHead>API Key</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-orange-500" />
                      {provider.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {provider.baseUrl}
                      </code>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                      <KeyRound className="h-4 w-4 text-muted-foreground/70" />
                      {provider.apiKey}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className="flex flex-col cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                    <Cloud className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-3 border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Globe className="mr-2 h-4 w-4 text-blue-500" />
                    Base URL
                  </span>
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {provider.baseUrl}
                  </code>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <KeyRound className="mr-2 h-4 w-4 text-muted-foreground/70" />
                    API Key
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {provider.apiKey}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
