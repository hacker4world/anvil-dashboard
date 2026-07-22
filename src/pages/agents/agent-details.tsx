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
  ArrowLeft,
  Bot,
  CheckCircle,
  Cpu,
  MessageSquare,
  Wrench,
  FileText,
  Settings,
  Activity,
  Database,
  Link as LinkIcon,
  Lock,
  Save,
  Trash2,
  Unlock,
  Users,
} from "lucide-react";

// --- Types ---
type AgentStatus = "Active" | "Idle" | "Offline";

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  status: AgentStatus;
  totalMessages: number;
  totalToolCalls: number;
  modelsUsed: number;
  totalProjects: number;
}

interface Model {
  id: string;
  name: string;
  messages: number;
  tokens: string;
}

interface Project {
  id: string;
  name: string;
  path: string;
  messages: number;
  lastActive: string;
}

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  role: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  invocations: number;
  successRate: string;
}

// --- Dummy Data ---
const agentInfo: Agent = {
  id: "1",
  name: "Code Reviewer",
  description:
    "An autonomous agent specialized in reviewing code changes, identifying bugs, and suggesting improvements. It analyzes pull requests and provides detailed feedback.",
  systemPrompt:
    "You are a senior code reviewer with expertise in multiple programming languages. Your goal is to review code changes, identify bugs, security vulnerabilities, and suggest improvements. Be constructive and provide actionable feedback.",
  status: "Active",
  totalMessages: 1240,
  totalToolCalls: 856,
  modelsUsed: 4,
  totalProjects: 12,
};

const modelsList: Model[] = [
  { id: "1", name: "GPT-4o", messages: 8200, tokens: "2.4M" },
  { id: "2", name: "Claude 3.5 Sonnet", messages: 4100, tokens: "1.1M" },
  { id: "3", name: "Gemini 1.5 Pro", messages: 2100, tokens: "800K" },
  { id: "4", name: "Llama 3 70B", messages: 1030, tokens: "450K" },
];

const projectsList: Project[] = [
  {
    id: "1",
    name: "Anvil Core",
    path: "/projects/anvil-core",
    messages: 856,
    lastActive: "2 mins ago",
  },
  {
    id: "2",
    name: "Dashboard UI",
    path: "/projects/dashboard-ui",
    messages: 234,
    lastActive: "15 mins ago",
  },
  {
    id: "3",
    name: "API Gateway",
    path: "/projects/api-gateway",
    messages: 156,
    lastActive: "1 hour ago",
  },
  {
    id: "4",
    name: "Authentication Service",
    path: "/projects/auth-service",
    messages: 89,
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "Database Migration",
    path: "/projects/db-migration",
    messages: 45,
    lastActive: "5 hours ago",
  },
];

const messagesList: Message[] = [
  {
    id: "1",
    user: "Alice Johnson",
    message: "Please review the PR for the authentication module.",
    timestamp: "2 mins ago",
    role: "Developer",
  },
  {
    id: "2",
    user: "Bob Smith",
    message: "Can you check if there are any security vulnerabilities?",
    timestamp: "15 mins ago",
    role: "Security Engineer",
  },
  {
    id: "3",
    user: "Charlie Davis",
    message: "The code review is taking too long. Can you speed it up?",
    timestamp: "1 hour ago",
    role: "Manager",
  },
  {
    id: "4",
    user: "Diana Prince",
    message: "I need a detailed analysis of the performance issues.",
    timestamp: "3 hours ago",
    role: "DevOps",
  },
  {
    id: "5",
    user: "Evan Wright",
    message: "Can you review the database migration script?",
    timestamp: "5 hours ago",
    role: "Backend Developer",
  },
];

const toolsList: Tool[] = [
  {
    id: "1",
    name: "Web Search",
    description: "Search the internet for real-time information.",
    invocations: 420,
    successRate: "98%",
  },
  {
    id: "2",
    name: "Code Execution",
    description: "Run Python or Node.js code in a secure sandbox.",
    invocations: 210,
    successRate: "94%",
  },
  {
    id: "3",
    name: "File Reader",
    description: "Read and parse files from the project directory.",
    invocations: 180,
    successRate: "100%",
  },
  {
    id: "4",
    name: "GitHub API",
    description: "Interact with GitHub repositories and PRs.",
    invocations: 95,
    successRate: "99%",
  },
  {
    id: "5",
    name: "Database Access",
    description: "Query the connected PostgreSQL database.",
    invocations: 45,
    successRate: "97%",
  },
];

// --- Helper Functions ---
const getStatusClasses = (status: AgentStatus) => {
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
export function AgentDetails() {
  const [isEditable, setIsEditable] = useState(false);

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
                {agentInfo.name}
              </h1>
              <Badge
                variant="outline"
                className={getStatusClasses(agentInfo.status)}
              >
                {agentInfo.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              {agentInfo.id}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditable(!isEditable)}>
            {isEditable ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Edit Mode
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Agent
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* TAB 1: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Messages
                </CardTitle>
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agentInfo.totalMessages.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tool Calls
                </CardTitle>
                <Wrench className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agentInfo.totalToolCalls.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Models Used
                </CardTitle>
                <Cpu className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agentInfo.modelsUsed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </CardTitle>
                <Activity className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agentInfo.totalProjects}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Model List Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  Models Used
                </CardTitle>
                <CardDescription>
                  Breakdown of LLM usage by this agent.
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
                    {modelsList.map((model) => (
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

            {/* Projects List Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  Projects List
                </CardTitle>
                <CardDescription>
                  Projects where this agent is actively used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead className="text-right">Messages</TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsList.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{project.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {project.path}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {project.messages.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground whitespace-nowrap text-sm">
                          {project.lastActive}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Messages Sent to Agent Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Messages Sent to Agent
              </CardTitle>
              <CardDescription>
                Recent interactions and messages sent to this agent.
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
                  {messagesList.map((msg) => (
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
        </TabsContent>

        {/* TAB 2: BASIC INFORMATION */}
        <TabsContent value="basic">
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isEditable
                      ? "bg-green-100 text-green-600"
                      : "bg-muted text-muted-foreground"
                  }`}
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
                    Toggle this switch to edit agent details.
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
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>
                Update agent name, description, and system prompt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <div className="relative">
                  <Bot className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="agent-name"
                    defaultValue={agentInfo.name}
                    disabled={!isEditable}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Agent Description Field */}
              <div className="grid gap-2">
                <Label htmlFor="agent-description">Description</Label>
                <Textarea
                  id="agent-description"
                  defaultValue={agentInfo.description}
                  disabled={!isEditable}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* System Prompt Field */}
              <div className="grid gap-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  defaultValue={agentInfo.systemPrompt}
                  disabled={!isEditable}
                  rows={8}
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define the agent's persona, goals, and constraints. This
                  message is sent at the beginning of every conversation.
                </p>
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

        {/* TAB 3: TOOLS */}
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5 text-orange-500" />
                Assigned Tools
              </CardTitle>
              <CardDescription>
                Tools and capabilities available to this agent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {toolsList.map((tool) => (
                  <div
                    key={tool.id}
                    className="relative flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:bg-muted/50"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/10">
                      <Wrench className="h-5 w-5 text-orange-600" />
                    </div>

                    <h3 className="mb-1 font-semibold">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {tool.description}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded bg-muted px-2 py-1">
                        <span className="text-muted-foreground">
                          Invocations:
                        </span>
                        <span className="ml-1 font-medium">
                          {tool.invocations.toLocaleString()}
                        </span>
                      </div>
                      <div className="rounded bg-muted px-2 py-1">
                        <span className="text-muted-foreground">Success:</span>
                        <span className="ml-1 font-medium">
                          {tool.successRate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
