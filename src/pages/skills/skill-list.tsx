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
import { Activity, LayoutGrid, List, Plus, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data for demonstration
const skills = [
  {
    id: "1",
    name: "Web Search",
    description:
      "Searches the internet for real-time information, news, and public web pages.",
    totalUsages: 1240,
  },
  {
    id: "2",
    name: "Code Execution",
    description:
      "Executes Python or Node.js code securely in an isolated sandbox environment.",
    totalUsages: 890,
  },
  {
    id: "3",
    name: "File Reader",
    description:
      "Reads, parses, and extracts text from local files (PDF, TXT, MD, CSV).",
    totalUsages: 450,
  },
  {
    id: "4",
    name: "Database Access",
    description:
      "Runs read-only SQL queries against the connected PostgreSQL database.",
    totalUsages: 120,
  },
];

export function SkillList() {
  const [view, setView] = useState<"table" | "card">("table");

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Skills
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all tools and capabilities available to your agents
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

          {/* Add New Skill Button (Does nothing for now) */}
          <Button onClick={() => navigate("/skills/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Skill
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Total Usages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow
                  key={skill.id}
                  className="cursor-pointer"
                  onClick={() => navigate("/skills/details")}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-pink-500" />
                      {skill.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className="block max-w-md truncate text-muted-foreground"
                      title={skill.description}
                    >
                      {skill.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-2 text-muted-foreground">
                      {skill.totalUsages.toLocaleString()}
                      <Activity className="h-4 w-4 text-blue-500" />
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
          {skills.map((skill) => (
            <Card
              onClick={() => navigate("/skills/details")}
              key={skill.id}
              className="flex flex-col cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10">
                    <Wand2 className="h-5 w-5 text-pink-500" />
                  </div>
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-3 border-t pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                  {skill.description}
                </p>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="flex items-center text-muted-foreground">
                    <Activity className="mr-2 h-4 w-4 text-blue-500" />
                    Total Usages
                  </span>
                  <span className="font-medium tabular-nums">
                    {skill.totalUsages.toLocaleString()}
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
