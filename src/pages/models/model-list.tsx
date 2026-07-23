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
import {
  Brackets,
  Cpu,
  DollarSign,
  LayoutGrid,
  List,
  MessageSquare,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data for demonstration
const models = [
  {
    id: "1",
    name: "GPT-4o",
    pricing: "$5.00 / 1M tokens",
    contextWindow: "128,000 tokens",
    totalMessages: 8200,
  },
  {
    id: "2",
    name: "Claude 3.5 Sonnet",
    pricing: "$3.00 / 1M tokens",
    contextWindow: "200,000 tokens",
    totalMessages: 4100,
  },
  {
    id: "3",
    name: "Gemini 1.5 Pro",
    pricing: "$1.25 / 1M tokens",
    contextWindow: "1,000,000 tokens",
    totalMessages: 2100,
  },
  {
    id: "4",
    name: "Llama 3 70B",
    pricing: "$0.60 / 1M tokens",
    contextWindow: "8,000 tokens",
    totalMessages: 1030,
  },
];

export function ModelList() {
  const [view, setView] = useState<"table" | "card">("table");

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Models
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all LLM models associated with Anvil
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

          {/* Add New Model Button (Does nothing for now) */}
          <Button onClick={() => navigate("/models/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Model
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Context Window</TableHead>
                <TableHead className="text-right">
                  Total Messages Sent
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow
                  onClick={() => navigate("/models/details")}
                  key={model.id}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-purple-500" />
                      {model.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      {model.pricing}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Brackets className="h-4 w-4 text-blue-500" />
                      {model.contextWindow}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-2 text-muted-foreground">
                      {model.totalMessages.toLocaleString()}
                      <MessageSquare className="h-4 w-4 text-orange-500" />
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
          {models.map((model) => (
            <Card
              onClick={() => navigate("/models/details")}
              key={model.id}
              className="flex flex-col cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                    <Cpu className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-3 border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    Pricing
                  </span>
                  <span className="font-medium tabular-nums">
                    {model.pricing}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Brackets className="mr-2 h-4 w-4 text-blue-500" />
                    Context Window
                  </span>
                  <span className="font-medium tabular-nums">
                    {model.contextWindow}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <MessageSquare className="mr-2 h-4 w-4 text-orange-500" />
                    Total Messages
                  </span>
                  <span className="font-medium tabular-nums">
                    {model.totalMessages.toLocaleString()}
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
