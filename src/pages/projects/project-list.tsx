import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Folder,
  LayoutGrid,
  List,
  MessageSquare,
  Plus,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data for demonstration
const projects = [
  {
    id: "1",
    name: "Anvil Core",
    path: "/projects/anvil-core",
    indexed: true,
    totalMessages: 15430,
  },
  {
    id: "2",
    name: "Website Redesign",
    path: "/var/www/redesign-2024",
    indexed: false,
    totalMessages: 0,
  },
  {
    id: "3",
    name: "API Microservices",
    path: "/srv/api-gateway",
    indexed: true,
    totalMessages: 892,
  },
  {
    id: "4",
    name: "Mobile App",
    path: "/Users/dev/mobile-app",
    indexed: false,
    totalMessages: 45,
  },
];

export function ProjectList() {
  const [view, setView] = useState<"table" | "card">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectPath, setProjectPath] = useState("");

  const handleCreateProject = () => {
    // Does nothing for now, just logging and closing the modal
    console.log("Creating project:", { name: projectName, path: projectPath });
    setIsModalOpen(false);

    // Reset form fields
    setProjectName("");
    setProjectPath("");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all projects associated with Anvil
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

          {/* Create Project Button with Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Enter the details for your new project. Click create when
                  you're done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 py-4">
                {/* Project Name Field */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <div className="relative">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Anvil Core"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Project Path Field */}
                <div className="grid gap-2">
                  <Label htmlFor="path">Folder Path</Label>
                  <div className="relative">
                    <Folder className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="path"
                      value={projectPath}
                      onChange={(e) => setProjectPath(e.target.value)}
                      placeholder="/path/to/project"
                      className="pl-9 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleCreateProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Folder Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Messages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/projects/details")}
                >
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center text-muted-foreground">
                      <Folder className="mr-2 h-4 w-4" />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {project.path}
                      </code>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.indexed ? "default" : "outline"}>
                      {project.indexed ? "Indexed" : "Not Indexed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {project.totalMessages.toLocaleString()}
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
          {projects.map((project) => (
            <Card
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/projects/details")}
              key={project.id}
              className="flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={project.indexed ? "default" : "outline"}>
                    {project.indexed ? "Indexed" : "Not Indexed"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center pt-1">
                  <Folder className="mr-2 h-3.5 w-3.5" />
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {project.path}
                  </code>
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {project.totalMessages.toLocaleString()}
                  </span>{" "}
                  total messages
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
