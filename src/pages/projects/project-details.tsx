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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle,
  Clock,
  Cpu,
  Flag,
  Link as LinkIcon,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Unlock,
  Users,
  Wand2,
} from "lucide-react";

// --- Types ---
type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

// --- Dummy Data ---
const projectInfo = {
  name: "Anvil Core",
  path: "/projects/anvil-core",
  url: "https://github.com/anvil/anvil-core",
  overview:
    "Anvil Core is the central processing engine responsible for handling asynchronous tasks, message queuing, and LLM integration across the platform. It serves as the backbone for all automated workflows.",
  indexed: true,
};

const stats = [
  {
    title: "Total Messages",
    value: "15,430",
    icon: MessageSquare,
    color: "text-blue-500",
  },
  { title: "Models Used", value: "4", icon: Cpu, color: "text-purple-500" },
  {
    title: "Completed Tasks",
    value: "42",
    icon: CheckCircle,
    color: "text-green-500",
  },
  { title: "Pending Tasks", value: "8", icon: Clock, color: "text-orange-500" },
];

const modelsUsed = [
  { id: "1", name: "GPT-4o", messages: 8200, tokens: "2.4M" },
  { id: "2", name: "Claude 3.5 Sonnet", messages: 4100, tokens: "1.1M" },
  { id: "3", name: "Gemini 1.5 Pro", messages: 2100, tokens: "800K" },
  { id: "4", name: "Llama 3 70B", messages: 1030, tokens: "450K" },
];

const recentMessages = [
  {
    id: "1",
    user: "Alice Johnson",
    message: "How do I configure the database connection pool?",
    timestamp: "2 mins ago",
    role: "Developer",
  },
  {
    id: "2",
    user: "Bob Smith",
    message: "Can you review the PR for the authentication module?",
    timestamp: "15 mins ago",
    role: "Developer",
  },
  {
    id: "3",
    user: "Charlie Davis",
    message: "What's the deployment status for staging?",
    timestamp: "1 hour ago",
    role: "Manager",
  },
  {
    id: "4",
    user: "Diana Prince",
    message: "I'm getting a 500 error when hitting the /api/users endpoint.",
    timestamp: "3 hours ago",
    role: "QA",
  },
  {
    id: "5",
    user: "Evan Wright",
    message: "The CI/CD pipeline is failing at the test stage.",
    timestamp: "5 hours ago",
    role: "DevOps",
  },
];

// NEW: Agents Data
const agentsUsed = [
  {
    id: "1",
    name: "Code Reviewer",
    status: "Active",
    tasksHandled: 124,
    lastActive: "2 mins ago",
  },
  {
    id: "2",
    name: "Bug Triager",
    status: "Active",
    tasksHandled: 89,
    lastActive: "15 mins ago",
  },
  {
    id: "3",
    name: "Docs Generator",
    status: "Idle",
    tasksHandled: 45,
    lastActive: "2 hours ago",
  },
  {
    id: "4",
    name: "Security Scanner",
    status: "Offline",
    tasksHandled: 12,
    lastActive: "1 day ago",
  },
];

// NEW: Skills Data
const skillsUsed = [
  {
    id: "1",
    name: "Web Search",
    category: "Information Retrieval",
    invocations: 420,
    successRate: "98%",
  },
  {
    id: "2",
    name: "Code Execution",
    category: "Sandbox",
    invocations: 210,
    successRate: "94%",
  },
  {
    id: "3",
    name: "File Reader",
    category: "File System",
    invocations: 180,
    successRate: "100%",
  },
  {
    id: "4",
    name: "GitHub API",
    category: "Integration",
    invocations: 95,
    successRate: "99%",
  },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Refactor authentication module",
    status: "In Progress",
    priority: "High",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    title: "Update API documentation",
    status: "Pending",
    priority: "Medium",
    createdAt: "5 days ago",
  },
  {
    id: "3",
    title: "Fix database connection pooling",
    status: "Completed",
    priority: "High",
    createdAt: "1 week ago",
  },
  {
    id: "4",
    title: "Design new dashboard wireframes",
    status: "Pending",
    priority: "Low",
    createdAt: "2 weeks ago",
  },
];

// --- Helper Functions ---
const getPriorityClasses = (priority: TaskPriority) => {
  switch (priority) {
    case "High":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "Medium":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "Low":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "";
  }
};

const getAgentStatusClasses = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Idle":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "Offline":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    default:
      return "";
  }
};

// --- Main Component ---
export function ProjectDetails() {
  const [isEditable, setIsEditable] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<TaskPriority>("Medium");

  // Delete Project state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Task Handlers
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: "Pending",
      priority: newTaskPriority,
      createdAt: "Just now",
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    setIsTaskModalOpen(false);
  };

  // Global Project Handlers
  const handleIndexProject = () => {
    toast.loading("Indexing project...", {
      description:
        "This process runs in the background. You'll be notified when it's done.",
    });

    setTimeout(() => {
      toast.success("Project indexed successfully!", {
        description: "All project files have been processed.",
      });
    }, 3000);
  };

  const handleDeleteProject = () => {
    setDeleteConfirmText("");
    setIsDeleteModalOpen(false);

    toast.success("Project deleted successfully.", {
      description: `${projectInfo.name} has been permanently removed.`,
    });
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {projectInfo.name}
              </h1>
              <Badge variant={projectInfo.indexed ? "default" : "outline"}>
                {projectInfo.indexed ? "Indexed" : "Not Indexed"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              {projectInfo.path}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleIndexProject}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Index Project
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
        </TabsList>

        {/* TAB 1: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* First Row of Tables: Models & Messages */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  Models Used
                </CardTitle>
                <CardDescription>
                  Breakdown of LLM usage in this project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead className="text-right">Messages</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelsUsed.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">
                          {model.name}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {model.messages.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {model.tokens}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  Recent User Messages
                </CardTitle>
                <CardDescription>
                  Latest interactions from project members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMessages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">
                              {msg.role}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate text-muted-foreground"
                          title={msg.message}
                        >
                          {msg.message}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                          {msg.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* NEW: Second Row of Tables: Agents & Skills */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-emerald-500" />
                  Agents Used
                </CardTitle>
                <CardDescription>
                  Autonomous agents deployed in this project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Tasks</TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentsUsed.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">
                          {agent.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getAgentStatusClasses(agent.status)}
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {agent.tasksHandled}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground whitespace-nowrap text-sm">
                          {agent.lastActive}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 className="h-5 w-5 text-pink-500" />
                  Skills Used
                </CardTitle>
                <CardDescription>
                  Tools and capabilities utilized by agents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Skill</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Invocations</TableHead>
                      <TableHead className="text-right">Success</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skillsUsed.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">
                          {skill.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {skill.category}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {skill.invocations.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {skill.successRate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: PROJECT DETAILS */}
        <TabsContent value="details">
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${isEditable ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                >
                  {isEditable ? (
                    <Unlock className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {isEditable
                      ? "Modifications Enabled"
                      : "Modifications Locked"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Toggle this switch to edit project details.
                  </p>
                </div>
              </div>
              <Switch
                checked={isEditable}
                onCheckedChange={setIsEditable}
                aria-label="Toggle modifications"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
              <CardDescription>
                Update project name, URL, and overview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Project Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={projectInfo.name}
                  disabled={!isEditable}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-url">Project URL</Label>
                <div className="relative">
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-url"
                    type="url"
                    defaultValue={projectInfo.url}
                    disabled={!isEditable}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-overview">Project Overview</Label>
                <Textarea
                  id="edit-overview"
                  defaultValue={projectInfo.overview}
                  disabled={!isEditable}
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" disabled={!isEditable}>
                  Cancel
                </Button>
                <Button disabled={!isEditable}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PROJECT TASKS */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage and track tasks associated with this project.
                </CardDescription>
              </div>

              <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to the project tracker.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="e.g. Refactor login API"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select
                        value={newTaskPriority}
                        onValueChange={(value) =>
                          setNewTaskPriority(value as TaskPriority)
                        }
                      >
                        <SelectTrigger id="task-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsTaskModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead className="w-[120px]">Priority</TableHead>
                      <TableHead className="w-[180px]">Status</TableHead>
                      <TableHead className="w-[120px]">Added</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No tasks found. Create one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`gap-1 ${getPriorityClasses(task.priority)}`}
                            >
                              <Flag className="h-3 w-3" />
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={task.status}
                              onValueChange={(value) =>
                                handleStatusChange(task.id, value as TaskStatus)
                              }
                            >
                              <SelectTrigger className="h-8 w-full text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="Completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {task.createdAt}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DELETE PROJECT MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>

            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-bold tracking-tight">
                Delete Project
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This action is permanent and cannot be undone. All tasks,
                messages, and configurations will be lost.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                To confirm, type the project name below:
              </p>
              <div className="flex justify-center">
                <code className="rounded-md bg-muted px-3 py-1.5 font-mono text-sm font-semibold text-foreground ring-1 ring-border">
                  {projectInfo.name}
                </code>
              </div>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type project name here"
                className="text-center font-medium border-red-200 focus-visible:ring-red-500/50"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== projectInfo.name}
              onClick={handleDeleteProject}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
