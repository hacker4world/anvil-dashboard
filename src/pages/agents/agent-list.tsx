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
  ArrowRight,
  Bot,
  LayoutGrid,
  List,
  MessageSquare,
  Plus,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data for demonstration
const agents = [
  {
    id: "1",
    name: "Code Reviewer",
    totalMessages: 1240,
    toolsCount: 5,
  },
  {
    id: "2",
    name: "Bug Triager",
    totalMessages: 890,
    toolsCount: 3,
  },
  {
    id: "3",
    name: "Docs Generator",
    totalMessages: 450,
    toolsCount: 2,
  },
  {
    id: "4",
    name: "Security Scanner",
    totalMessages: 120,
    toolsCount: 8,
  },
];

export function AgentList() {
  const [view, setView] = useState<"table" | "card">("table");
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Agents
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all autonomous agents associated with Anvil
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-md border bg-card p-1 shadow-sm">
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="sm"
              className="cursor-pointer rounded-md transition-all"
              onClick={() => setView("table")}
            >
              <List className="mr-2 h-4 w-4" />
              Table
            </Button>
            <Button
              variant={view === "card" ? "secondary" : "ghost"}
              size="sm"
              className="cursor-pointer rounded-md transition-all"
              onClick={() => setView("card")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Cards
            </Button>
          </div>

          {/* Add New Agent Button */}
          <Button
            onClick={() => navigate("/agents/create")}
            className="rounded-md shadow-sm transition-all hover:shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Agent
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead>Agent Name</TableHead>
                <TableHead className="text-right">
                  Total Messages Sent
                </TableHead>
                <TableHead className="text-right">Tools Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow
                  onClick={() => navigate(`/agents/details`)}
                  key={agent.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-emerald-500" />
                      {agent.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-2 text-muted-foreground">
                      {agent.totalMessages.toLocaleString()}
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-2 text-muted-foreground">
                      {agent.toolsCount}
                      <Wrench className="h-4 w-4 text-orange-500" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Card View - Modernized */}
      {view === "card" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="group relative flex flex-col cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Card Header with Icon */}
              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                        {agent.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Autonomous Agent
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="relative flex-1 space-y-4 border-t pt-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Messages Metric */}
                  <div className="rounded-lg bg-blue-50/50 p-3 transition-colors group-hover:bg-blue-50 dark:bg-blue-950/20 dark:group-hover:bg-blue-950/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10">
                        <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Messages
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground tabular-nums">
                      {agent.totalMessages.toLocaleString()}
                    </p>
                  </div>

                  {/* Tools Metric */}
                  <div className="rounded-lg bg-orange-50/50 p-3 transition-colors group-hover:bg-orange-50 dark:bg-orange-950/20 dark:group-hover:bg-orange-950/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/10">
                        <Wrench className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Tools
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground tabular-nums">
                      {agent.toolsCount}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-lg text-sm font-medium transition-all group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:bg-emerald-950/20 dark:group-hover:text-emerald-400"
                >
                  <span>View Agent Details</span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
